import { Model, Types } from "mongoose";
import IDoctorRepository, {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
  MatchStage,
} from "./interfaces/IDoctorRepository";
import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
} from "../../interfaces/IDoctor";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import BaseRepository from "../base/BaseRepository";

@injectable()
class DoctorRepository
  extends BaseRepository<IDoctor>
  implements IDoctorRepository
{
  constructor(@inject(TYPES.DoctorModel) model: Model<IDoctor>) {
    super(model);
  }

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    try {
      const doctor = await this.model
        .findOne({ email })
        .populate("specialization")
        .lean();
      return doctor;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findDoctorById(doctorId: string): Promise<IDoctor> {
    try {
      const doctor = await this.model
        .findById(doctorId)
        .select("-password")
        .populate("specialization")
        .lean();

      if (!doctor) {
        throw new AppError("Something went wrong");
      }
      return doctor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async updateDoctor(
    doctorId: string,
    updateData: Partial<IDoctor>
  ): Promise<IDoctor> {
    try {
      const updatedDoctor = await this.model
        .findOneAndUpdate(
          { _id: new Types.ObjectId(doctorId) },
          { $set: updateData },
          {
            new: true,
            runValidators: true,
            lean: true,
          }
        )
        .select("-password");

      if (!updatedDoctor) {
        throw new AppError("Something went wrong");
      }

      return updatedDoctor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async getDoctors(query: IDoctorsFilter): Promise<IDoctorsFilterResult> {
    try {
      const { specialization, gender, search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const matchStage: MatchStage = {};

      if (search) {
        matchStage.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      if (gender) {
        matchStage.gender = gender;
      }

      if (specialization) {
        matchStage.specialization =
          typeof specialization === "string"
            ? new Types.ObjectId(specialization)
            : specialization;
      }

      const aggregationPipeline = [
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "specializations",
            localField: "specialization",
            foreignField: "_id",
            as: "specialization",
          },
        },
        {
          $addFields: {
            specialization: { $arrayElemAt: ["$specialization", 0] },
          },
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
        {
          $project: {
            metadata: 1,
            doctors: "$data",
          },
        },
      ];

      const result = await this.model.aggregate(aggregationPipeline);

      const total = result[0]?.metadata[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        doctors: result[0]?.doctors || [],
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult> {
    try {
      const {
        specialization,
        gender,
        language,
        page = 1,
        selectedDate,
      } = query;

      const skip = (page - 1) * 10;
      const limit = 10;

      const selectedDateISO = selectedDate
        ? new Date(selectedDate)
        : new Date();

      const totalDoctorsCount = await this.model.countDocuments({
        ...(specialization && { specialization }),
        ...(gender && { gender: gender.toString() }),
        ...(language && { languages: language.toString() }),
      });

      const doctors = await this.model.aggregate([
        {
          $match: {
            ...(specialization && { specialization: specialization }),
            ...(gender && { gender: gender.toString() }),
            ...(language && { languages: language.toString() }),
          },
        },
        {
          $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "doctorId",
            as: "schedule",
          },
        },
        {
          $unwind: {
            path: "$schedule",
          },
        },
        {
          $addFields: {
            availability: {
              $filter: {
                input: "$schedule.availability",
                as: "av",
                cond: {
                  $gte: ["$$av.date", selectedDateISO],
                },
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $gt: [{ $size: "$availability" }, 0],
            },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            specialization: 1,
            specialties: 1,
            gender: 1,
            languages: 1,
            availability: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      return {
        doctors,
        currentPage: page,
        totalPages: Math.ceil(totalDoctorsCount / limit),
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getDoctorWithPassword(doctorId: string): Promise<IDoctor> {
    try {
      const doctor = await this.model.findById(doctorId);

      if (!doctor) {
        throw new AppError("Doctor not found");
      }
      return doctor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async getDoctorsCountBySpecialization(): Promise<
    {
      specialization: string;
      count: number;
    }[]
  > {
    try {
      const result = this.model.aggregate([
        {
          $group: {
            _id: "$specialization",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "specializations",
            localField: "_id",
            foreignField: "_id",
            as: "specializationDetails",
          },
        },
        {
          $unwind: "$specializationDetails",
        },
        {
          $project: {
            _id: 0,
            specialization: "$specializationDetails.name",
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
      return result as unknown as { specialization: string; count: number }[];
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default DoctorRepository;
