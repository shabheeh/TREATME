import logger from "../../configs/logger";
import IAppointment, {
  IAppointmentPopulated,
  IAppointmentService,
} from "../../interfaces/IAppointment";
import IAppointmentRepository, {
  IPatientForDoctor,
} from "../../repositories/appointment/interfaces/IAppointmentRepository";
import { AppError } from "../../utils/errors";
import { generateBookingConfirmationHtml } from "../../helpers/bookingConfirmationHtml";
import { extractDate, extractTime } from "../../utils/dateUtils";
import { sendEmail } from "../../utils/mailer";
import { generateBookingCancellationHtml } from "../../helpers/bookingCancellationHtml";
import { generateBookingConfirmationHtmlForDoctor } from "../../helpers/bookingConfirmationHtmlForDoctor";
import { generateBookingCancellationHtmlForDoctor } from "../../helpers/bookingCancellationHtmlForDoctor";
import { INotificationService } from "../notification/interface/INotificationService";
import { INotification } from "src/interfaces/INotification";
import { Types } from "mongoose";
import { IWalletService } from "../wallet/interface/IWalletService";
import { ITransaction } from "src/interfaces/IWallet";
import { IScheduleService } from "src/interfaces/ISchedule";

class AppointmentService implements IAppointmentService {
  private appointmentRepo: IAppointmentRepository;
  private scheduleService: IScheduleService;
  private notificationService: INotificationService;
  private walletService: IWalletService;

  constructor(
    appointmentRepo: IAppointmentRepository,
    scheduleService: IScheduleService,
    notificationService: INotificationService,
    walletService: IWalletService
  ) {
    this.appointmentRepo = appointmentRepo;
    this.scheduleService = scheduleService;
    this.notificationService = notificationService;
    this.walletService = walletService;
  }

  async createAppointment(
    appointmentData: IAppointment
  ): Promise<IAppointmentPopulated> {
    try {
      const { doctor, slotId, dayId } = appointmentData;

      // Update booking status
      if (doctor && slotId && dayId) {
        await this.scheduleService.updateBookingStatus(
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
          priority: "high",
        };

        const notificationForDoctor: Partial<INotification> = {
          user: doctorId as Types.ObjectId,
          userType: "Doctor",
          title: "New Appointment",
          message: `An Appointment has been scheduled with ${patientFirstName} ${patientLastName} on ${date} at ${time}`,
          type: "appointments",
          priority: "high",
        };

        await Promise.all([
          this.notificationService.createNotification(notificationForPatient),
          this.notificationService.createNotification(notificationForDoctor),
        ]);

        const transaction: ITransaction = {
          amount: appointmentData.fee,
          status: "success",
          type: "debit",
          date: new Date(),
          description: "Funds deducted from wallet for scheduled appointment",
        };
        await this.walletService.addTransaction(
          patientId as string,
          transaction
        );
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
          await this.scheduleService.toggleBookingStatus(
            doctor.toString(),
            existingAppointment.dayId,
            existingAppointment.slotId
          );
        }
        await this.scheduleService.updateBookingStatus(
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
              priority: "high",
            };

            const notificationForDoctor: Partial<INotification> = {
              user: doctorId as Types.ObjectId,
              userType: "Doctor",
              title: "Appointment Rescheduled",
              message: `Your appointment with patient ${patientFirstName} ${patientLastName} on ${oldDate} at ${oldTime} has been rescheduled to ${date} at ${time}`,
              type: "appointments",
              priority: "high",
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

      // toggle booking status for cancelled appointment
      await this.scheduleService.toggleBookingStatus(
        appointmentData.doctor._id as string,
        appointmentData.dayId,
        appointmentData.slotId
      );

      // update the appointment status to "cancelled"
      await this.appointmentRepo.updateAppointment(appointmentId, {
        status: "cancelled",
      });

      // Send cancellation email
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

      const notificationForPatient: Partial<INotification> = {
        user: patientId as Types.ObjectId,
        userType: "Patient",
        title: "Appointment Cancelled",
        message: `Your appointment with dr. ${doctorFirstName} ${doctorLastName} on ${date} at ${time} has been cancelled`,
        type: "appointments",
        priority: "high",
      };

      const notificationForDoctor: Partial<INotification> = {
        user: doctorId as Types.ObjectId,
        userType: "Doctor",
        title: "Appointment Cancelled",
        message: `Your appointment with patient ${patientFirstName} ${patientLastName} on ${date} at ${time} has been cancelled`,
        type: "appointments",
        priority: "high",
      };

      await Promise.all([
        this.notificationService.createNotification(notificationForPatient),
        this.notificationService.createNotification(notificationForDoctor),
      ]);

      await Promise.all([
        sendEmail(patientEmail, "Booking Cancellation", undefined, patientHtml),
        sendEmail(doctorEmail, "Booking Cancellation", undefined, doctorHtml),
      ]);

      await this.walletService.accessOrCreateWallet(
        patientId as string,
        "Patient"
      );

      // if the cancelling appointment within 2hr from appointment deduct 100 rs
      const now = new Date();
      const appointmentDate = new Date(appointmentData.date);
      const timeDifference = appointmentDate.getTime() - now.getTime();
      const twoHoursInMillis = 2 * 60 * 60 * 1000;

      if (timeDifference < twoHoursInMillis) {
        const feeAfterDuduction = appointmentData.fee - 100;
        const transaction: ITransaction = {
          amount: feeAfterDuduction,
          status: "success",
          type: "credit",
          date: new Date(),
          description:
            "Refund for Appointment Cancellation  after 100rs duduction for late cancellation",
        };
        await this.walletService.addTransaction(
          patientId as string,
          transaction
        );
      } else {
        const transaction: ITransaction = {
          amount: appointmentData.fee,
          status: "success",
          type: "credit",
          date: new Date(),
          description: "Refund for Appointment Cancellation",
        };
        await this.walletService.addTransaction(
          patientId as string,
          transaction
        );
      }
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


  async getAppointments(): Promise<IAppointmentPopulated[]> {
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

  async getAppointmentByPaymentId(
    paymentIntentId: string
  ): Promise<IAppointmentPopulated> {
    const appointment =
      await this.appointmentRepo.getAppointmentByPaymentId(paymentIntentId);
    return appointment;
  }

  async getAppointmentByPatientIdAndDoctorId(
    patientId: string,
    doctorId: string
  ): Promise<IAppointment | null> {
    const appointment =
      await this.appointmentRepo.getAppointmentByPatientAndDoctorId(
        patientId,
        doctorId
      );
    return appointment;
  }

  async getPatientsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ patients: IPatientForDoctor[]; totalPatients: number }> {
    return await this.appointmentRepo.getPatientsByDoctor(
      doctorId,
      page,
      limit,
      searchQuery
    );
  }
}

export default AppointmentService;
