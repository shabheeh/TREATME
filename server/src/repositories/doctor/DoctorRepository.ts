import { Model, Types } from "mongoose";
import IDoctorRepository, {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
  MatchStage,
} from "./interfaces/IDoctorRepository";
import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
  IDoctorWithReviews,
} from "src/interfaces/IDoctor";
import { AppError } from "../../utils/errors";

class DoctorRepository implements IDoctorRepository {
  private readonly model: Model<IDoctor>;

  constructor(model: Model<IDoctor>) {
    this.model = model;
  }

  async createDoctor(doctor: Partial<IDoctor>): Promise<IDoctor> {
    try {
      const newDoctor = await this.model.create(doctor);
      return newDoctor.toObject();
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    try {
      const doctor = await this.model
        .findOne({ email })
        .populate("specialization")
        .lean();
      return doctor;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findDoctorById(doctorId: string): Promise<IDoctor> {
    try {
      const doctor = await this.model
        .findById(doctorId)
        .populate("specialization")
        .lean();

      if (!doctor) {
        throw new AppError("Something went wrong");
      }
      return doctor;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateDoctor(
    doctorId: string,
    updateData: Partial<IDoctor>
  ): Promise<IDoctor> {
    try {
      const updatedDoctor = await this.model
        .findOneAndUpdate(
          { _id: doctorId },
          { $set: updateData },
          {
            new: true,
            lean: true,
          }
        )
        .select("-password");

      if (!updatedDoctor) {
        throw new AppError("Something went wrong");
      }

      return updatedDoctor;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
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
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
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
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findDoctorWithReviews(doctorId: string): Promise<IDoctorWithReviews> {
    try {
      const doctorWithReviews = await this.model.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(doctorId),
          },
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
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "doctor",
            as: "reviews",
          },
        },
        {
          $unwind: {
            path: "$reviews",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "reviews.patient",
            foreignField: "_id",
            as: "reviews.patient",
          },
        },
        {
          $unwind: {
            path: "$reviews.patient",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            email: { $first: "$email" },
            phone: { $first: "$phone" },
            gender: { $first: "$gender" },
            languages: { $first: "$languages" },
            specialties: { $first: "$specialties" },
            experience: { $first: "$experience" },
            registerNo: { $first: "$registerNo" },
            profilePicture: { $first: "$profilePicture" },
            specialization: { $first: "$specialization" },
            reviews: { $push: "$reviews" },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            specialization: {
              name: 1,
            },
            gender: 1,
            specialties: 1,
            languages: 1,
            registerNo: 1,
            biography: 1,
            profilePicutre: 1,
            experience: 1,
            reviews: {
              _id: 1,
              patient: {
                _id: 1,
                firstName: 1,
                lastName: 1,
              },
              rating: 1,
              comment: 1,
              createdAt: 1,
            },
          },
        },
      ]);

      if (!doctorWithReviews.length) {
        throw new AppError("Something went wrong");
      }

      return doctorWithReviews[0];
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default DoctorRepository;
