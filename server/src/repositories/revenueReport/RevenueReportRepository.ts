import { inject, injectable } from "inversify";
import {
  AllDoctorsRevenueResponse,
  DoctorRevenueSummary,
  IRevenueReportRepository,
  RevenueReportData,
  RevenueSummary,
  TimeFilter,
} from "./interfaces/IRevenueReportRepository";
import { Model, PipelineStage, Types } from "mongoose";
import { IAppointment } from "src/interfaces/IAppointment";
import { TYPES } from "../../types/inversifyjs.types";
import { handleTryCatchError } from "../../utils/errors";
import { getDateRange } from "../../helpers/revenuReport/getRange";

@injectable()
class RevenueReportRepository implements IRevenueReportRepository {
  private readonly model: Model<IAppointment>;

  constructor(@inject(TYPES.AppointmentModel) model: Model<IAppointment>) {
    this.model = model;
  }

  async getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number = 1,
    doctorId?: string
  ): Promise<RevenueReportData> {
    try {
      const dateRange = getDateRange(timeFilter, startDate, endDate);
      const limit = 5;
      const skip = (page - 1) * limit;

      const matchStage: Record<string, unknown> = {
        status: "completed",
        date: {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate,
        },
        paymentStatus: "completed",
      };

      if (doctorId) {
        matchStage.doctor = new Types.ObjectId(doctorId);
      }

      const totalSummaryPipeline = [
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: null,
            totalFees: { $sum: "$fee" },
            totalCommission: { $sum: { $multiply: ["$fee", 0.1] } },
            totalDoctorEarnings: { $sum: { $multiply: ["$fee", 0.9] } },
            appointmentCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalFees: 1,
            totalCommission: 1,
            totalDoctorEarnings: 1,
            appointmentCount: 1,
            averageFeePerConsultation: {
              $cond: {
                if: { $gt: ["$appointmentCount", 0] },
                then: { $divide: ["$totalFees", "$appointmentCount"] },
                else: 0,
              },
            },
          },
        },
      ];

      const transactionsPipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "patient",
            foreignField: "_id",
            as: "patientInfo",
          },
        },
        {
          $lookup: {
            from: "specializations",
            localField: "specialization",
            foreignField: "_id",
            as: "specializationInfo",
          },
        },
        {
          $unwind: "$doctorInfo",
        },
        {
          $unwind: "$patientInfo",
        },
        {
          $unwind: "$specializationInfo",
        },
        {
          $project: {
            appointmentId: { $toString: "$_id" },
            date: 1,
            doctorId: { $toString: "$doctor" },
            doctorName: {
              $concat: ["$doctorInfo.firstName", " ", "$doctorInfo.lastName"],
            },
            patientName: {
              $concat: ["$patientInfo.firstName", " ", "$patientInfo.lastName"],
            },
            consultationFee: "$fee",
            platformCommission: { $multiply: ["$fee", 0.1] },
            doctorEarning: { $multiply: ["$fee", 0.9] },
            status: 1,
            specialization: "$specializationInfo.name",
            slotId: 1,
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];

      const totalCountPipeline = [
        {
          $match: matchStage,
        },
        {
          $count: "total",
        },
      ];

      const [summaryResult, transactions, countResult] = await Promise.all([
        this.model.aggregate(totalSummaryPipeline),
        this.model.aggregate(transactionsPipeline),
        this.model.aggregate(totalCountPipeline),
      ]);

      const summary: RevenueSummary = summaryResult[0] || {
        totalFees: 0,
        totalCommission: 0,
        totalDoctorEarnings: 0,
        appointmentCount: 0,
        averageFeePerConsultation: 0,
      };

      const totalCount = countResult[0]?.total || 0;

      return {
        summary,
        transactions,
        dateRange,
        pagination: {
          page,
          count: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter = "monthly",
    page = 1
  ): Promise<AllDoctorsRevenueResponse> {
    try {
      const dateRange = getDateRange(timeFilter, startDate, endDate);
      const limit = 10;
      const skip = (page - 1) * limit;

      const matchStage = {
        status: "completed",
        date: {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate,
        },
        paymentStatus: "completed",
      };

      const totalSummaryPipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: null,
            totalFees: { $sum: "$fee" },
            totalCommission: { $sum: { $multiply: ["$fee", 0.1] } },
            totalDoctorEarnings: { $sum: { $multiply: ["$fee", 0.9] } },
            appointmentCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalFees: 1,
            totalCommission: 1,
            totalDoctorEarnings: 1,
            appointmentCount: 1,
            averageFeePerConsultation: {
              $cond: {
                if: { $gt: ["$appointmentCount", 0] },
                then: { $divide: ["$totalFees", "$appointmentCount"] },
                else: 0,
              },
            },
          },
        },
      ];

      const doctorsPipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        { $unwind: "$doctorInfo" },
        {
          $lookup: {
            from: "specializations",
            localField: "specialization",
            foreignField: "_id",
            as: "specializationInfo",
          },
        },
        { $unwind: "$specializationInfo" },
        {
          $group: {
            _id: "$doctor",
            doctorName: {
              $first: {
                $concat: ["$doctorInfo.firstName", " ", "$doctorInfo.lastName"],
              },
            },
            specialization: { $first: "$specializationInfo.name" },
            totalEarnings: { $sum: { $multiply: ["$fee", 0.9] } },
            totalFees: { $sum: "$fee" },
            totalCommission: { $sum: { $multiply: ["$fee", 0.1] } },
            totalAppointments: { $sum: 1 },
          },
        },
        {
          $project: {
            doctorId: { $toString: "$_id" },
            doctorName: 1,
            specialization: 1,
            totalEarnings: 1,
            totalFees: 1,
            totalCommission: 1,
            totalAppointments: 1,
            averageEarningPerConsultation: {
              $cond: {
                if: { $gt: ["$totalAppointments", 0] },
                then: { $divide: ["$totalEarnings", "$totalAppointments"] },
                else: 0,
              },
            },
          },
        },
        { $sort: { totalEarnings: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const doctorCountPipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: "$doctor",
          },
        },
        {
          $count: "total",
        },
      ];

      const [totalSummaryResult, doctorSummaries, doctorCountResult] =
        await Promise.all([
          this.model.aggregate(totalSummaryPipeline),
          this.model.aggregate(doctorsPipeline),
          this.model.aggregate(doctorCountPipeline),
        ]);

      const totalSummary: RevenueSummary = totalSummaryResult[0] || {
        totalFees: 0,
        totalCommission: 0,
        totalDoctorEarnings: 0,
        appointmentCount: 0,
        averageFeePerConsultation: 0,
      };

      const totalDoctorCount = doctorCountResult[0]?.total || 0;

      const doctors: DoctorRevenueSummary[] = doctorSummaries.map((doc) => ({
        doctorId: doc.doctorId,
        doctorName: doc.doctorName,
        specialization: doc.specialization,
        totalEarnings: doc.totalEarnings,
        totalAppointments: doc.totalAppointments,
        averageEarningPerConsultation: doc.averageEarningPerConsultation,
      }));

      return {
        doctors,
        totalSummary,
        pagination: {
          page,
          count: totalDoctorCount,
          totalPages: Math.ceil(totalDoctorCount / limit),
        },
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default RevenueReportRepository;
