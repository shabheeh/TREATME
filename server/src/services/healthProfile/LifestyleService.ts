import { inject, injectable } from "inversify";
import logger from "../../configs/logger";
import { ILifestyle, ILifestyleService } from "../../interfaces/ILifestyle";
import ILifestyleRepository from "../../repositories/healthProfile/interface/ILifestyleRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class LifestyleService implements ILifestyleService {
  private lifestyleRepo: ILifestyleRepository;

  constructor(
    @inject(TYPES.ILifestyleRepository) lifestyleRepo: ILifestyleRepository
  ) {
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
      handleTryCatchError("Service", error);
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
      handleTryCatchError("Service", error);
    }
  }
}

export default LifestyleService;
