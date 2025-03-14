import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import IAppointment, {
  IAppointmentPopulated,
  IAppointmentService,
} from "../../interfaces/IAppointment";
import IAppointmentRepository from "../../repositories/appointment/interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";
import { generateBookingConfirmationHtml } from "../../helpers/bookingConfirmationHtml";
import { extractDate, extractTime } from "../../utils/dateUtils";
import { sendEmail } from "../../utils/mailer";
import { constructWebhookEvent, createPaymentIntent } from "../../utils/stripe";
import Stripe from "stripe";
import { generateBookingCancellationHtml } from "../../helpers/bookingCancellationHtml";
import { generateBookingConfirmationHtmlForDoctor } from "../../helpers/bookingConfirmationHtmlForDoctor";
import { generateBookingCancellationHtmlForDoctor } from "../../helpers/bookingCancellationHtmlForDoctor";
import { INotificationService } from "../notification/interface/INotificationService";
import { INotification } from "src/interfaces/INotification";
import { Types } from "mongoose";

class AppointmentService implements IAppointmentService {
  private appointmentRepo: IAppointmentRepository;
  private scheduleRepo: IScheduleRepository;
  private notificationService: INotificationService;

  constructor(
    appointmentRepo: IAppointmentRepository,
    scheduleRepo: IScheduleRepository,
    notificationService: INotificationService
  ) {
    this.appointmentRepo = appointmentRepo;
    this.scheduleRepo = scheduleRepo;
    this.notificationService = notificationService;
  }

