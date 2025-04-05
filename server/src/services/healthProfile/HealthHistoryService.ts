import { inject, injectable } from "inversify";
import logger from "../../configs/logger";
import {
  IHealthHistory,
  IHealthHistoryService,
} from "../../interfaces/IHealthHistory";
import IHealthHistoryRepository from "../../repositories/healthProfile/interface/IHealthHistoryRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class HealthHistoryService implements IHealthHistoryService {
  private healthHistoryRepo: IHealthHistoryRepository;

  constructor(
    @inject(TYPES.IHealthHistoryRepository)
    healthHistoryRepo: IHealthHistoryRepository
  ) {
    this.healthHistoryRepo = healthHistoryRepo;
  }

  async getHealthHistory(patientId: string): Promise<IHealthHistory | null> {
    try {
      const healthHistory =
        await this.healthHistoryRepo.findHealthHistory(patientId);

      return healthHistory;
    } catch (error) {
      logger.error("Failded to update healt history", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async updateHealthHistory(
    patientId: string,
    updateData: Partial<IHealthHistory>
  ): Promise<IHealthHistory> {
    try {
      const updatedData = await this.healthHistoryRepo.upateHealthHistory(
        patientId,
        updateData
      );

      if (!updateData) {
        throw new AppError("Failed update Health history");
      }

      return updatedData;
    } catch (error) {
      logger.error("Failded to update healt history", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default HealthHistoryService;
