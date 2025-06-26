import { Model, Types } from "mongoose";
import IAppointment, {
  IAppointmentPopulated,
} from "../../interfaces/IAppointment";
import IAppointmentRepository, {
  IPatientForDoctor,
  RevenueData,
} from "./interfaces/IAppointmentRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import BaseRepository from "../base/BaseRepository";

@injectable()
class AppointmentRepository
  extends BaseRepository<IAppointment>
  implements IAppointmentRepository
{
  constructor(@inject(TYPES.AppointmentModel) model: Model<IAppointment>) {
    super(model);
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
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
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
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
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
        throw new AppError("Appointment not found");
      }
      return appointment as unknown as IAppointmentPopulated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
    }
  }

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

      const totalPatientsResult = await this.model.aggregate([
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
        {
          $project: {
            _id: { $ifNull: ["$patientDetails._id", "$dependentDetails._id"] },
          },
        },
        {
          $group: {
            _id: "$_id",
          },
        },
        {
          $count: "totalPatients",
        },
      ]);

      const totalPatients =
        totalPatientsResult.length > 0
          ? totalPatientsResult[0].totalPatients
          : 0;

      return { patients, totalPatients };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getMonthlyRevenue(): Promise<RevenueData> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const result = await this.model.aggregate<RevenueData>([
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
            revenue: { $sum: { $multiply: ["$fee", 0.9] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: {
              $dateToString: {
                format: "%b %Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            revenue: 1,
            count: 1,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: 1,
              },
            },
          },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
      throw error;
    }
  }

  async getWeeklyRevenue(): Promise<RevenueData> {
    try {
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

      const result = await this.model.aggregate<RevenueData>([
        {
          $match: {
            status: "completed",
            date: { $gte: twelveWeeksAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              week: { $week: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", 0.1] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: {
              $concat: [
                "Week ",
                { $toString: "$_id.week" },
                ", ",
                { $toString: "$_id.year" },
              ],
            },
            revenue: 1,
            count: 1,
            date: {
              $dateFromParts: {
                isoWeekYear: "$_id.year",
                isoWeek: "$_id.week",
                isoDayOfWeek: 1,
              },
            },
          },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getYearlyRevenue(): Promise<RevenueData> {
    try {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const result = await this.model.aggregate<RevenueData>([
        {
          $match: {
            status: "completed",
            date: { $gte: fiveYearsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", 0.1] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: { $toString: "$_id.year" },
            revenue: 1,
            count: 1,
            year: "$_id.year",
          },
        },
        {
          $sort: { year: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
    }
  }

  async getTodaysAppointmentByDoctor(
    doctorId: string
  ): Promise<IAppointmentPopulated[]> {
    try {
      const now = new Date();
      const startOfDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        )
      );
      const endOfDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

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
          select: "firstName lastName profilePicture dateOfBirth",
        })
        .populate({
          path: "doctor",
          select: "firstName lastName profilePicture",
        })
        .lean();
      return appointments as unknown as IAppointmentPopulated[];
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getMonthlyRevenueByDoctor(doctorId: string): Promise<RevenueData> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const result = await this.model.aggregate<RevenueData>([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
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
            revenue: { $sum: { $multiply: ["$fee", 0.9] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: {
              $dateToString: {
                format: "%b %Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            revenue: 1,
            count: 1,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: 1,
              },
            },
          },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
      throw error;
    }
  }

  async getWeeklyRevenueByDoctor(doctorId: string): Promise<RevenueData> {
    try {
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

      const result = await this.model.aggregate<RevenueData>([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
            status: "completed",
            date: { $gte: twelveWeeksAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              week: { $week: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", 0.9] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: {
              $concat: [
                "Week ",
                { $toString: "$_id.week" },
                ", ",
                { $toString: "$_id.year" },
              ],
            },
            revenue: 1,
            count: 1,
            date: {
              $dateFromParts: {
                isoWeekYear: "$_id.year",
                isoWeek: "$_id.week",
                isoDayOfWeek: 1,
              },
            },
          },
        },
        {
          $sort: { date: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getYearlyRevenueByDoctor(doctorId: string): Promise<RevenueData> {
    try {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const result = await this.model.aggregate<RevenueData>([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
            status: "completed",
            date: { $gte: fiveYearsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", 0.9] } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            timeUnit: { $toString: "$_id.year" },
            revenue: 1,
            count: 1,
            year: "$_id.year",
          },
        },
        {
          $sort: { year: 1 },
        },
        {
          $group: {
            _id: null,
            timeData: {
              $push: {
                period: "$timeUnit",
                revenue: "$revenue",
                appointmentCount: "$count",
              },
            },
            totalRevenue: { $sum: "$revenue" },
            totalAppointments: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            timeData: 1,
            totalRevenue: 1,
            totalAppointments: 1,
          },
        },
      ]);

      const formattedData: RevenueData =
        result.length > 0
          ? result[0]
          : {
              timeData: [],
              totalRevenue: 0,
              totalAppointments: 0,
            };

      return formattedData;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getWeeklyAppointmentsByDoctor(
    doctorId: string
  ): Promise<{ day: string; count: number }[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const result = await this.model.aggregate([
        {
          $match: {
            doctor: new Types.ObjectId(doctorId),
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
      handleTryCatchError("Database", error);
    }
  }
}

export default AppointmentRepository;
