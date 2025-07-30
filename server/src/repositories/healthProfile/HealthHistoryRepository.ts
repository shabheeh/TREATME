import { Model } from "mongoose";
import IHealthHistoryRepository from "./interface/IHealthHistoryRepository";
import { IHealthHistory, IMedication } from "../../interfaces/IHealthHistory";
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

  async addOrUpdateMedication(
    patientId: string,
    medication: IMedication
  ): Promise<IHealthHistory | null> {
    try {
      const healthHistory = await this.model.findOne({ patientId });

      if (!healthHistory) {
        const newHistory = await this.model.findOneAndUpdate(
          { patientId },
          {
            $set: { patientId },
            $push: { medications: medication },
          },
          { new: true, upsert: true }
        );
        return newHistory;
      }

      const updatedMedications = [...healthHistory.medications];
      const index = updatedMedications.findIndex(
        (m) => m.name.toLowerCase() === medication.name.toLowerCase()
      );

      if (index !== -1) {
        updatedMedications[index] = medication;
      } else {
        updatedMedications.push(medication);
      }

      const updated = await this.model.findOneAndUpdate(
        { patientId },
        { $set: { medications: updatedMedications } },
        { new: true }
      );

      return updated;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default HealthHistoryRepository;
