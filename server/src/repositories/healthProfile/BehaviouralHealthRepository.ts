import { IBehaviouralHealth } from "../../interfaces/IBehaviouralHealth";
import IBehaviouralHealthRepository from "./interface/IBehaviouralHealthRepository";
import { Model } from "mongoose";
import { AppError } from "../../utils/errors";

class BehaviouralHealthRepository implements IBehaviouralHealthRepository {
  private readonly model: Model<IBehaviouralHealth>;

  constructor(model: Model<IBehaviouralHealth>) {
    this.model = model;
  }

  async findBehaviouralHealth(
    patientId: string
  ): Promise<IBehaviouralHealth | null> {
    try {
      const behaviouralHealth = await this.model.findOne({ patientId });
      return behaviouralHealth;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateBehaviouralHealth(
    patientId: string,
    updateData: Partial<IBehaviouralHealth>
  ): Promise<IBehaviouralHealth> {
    try {
      const behaviouralHealth = await this.model.findOneAndUpdate(
        { patientId },
        { $set: updateData },
        { new: true, upsert: true }
      );
      return behaviouralHealth;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default BehaviouralHealthRepository;
