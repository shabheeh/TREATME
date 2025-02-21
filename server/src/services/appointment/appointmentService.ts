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

class AppointmentService implements IAppointmentService {
  private appointmentRepo: IAppointmentRepository;
  private scheduleRepo: IScheduleRepository;

  constructor(
    appointmentRepo: IAppointmentRepository,
    scheduleRepo: IScheduleRepository
  ) {
    this.appointmentRepo = appointmentRepo;
    this.scheduleRepo = scheduleRepo;
  }

  async createAppointment(
    appointmentData: IAppointment
  ): Promise<IAppointmentPopulated> {
    try {
      const { doctor, slotId, dayId } = appointmentData;

      // Update booking status
      if (doctor && slotId && dayId) {
        await this.scheduleRepo.updateBookingStatus(doctor, dayId, slotId);
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
        const { firstName: doctorFirstName, lastName: doctorLastName } =
          populatedAppointment.doctor;
        const {
          firstName: patientFirstName,
          lastName: patientLastName,
          email: patientEmail,
        } = populatedAppointment.patient;

        const date = extractDate(populatedAppointment.date);
        const time = extractTime(populatedAppointment.date);
        const html = generateBookingConfirmationHtml(
          `${doctorFirstName} ${doctorLastName}`,
          `${patientFirstName} ${patientLastName}`,
          date,
          time
        );
        await sendEmail(patientEmail, "Booking Confirmation", undefined, html);
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
  ): Promise<Partial<IAppointment>> {
    try {
      const { doctor, slotId, dayId, status } = updateData;

      // Fetch the existing appointment
      const existingAppointment =
        await this.appointmentRepo.getAppointmentById(appointmentId);

      // Handle slot booking status updates
      if (doctor && slotId && dayId) {
        if (existingAppointment.dayId && existingAppointment.slotId) {
          await this.scheduleRepo.toggleBookingStatus(
            doctor,
            existingAppointment.dayId,
            existingAppointment.slotId
          );
        }
        await this.scheduleRepo.updateBookingStatus(doctor, dayId, slotId);
      }

      // Update the appointment
      const updatedAppointment = await this.appointmentRepo.updateAppointment(
        appointmentId,
        updateData
      );

      // Handle email notifications based on appointment status
      if (status === "confirmed" || status === "cancelled") {
        const appointmentData = await this.getAppointmentById(appointmentId);

        if (appointmentData?.doctor && appointmentData.patient) {
          const { firstName: doctorFirstName, lastName: doctorLastName } =
            appointmentData.doctor;
          const {
            firstName: patientFirstName,
            lastName: patientLastName,
            email: patientEmail,
          } = appointmentData.patient;

          if (status === "confirmed" && appointmentData.date) {
            // Send booking confirmation email
            const date = extractDate(appointmentData.date);
            const time = extractTime(appointmentData.date);
            const html = generateBookingConfirmationHtml(
              `${doctorFirstName} ${doctorLastName}`,
              `${patientFirstName} ${patientLastName}`,
              date,
              time
            );
            await sendEmail(
              patientEmail,
              "Booking Confirmation",
              undefined,
              html
            );
          } else if (
            status === "cancelled" &&
            appointmentData.dayId &&
            appointmentData.slotId
          ) {
            // Toggle booking status for cancelled appointment
            await this.scheduleRepo.toggleBookingStatus(
              appointmentData.doctor._id,
              appointmentData.dayId,
              appointmentData.slotId
            );
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
}

export default AppointmentService;
