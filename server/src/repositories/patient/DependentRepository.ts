import { Model } from "mongoose";
import IDependentRepository from "./interface/IDependentRepository";
import IDependent from "../../interfaces/IDependent";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class DependentRepository implements IDependentRepository {
  private readonly model: Model<IDependent>;

  constructor(@inject(TYPES.DependentModel) model: Model<IDependent>) {
    this.model = model;
  }

  async createDependent(dependent: Partial<IDependent>): Promise<IDependent> {
    try {
      const newDependent = await this.model.create(dependent);
      return newDependent.toObject();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findDependentById(id: string): Promise<IDependent | null> {
    try {
      const dependent = await this.model.findById(id).lean();
      return dependent;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getDependents(primaryUserId: string): Promise<IDependent[] | []> {
    try {
      const dependents = await this.model.find({ primaryUserId }).lean();

      return dependents || [];
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async deleteDependent(id: string): Promise<void> {
    try {
      const deletedDependent = await this.model.findByIdAndDelete(id);

      if (!deletedDependent) {
        throw new AppError("Dependent not found", HttpStatusCode.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async updateDependent(
    id: string,
    updateData: Partial<IDependent>
  ): Promise<IDependent> {
    try {
      const updatedData = await this.model.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          lean: true,
        }
      );

      if (!updatedData) {
        throw new AppError("Dependent not found", HttpStatusCode.NOT_FOUND);
      }

      return updatedData;
    } catch (error) {
      if (error instanceof AppError) throw error;

      handleTryCatchError("Database", error);
    }
  }

  getDependentAges(): Promise<{ age: number }[]> {
    try {
      const currentYear = new Date().getFullYear();
      const dependentsAge = this.model.aggregate([
        {
          $addFields: {
            age: { $subtract: [currentYear, { $year: "$dob" }] },
          },
        },
        {
          $project: { age: 1, _id: 0 },
        },
      ]);
      return dependentsAge;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default DependentRepository;