  async createAppointment(
    appointmentData: IAppointment
  ): Promise<IAppointmentPopulated> {
    try {
      const { doctor, slotId, dayId } = appointmentData;

      // Update booking status
      if (doctor && slotId && dayId) {
        await this.scheduleRepo.updateBookingStatus(
          doctor.toString(),
          dayId,
          slotId
        );
      }

      // Create the appointment
      const appointment =
        await this.appointmentRepo.createAppointment(appointmentData);

      const populatedAppointment =
        await this.appointmentRepo.getAppointmentById(
          appointment._id as string
        );

      // Send booking confirmation email to patient
      if (
        populatedAppointment.status === "confirmed" &&
        populatedAppointment.doctor &&
        populatedAppointment.patient &&
        populatedAppointment.date
      ) {
        const {
          _id: doctorId,
          firstName: doctorFirstName,
          lastName: doctorLastName,
          email: doctorEmail,
        } = populatedAppointment.doctor;
        const {
          _id: patientId,
          firstName: patientFirstName,
          lastName: patientLastName,
          email: patientEmail,
        } = populatedAppointment.patient;

        const date = extractDate(populatedAppointment.date);
        const time = extractTime(populatedAppointment.date);

        const patientHtml = generateBookingConfirmationHtml(
          `${doctorFirstName} ${doctorLastName}`,
          `${patientFirstName} ${patientLastName}`,
          date,
          time
        );
        const doctorHtml = generateBookingConfirmationHtmlForDoctor(
          `${doctorFirstName} ${doctorLastName}`,
          `${patientFirstName} ${patientLastName}`,
          date,
          time
        );

        await Promise.all([
          sendEmail(
            patientEmail,
            "Booking Confirmation",
            undefined,
            patientHtml
          ),
          sendEmail(doctorEmail, "Booking Confirmation", undefined, doctorHtml),
        ]);

        const notificationForPatient: Partial<INotification> = {
          user: patientId as Types.ObjectId,
          userType: "Patient",
          title: "Appointment Confirmation",
          message: `Your appointment has been schedulued with dr. ${doctorFirstName} ${doctorLastName} on ${date} at ${time}`,
          type: "appointments",
          priority: "medium",
        };

        const notificationForDoctor: Partial<INotification> = {
          user: doctorId as Types.ObjectId,
          userType: "Doctor",
          title: "New Appointment",
          message: `An Appointment has been scheduled with ${patientFirstName} ${patientLastName} on ${date} at ${time}`,
          type: "appointments",
          priority: "medium",
        };

        await Promise.all([
          this.notificationService.createNotification(notificationForPatient),
          this.notificationService.createNotification(notificationForDoctor),
        ]);
      }

      return populatedAppointment;
    } catch (error) {
      logger.error("Error creating appointment", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentById(
    appointmentId: string
  ): Promise<Partial<IAppointmentPopulated>> {
    const appointment =
      await this.appointmentRepo.getAppointmentById(appointmentId);
    return appointment;
  }

  async updateAppointment(
    appointmentId: string,
    updateData: Partial<IAppointment>
  ): Promise<IAppointment> {
    try {
      const { doctor, slotId, dayId } = updateData;

      // Fetch the existing appointment
      const existingAppointment =
        await this.appointmentRepo.getAppointmentById(appointmentId);

      // Handle slot booking status updates
      if (doctor && slotId && dayId) {
        if (existingAppointment.dayId && existingAppointment.slotId) {
          await this.scheduleRepo.toggleBookingStatus(
            doctor.toString(),
            existingAppointment.dayId,
            existingAppointment.slotId
          );
        }
        await this.scheduleRepo.updateBookingStatus(
          doctor.toString(),
          dayId,
          slotId
        );
      }

      // Update the appointment
      const updatedAppointment = await this.appointmentRepo.updateAppointment(
        appointmentId,
        updateData
      );
      const appointmentData = await this.getAppointmentById(appointmentId);

      // Handle email notifications based on appointment status
      if (appointmentData.status === "confirmed") {
        if (appointmentData?.doctor && appointmentData.patient) {
          const {
            _id: doctorId,
            firstName: doctorFirstName,
            lastName: doctorLastName,
            email: doctorEmail,
          } = appointmentData.doctor;
          const {
            _id: patientId,
            firstName: patientFirstName,
            lastName: patientLastName,
            email: patientEmail,
          } = appointmentData.patient;

          if (appointmentData.date) {
            // Send booking confirmation email
            const oldDate = extractDate(existingAppointment.date);
            const oldTime = extractTime(existingAppointment.date);
            const date = extractDate(appointmentData.date);
            const time = extractTime(appointmentData.date);

            const patientHtml = generateBookingConfirmationHtml(
              `${doctorFirstName} ${doctorLastName}`,
              `${patientFirstName} ${patientLastName}`,
              date,
              time
            );
            const doctorHtml = generateBookingConfirmationHtmlForDoctor(
              `${doctorFirstName} ${doctorLastName}`,
              `${patientFirstName} ${patientLastName}`,
              date,
              time
            );

            await Promise.all([
              sendEmail(
                patientEmail,
                "Booking Confirmation",
                undefined,
                patientHtml
              ),
              sendEmail(
                doctorEmail,
                "Booking Confirmation",
                undefined,
                doctorHtml
              ),
            ]);

            const notificationForPatient: Partial<INotification> = {
              user: patientId as Types.ObjectId,
              userType: "Patient",
              title: "Appointment Rescheduled",
              message: `Your appointment with dr. ${doctorFirstName} ${doctorLastName} on ${oldDate} at ${oldTime} has been rescheduled to ${date} at ${time}`,
              type: "appointments",
              priority: "medium",
            };

            const notificationForDoctor: Partial<INotification> = {
              user: doctorId as Types.ObjectId,
              userType: "Doctor",
              title: "Appointment Rescheduled",
              message: `Your appointment with patient ${patientFirstName} ${patientLastName} on ${oldDate} at ${oldTime} has been rescheduled to ${date} at ${time}`,
              type: "appointments",
              priority: "medium",
            };

            await Promise.all([
              this.notificationService.createNotification(
                notificationForPatient
              ),
              this.notificationService.createNotification(
                notificationForDoctor
              ),
            ]);
          }
        }
      }

      return updatedAppointment;
    } catch (error) {
      logger.error("Error updating appointment", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      // get existing appointment
      const appointmentData =
        await this.appointmentRepo.getAppointmentById(appointmentId);

      // don't allow cancellation if the appointment is 2hrs from now
      const now = new Date();
      const appointmentDate = new Date(appointmentData.date);
      const timeDifference = appointmentDate.getTime() - now.getTime();
      const twoHoursInMillis = 2 * 60 * 60 * 1000;

      if (timeDifference < twoHoursInMillis) {
        throw new AppError(
          "Cancellation not allowed within 2 hours of the appointment",
          400
        );
      }

      const doctorId =
        typeof appointmentData.doctor._id === "string"
          ? appointmentData.doctor._id.toString()
          : "";

      // toggle booking status for cancelled appointment
      await this.scheduleRepo.toggleBookingStatus(
        doctorId,
        appointmentData.dayId,
        appointmentData.slotId
      );

      // update the appointment status to "cancelled"
      await this.appointmentRepo.updateAppointment(appointmentId, {
        status: "cancelled",
      });

      // Send cancellation email
      const {
        firstName: doctorFirstName,
        lastName: doctorLastName,
        email: doctorEmail,
      } = appointmentData.doctor;
      const {
        firstName: patientFirstName,
        lastName: patientLastName,
        email: patientEmail,
      } = appointmentData.patient;

      const date = extractDate(appointmentData.date);
      const time = extractTime(appointmentData.date);

      const patientHtml = generateBookingCancellationHtml(
        `${doctorFirstName} ${doctorLastName}`,
        `${patientFirstName} ${patientLastName}`,
        date,
        time
      );

      const doctorHtml = generateBookingCancellationHtmlForDoctor(
        `${doctorFirstName} ${doctorLastName}`,
        `${patientFirstName} ${patientLastName}`,
        date,
        time
      );

      await Promise.all([
        sendEmail(patientEmail, "Booking Cancellation", undefined, patientHtml),
        sendEmail(doctorEmail, "Booking Cancellation", undefined, doctorHtml),
      ]);
    } catch (error) {
      logger.error("Error cancelling appointment", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentsByUserId(
    userId: string,
    role: string
  ): Promise<IAppointment[]> {
    try {
      let appointments: IAppointment[] = [];

      if (role === "patient") {
        appointments =
          await this.appointmentRepo.getAppointmentsByPatientId(userId);
      } else if (role === "doctor") {
        appointments =
          await this.appointmentRepo.getAppointmentsByDoctorId(userId);
      }

      return appointments;
    } catch (error) {
      logger.error(`Error getting appointments with ${role} id`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointments(): Promise<IAppointment[]> {
    try {
      const appointments = await this.appointmentRepo.getAppointments();

      return appointments;
    } catch (error) {
      logger.error(`Error getting appointments for admin`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async stripePayment(
    appointmentData: IAppointment
  ): Promise<{ clientSecret: string }> {
    try {
      const paymentIntent = await createPaymentIntent(
        appointmentData.fee,
        "inr",
        appointmentData
      );
      return { clientSecret: paymentIntent.client_secret || "" };
    } catch (error) {
      logger.error(`Error stripe payment`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async handleWebHook(payload: Buffer, sig: string) {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
      }

      const event = await constructWebhookEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(event.data.object);
          break;

        case "payment_intent.canceled":
          await this.handlePaymentIntentCanceled(event.data.object);
          break;

        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Error stripe payment`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentByPaymentId(
    paymentIntentId: string
  ): Promise<IAppointmentPopulated> {
    const appointment =
      await this.appointmentRepo.getAppointmentByPaymentId(paymentIntentId);
    return appointment;
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "confirmed",
      paymentStatus: "completed",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.createAppointment(appointment);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "pending",
      paymentStatus: "failed",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.createAppointment(appointment);
  }

  private async handlePaymentIntentCanceled(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "cancelled",
      paymentStatus: "cancelled",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.createAppointment(appointment);
  }

  private createAppointmentObject(metadata: Stripe.Metadata) {
    return {
      doctor: metadata.doctor,
      patientType: metadata.patientType,
      patient: metadata.patient,
      specialization: metadata.specialization,
      date: metadata.date,
      duration: metadata.duration,
      reason: metadata.reason,
      fee: Number(metadata.fee),
      slotId: metadata.slotId,
      dayId: metadata.dayId,
    };
  }
}

export default AppointmentService;
