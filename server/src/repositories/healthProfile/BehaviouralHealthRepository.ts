import { IBehaviouralHealth } from "../../interfaces/IBehaviouralHealth";
import IBehaviouralHealthRepository from "./interface/IBehaviouralHealthRepository";
import { Model } from "mongoose";
import { handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class BehaviouralHealthRepository implements IBehaviouralHealthRepository {
  private readonly model: Model<IBehaviouralHealth>;

  constructor(
    @inject(TYPES.BehaviouralHealthModel) model: Model<IBehaviouralHealth>
  ) {
    this.model = model;
  }

  async findBehaviouralHealth(
    patientId: string
  ): Promise<IBehaviouralHealth | null> {
    try {
      const behaviouralHealth = await this.model.findOne({ patientId });
      return behaviouralHealth;
    } catch (error) {
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
    }
  }
}

export default BehaviouralHealthRepository;
