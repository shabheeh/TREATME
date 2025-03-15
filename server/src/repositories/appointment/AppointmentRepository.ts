import { Model, Types } from "mongoose";
import IAppointment, {
  IAppointmentPopulated,
} from "../../interfaces/IAppointment";
import IAppointmentRepository, {
  IPatientForDoctor,
} from "./interfaces/IAppointmentRepository";
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
        })
        .sort({ date: 1 })
        .lean();

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
        })
        .sort({ date: 1 })
        .lean();

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
        throw new AppError("");
      }
      return appointment as unknown as IAppointmentPopulated;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getAppointmentByPatientAndDoctorId(
    patientId: string,
    doctorId: string
  ): Promise<IAppointment | null> {
    try {
      const appointment = await this.model
        .findOne({ patient: patientId, doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();
      return appointment;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  // function to get the patients treated by doctor
  async getPatientsByDoctor(doctorId: string): Promise<IPatientForDoctor[]> {
    try {
      const patients = await this.model.aggregate([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
            status: "confirmed",
          },
        },

        {
          $lookup: {
            from: "patients",
            localField: "patient",
            foreignField: "_id",
            as: "patientDetails",
          },
        },
        {
          $unwind: {
            path: "$patientDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "dependents",
            localField: "patient",
            foreignField: "_id",
            as: "dependentDetails",
          },
        },
        {
          $unwind: {
            path: "$dependentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // merge patients and dependents
        {
          $project: {
            _id: { $ifNull: ["$patientDetails._id", "$dependentDetails._id"] },
            firstName: {
              $ifNull: [
                "$patientDetails.firstName",
                "$dependentDetails.firstName",
              ],
            },
            lastName: {
              $ifNull: [
                "$patientDetails.lastName",
                "$dependentDetails.lastName",
              ],
            },
            profilePicture: {
              $ifNull: [
                "$patientDetails.profilePicture",
                "$dependentDetails.profilePicture",
              ],
            },
            isDependent: {
              $cond: {
                if: { $ne: ["$dependentDetails", null] },
                then: true,
                else: false,
              },
            },
            primaryPatientId: "$dependentDetails.primaryPatient",
            lastVisit: "$createdAt",
          },
        },

        {
          $group: {
            _id: "$_id",
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            profilePicture: { $first: "$profilePicture" },
            isDependent: { $first: "$isDependent" },
            primaryPatientId: { $first: "$primaryPatientId" },
            lastVisit: { $max: "$lastVisit" },
          },
        },

        { $sort: { lastVisit: -1 } },
      ]);

      return patients;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default AppointmentRepository;
