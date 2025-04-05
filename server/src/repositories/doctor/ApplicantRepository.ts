import { Model } from "mongoose";
import IApplicantRepository from "./interfaces/IApplicantRepository";
import { IApplicant } from "src/interfaces/IApplicant";
import { AppError, handleTryCatchError } from "../../utils/errors";
import {
  IApplicantsFilter,
  IApplicantsFilterResult,
} from "src/interfaces/IApplicant";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

interface Query {
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    phone?: { $regex: string; $options: string };
  }>;
}

@injectable()
class ApplicantRepository implements IApplicantRepository {
  private readonly model: Model<IApplicant>;

  constructor(@inject(TYPES.ApplicantModel) model: Model<IApplicant>) {
    this.model = model;
  }

  async createApplicant(applicant: IApplicant): Promise<void> {
    try {
      await this.model.create(applicant);
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findApplicantByEmail(email: string): Promise<IApplicant | null> {
    try {
      const applicant = await this.model
        .findOne({ email })
        .populate("specialization");
      return applicant;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getApplicants(
    filter: IApplicantsFilter
  ): Promise<IApplicantsFilterResult> {
    try {
      const { page, limit, search } = filter;
      const skip = (page - 1) * limit;

      const query: Query = {};

      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];

      const [applicants, total] = await Promise.all([
        this.model
          .find(query)
          .populate("specialization")
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(query),
      ]);

      return {
        applicants,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findApplicantById(applicantId: string): Promise<IApplicant | null> {
    try {
      const applicant = await this.model
        .findById(applicantId)
        .populate("specialization");
      return applicant;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async deleteApplicant(applicantId: string): Promise<void> {
    try {
      const deletedApplicant = await this.model
        .findByIdAndDelete(applicantId)
        .exec();

      if (!deletedApplicant) {
        throw new AppError("Applicant not found", HttpStatusCode.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }
}

export default ApplicantRepository;
