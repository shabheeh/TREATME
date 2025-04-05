import { Model } from "mongoose";
import ISpecialization from "../../interfaces/ISpecilazation";
import ISpecializationRepository from "./interfaces/ISpecializationRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class SpecializationRepository implements ISpecializationRepository {
  private readonly model: Model<ISpecialization>;

  constructor(
    @inject(TYPES.SpecializationModel) model: Model<ISpecialization>
  ) {
    this.model = model;
  }

  async createSpecialization(
    specialization: Partial<ISpecialization>
  ): Promise<void> {
    try {
      await this.model.create(specialization);
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getSpecializationByName(name: string): Promise<ISpecialization | null> {
    try {
      const specialization = await this.model.findOne({
        name: { $regex: new RegExp(name, "i") },
      });

      return specialization;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getSpecializations(): Promise<ISpecialization[]> {
    try {
      const specializations = await this.model.find();
      return specializations;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getSpecializationById(
    specializationId: string
  ): Promise<ISpecialization | null> {
    try {
      const specialization = await this.model.findById(specializationId).lean();

      return specialization;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async updateSpecialization(
    specializationId: string,
    updateData: Partial<ISpecialization>
  ): Promise<ISpecialization> {
    try {
      const updatedData = await this.model.findByIdAndUpdate(
        specializationId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          lean: true,
        }
      );

      if (!updatedData) {
        throw new AppError(
          "Specialization not found",
          HttpStatusCode.NOT_FOUND
        );
      }

      return updatedData;
    } catch (error) {
      if (error instanceof AppError) throw error;

      handleTryCatchError("Database", error);
    }
  }
}

export default SpecializationRepository;
