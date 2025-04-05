import { Model, Types } from "mongoose";
import IPatient, {
  IPatientsFilter,
  IPatientsFilterResult,
} from "../../interfaces/IPatient";
import IPatientRepository from "./interface/IPatientRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
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
class PatientRepository implements IPatientRepository {
  private readonly model: Model<IPatient>;

  constructor(@inject(TYPES.PatientModel) model: Model<IPatient>) {
    this.model = model;
  }

  async createPatient(patient: Partial<IPatient>): Promise<IPatient> {
    try {
      const newPatient = await this.model.create(patient);
      return newPatient.toObject();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findPatientByEmail(email: string): Promise<IPatient | null> {
    try {
      const patient = await this.model.findOne({ email }).lean();
      return patient;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async findPatientById(id: string): Promise<IPatient | null> {
    try {
      const patient = await this.model.findById(id).select("-password").lean();
      return patient;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async updatePatient(
    userId: string,
    patientData: Partial<IPatient>
  ): Promise<IPatient | null> {
    try {
      const updatedPatient = await this.model
        .findOneAndUpdate(
          { _id: new Types.ObjectId(userId) },
          { $set: patientData },
          {
            new: true,
            runValidators: true,
            lean: true,
          }
        )
        .select("-password");

      if (!updatedPatient) {
        throw new AppError("Patient not found", HttpStatusCode.NOT_FOUND);
      }

      return updatedPatient;
    } catch (error) {
      if (error instanceof AppError) throw error;

      handleTryCatchError("Database", error);
    }
  }

  async getPatients(filter: IPatientsFilter): Promise<IPatientsFilterResult> {
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

      const [patients, total] = await Promise.all([
        this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.model.countDocuments(query),
      ]);

      return {
        patients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getPatientWithPassword(userId: string): Promise<IPatient> {
    try {
      const patient = await this.model.findById(userId);

      if (!patient) {
        throw new AppError("User not found");
      }

      return patient;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  getPatientsAges(): Promise<{ age: number }[]> {
    try {
      const currentYear = new Date().getFullYear();
      const patientsAge = this.model.aggregate([
        {
          $addFields: {
            age: { $subtract: [currentYear, { $year: "$dateOfBirth" }] },
          },
        },
        {
          $project: { age: 1, _id: 0 },
        },
      ]);
      return patientsAge;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default PatientRepository;
