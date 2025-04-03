import { inject, injectable } from "inversify";
import logger from "../../configs/logger";
import {
  IBehaviouralHealth,
  IBehaviouralHealthService,
} from "../../interfaces/IBehaviouralHealth";
import IBehaviouralHealthRepository from "../../repositories/healthProfile/interface/IBehaviouralHealthRepository";
import { AppError } from "../../utils/errors";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class BehaviouralHealthService implements IBehaviouralHealthService {
  private behaviouralHealthRepo: IBehaviouralHealthRepository;

  constructor(
    @inject(TYPES.IBehavouralHealthRepository)
    behaviouralHealRepo: IBehaviouralHealthRepository
  ) {
    this.behaviouralHealthRepo = behaviouralHealRepo;
  }

  async findBehaviouralHealth(
    patientId: string
  ): Promise<IBehaviouralHealth | null> {
    try {
      const behaviouralHealth =
        await this.behaviouralHealthRepo.findBehaviouralHealth(patientId);
      return behaviouralHealth;
    } catch (error) {
      logger.error("Failed to fetch behavioural health");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateBehavouralHealth(
    patientId: string,
    updateData: Partial<IBehaviouralHealth>
  ): Promise<IBehaviouralHealth> {
    try {
      const updatedData =
        await this.behaviouralHealthRepo.updateBehaviouralHealth(
          patientId,
          updateData
        );

      if (!updatedData) {
        throw new AppError("Failed to update Behavioural Health");
      }

      return updatedData;
    } catch (error) {
      logger.error("Failded to update behavioural health", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default BehaviouralHealthService;
