import logger from "../../configs/logger";
import { ILifestyle, ILifestyleService } from "../../interfaces/ILifestyle";
import ILifestyleRepository from "../../repositories/healthProfile/interface/ILifestyleRepository";
import { AppError } from "../../utils/errors";

class LifestyleService implements ILifestyleService {
  private lifestyleRepo: ILifestyleRepository;

  constructor(lifestyleRepo: ILifestyleRepository) {
    this.lifestyleRepo = lifestyleRepo;
  }

  async findLifestyle(patientId: string): Promise<ILifestyle | null> {
    try {
      const lifestyle = await this.lifestyleRepo.findLifestyle(patientId);

      return lifestyle;
    } catch (error) {
      logger.error("Failed to fetch lifestyle", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateLifestyle(
    patientId: string,
    updateData: Partial<ILifestyle>
  ): Promise<ILifestyle> {
    try {
      const updatedData = await this.lifestyleRepo.updateLifestyle(
        patientId,
        updateData
      );

      if (!updatedData) {
        throw new AppError("Failed to update Lifestyle");
      }

      return updatedData;
    } catch (error) {
      logger.error("Failded to update Lifestyle", error);
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

export default LifestyleService;
