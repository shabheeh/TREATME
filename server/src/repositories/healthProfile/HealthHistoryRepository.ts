import { Model } from "mongoose";
import IHealthHistoryRepository from "./interface/IHealthHistoryRepository";
import { IHealthHistory } from "../../interfaces/IHealthHistory";
import { handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class HealthHistoryRepository implements IHealthHistoryRepository {
  private readonly model: Model<IHealthHistory>;

  constructor(@inject(TYPES.HealthHistoryModel) model: Model<IHealthHistory>) {
    this.model = model;
  }

  async findHealthHistory(patientId: string): Promise<IHealthHistory | null> {
    try {
      const healthHistroy = await this.model.findOne({ patientId });

      return healthHistroy;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async upateHealthHistory(
    patientId: string,
    updateData: Partial<IHealthHistory>
  ): Promise<IHealthHistory> {
    try {
      const updatedHealthHistory = await this.model.findOneAndUpdate(
        { patientId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      return updatedHealthHistory;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default HealthHistoryRepository;
