import { Model } from "mongoose";
import ILifestyleRepository from "./interface/ILifestyleRepository";
import { ILifestyle } from "../../interfaces/ILifestyle";
import { AppError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class LifestyleRepository implements ILifestyleRepository {
  private readonly model: Model<ILifestyle>;

  constructor(@inject(TYPES.LifestyleModel) model: Model<ILifestyle>) {
    this.model = model;
  }

  async findLifestyle(patientId: string): Promise<ILifestyle | null> {
    try {
      const lifestyle = await this.model.findOne({ patientId });

      return lifestyle;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateLifestyle(
    patientId: string,
    updateData: Partial<ILifestyle>
  ): Promise<ILifestyle> {
    try {
      const updatedLifestyle = await this.model.findOneAndUpdate(
        { patientId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      return updatedLifestyle;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default LifestyleRepository;
