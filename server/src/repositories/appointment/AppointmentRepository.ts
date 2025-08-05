import { Model, Types } from "mongoose";
import {
  IAppointment,
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
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
        .sort({ date: 1 })
        .lean();
      return appointments as unknown as IAppointmentPopulated[];
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getTodaysAppointments(
    doctorId?: string
  ): Promise<IAppointmentPopulated[]> {
    try {
      const startOfDay = dayjs().utc().startOf("day").toDate();
      const endOfDay = dayjs().utc().endOf("day").toDate();

      const query: Record<string, unknown> = {
        status: "confirmed",
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      };

      if (doctorId) {
        query.doctor = new Types.ObjectId(doctorId);
      }

      const appointments = await this.model
        .find(query)
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

  async getMonthlyRevenue(doctorId?: string): Promise<RevenueData> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const matchStage: Record<string, unknown> = {
        status: "completed",
        date: { $gte: twelveMonthsAgo },
      };

      if (doctorId) {
        matchStage["doctor"] = new Types.ObjectId(doctorId);
      }

      const revenueMultiplier = doctorId ? 0.9 : 0.1;

      const result = await this.model.aggregate<RevenueData>([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", revenueMultiplier] } },
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
        { $sort: { date: 1 } },
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

      return result.length > 0
        ? result[0]
        : {
            timeData: [],
            totalRevenue: 0,
            totalAppointments: 0,
          };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getWeeklyRevenue(doctorId?: string): Promise<RevenueData> {
    try {
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

      const matchStage: Record<string, unknown> = {
        status: "completed",
        date: { $gte: twelveWeeksAgo },
      };

      if (doctorId) {
        matchStage["doctor"] = new Types.ObjectId(doctorId);
      }

      const revenueMultiplier = doctorId ? 0.9 : 0.1;

      const result = await this.model.aggregate<RevenueData>([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              week: { $week: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", revenueMultiplier] } },
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

  async getYearlyRevenue(doctorId?: string): Promise<RevenueData> {
    try {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const matchStage: Record<string, unknown> = {
        status: "completed",
        date: { $gte: fiveYearsAgo },
      };

      if (doctorId) {
        matchStage["doctor"] = new Types.ObjectId(doctorId);
      }

      const revenueMultiplier = doctorId ? 0.9 : 0.1;

      const result = await this.model.aggregate<RevenueData>([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
            },
            revenue: { $sum: { $multiply: ["$fee", revenueMultiplier] } },
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

  async getWeeklyAppointments(
    doctorId?: string
  ): Promise<{ day: string; count: number }[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const matchStage: Record<string, unknown> = {
        status: "completed",
        date: { $gte: sevenDaysAgo },
      };

      if (doctorId) {
        matchStage["doctor"] = new Types.ObjectId(doctorId);
      }

      const result = await this.model.aggregate([
        { $match: matchStage },
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

  async getAppointmentsForNotification(
    startDate: Date,
    endDate: Date
  ): Promise<IAppointmentPopulated[]> {
    try {
      const appointments = await this.model
        .find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          status: "confirmed",
        })
        .populate("patient", "firstName lastName _id")
        .populate("doctor", "firstName lastName _id")
        .select("_id date patient doctor status")
        .lean()
        .exec();
      return appointments as unknown as IAppointmentPopulated[];
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default AppointmentRepository;
