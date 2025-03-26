import { Model, Types } from "mongoose";
import IAppointment, {
  IAppointmentPopulated,
} from "../../interfaces/IAppointment";
import IAppointmentRepository, {
  IPatientForDoctor,
  MonthlyRevenue,
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

  async getAppointments(): Promise<IAppointmentPopulated[]> {
    try {
      const appointments = await this.model
        .find({ status: "confirmed" })
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
        })
        .sort({ createdAt: 1 })
        .lean();
      return appointments as unknown as IAppointmentPopulated[];
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getTodaysAppointments(): Promise<IAppointmentPopulated[]> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const appointments = await this.model
        .find({
          status: "confirmed",
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        })
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
        })
        .lean();
      return appointments as unknown as IAppointmentPopulated[];
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
  async getPatientsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    searchQuery: string = ""
  ): Promise<{ patients: IPatientForDoctor[]; totalPatients: number }> {
    try {
      const skip = (page - 1) * limit;

      const patients = await this.model.aggregate([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
            status: "completed",
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

        // search query
        {
          $match: {
            $or: [
              {
                "patientDetails.firstName": {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                "patientDetails.lastName": {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                "dependentDetails.firstName": {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                "dependentDetails.lastName": {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          },
        },

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
            email: {
              $ifNull: ["$patientDetails.email", "$dependentDetails.email"],
            },
            profilePicture: {
              $ifNull: [
                "$patientDetails.profilePicture",
                "$dependentDetails.profilePicture",
              ],
            },
            dateOfBirth: {
              $ifNull: [
                "$patientDetails.dateOfBirth",
                "$dependentDetails.dateOfBirth",
              ],
            },
            gender: {
              $ifNull: ["$patientDetails.gender", "$dependentDetails.gender"],
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
            email: { $first: "$email" },
            profilePicture: { $first: "$profilePicture" },
            dateOfBirth: { $first: "$dateOfBirth" },
            gender: { $first: "$gender" },
            isDependent: { $first: "$isDependent" },
            primaryPatientId: { $first: "$primaryPatientId" },
            lastVisit: { $max: "$lastVisit" },
          },
        },

        { $sort: { lastVisit: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);

      const totalPatients = await this.model.countDocuments({
        doctor: new Types.ObjectId(doctorId),
        status: "confirmed",
      });

      return { patients, totalPatients };
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenue> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const result = await this.model.aggregate([
        {
          $match: {
            status: "completed",
            date: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            monthlyRevenue: { $sum: { $multiply: ["$fee", 0.1] } },
          },
        },
        {
          $project: {
            month: {
              $dateToString: {
                format: "%b",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            monthlyRevenue: 1,
            _id: 0,
          },
        },
        {
          $sort: { month: 1 },
        },
        {
          $group: {
            _id: null,
            monthlyData: {
              $push: { month: "$month", revenue: "$monthlyRevenue" },
            },
            totalRevenue: { $sum: "$monthlyRevenue" },
          },
        },
        {
          $project: {
            _id: 0,
            monthlyData: 1,
            totalRevenue: 1,
          },
        },
      ]);

      const formattedData =
        result.length > 0 ? result[0] : { monthlyData: [], totalRevenue: 0 };

      return formattedData;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getWeeklyAppointments(): Promise<{ day: string; count: number }[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const result = await this.model.aggregate([
        {
          $match: {
            status: "completed",
            date: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              dayOfWeek: { $dayOfWeek: "$date" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.dayOfWeek": 1 },
        },
      ]);

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      return result.map(({ _id, count }) => ({
        day: dayNames[_id.dayOfWeek - 1],
        count,
      }));
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getTodaysAppointmentByDoctor(
    doctorId: string
  ): Promise<IAppointmentPopulated[]> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const appointments = await this.model
        .find({
          doctor: new Types.ObjectId(doctorId),
          status: "confirmed",
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        })
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
        })
        .lean();
      return appointments as unknown as IAppointmentPopulated[];
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default AppointmentRepository;
