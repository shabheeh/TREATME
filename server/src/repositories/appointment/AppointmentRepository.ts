import { Model } from "mongoose";
import IAppointment, {
  IAppointmentPopulated,
} from "../../interfaces/IAppointment";
import IAppointmentRepository from "./interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";

class AppointmentRepository implements IAppointmentRepository {
  private readonly model: Model<IAppointment>;

  constructor(model: Model<IAppointment>) {
    this.model = model;
  }

  async createAppointment(
    appointmentData: IAppointment
  ): Promise<IAppointment> {
    try {
      const appointment = await this.model.create(appointmentData);

      if (!appointment) {
        throw new AppError("Something went wrong");
      }

      return appointment;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentById(
    appointmentId: string
  ): Promise<IAppointmentPopulated> {
    try {
      const appointment = await this.model
        .findById(appointmentId)
        .populate({
          path: "specialization",
          select: "name",
        })
        .populate({
          path: "patient",
          select: "-password",
        })
        .populate({
          path: "doctor",
          select: "-password",
        });

      if (!appointment) {
        throw new AppError("Somethig went Wrong");
      }
      return appointment as unknown as IAppointmentPopulated;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateAppointment(
    appointmentId: string,
    updateData: Partial<IAppointment>
  ): Promise<IAppointment> {
    try {
      const appointment = await this.model.findByIdAndUpdate(
        appointmentId,
        { $set: updateData },
        { new: true }
      );

      if (!appointment) {
        throw new AppError("Something went wrong");
      }
      return appointment;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]> {
    try {
      const appointments = await this.model
        .find({ patient: patientId })
        .populate({
          path: "specialization",
          select: "name",
        })
        .populate({
          path: "patient",
          select: "-password",
        })
        .populate({
          path: "doctor",
          select: "-password",
        });

      return appointments;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentsByDoctorId(doctorId: string): Promise<IAppointment[]> {
    try {
      const appointments = await this.model
        .find({ doctor: doctorId })
        .populate({
          path: "specialization",
          select: "name",
        })
        .populate({
          path: "patient",
          select: "-password",
        })
        .populate({
          path: "doctor",
          select: "-password",
        });
      return appointments;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointments(): Promise<IAppointment[]> {
    try {
      const appointments = await this.model
        .find()
        .populate({
          path: "specialization",
          select: "name",
        })
        .populate({
          path: "patient",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "doctor",
          select: "firstName lastName profilePicture",
        });
      return appointments;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentByPaymentId(
    paymentIntentId: string
  ): Promise<IAppointmentPopulated> {
    try {
      const appointment = await this.model
        .findOne({ paymentIntentId })
        .populate({
          path: "specialization",
          select: "name",
        })
        .populate({
          path: "patient",
          select: "-password",
        })
        .populate({
          path: "doctor",
          select: "-password",
        });

      if (!appointment) {
        throw new AppError("Somethig went Wrong");
      }
      return appointment as unknown as IAppointmentPopulated;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default AppointmentRepository;
