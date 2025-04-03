import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IHealthHistoryController,
  IHealthHistoryService,
} from "../../interfaces/IHealthHistory";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class HealthHistoryController implements IHealthHistoryController {
  private healthHistoryService: IHealthHistoryService;

  constructor(
    @inject(TYPES.IHealthHistoryService)
    healthHistoryService: IHealthHistoryService
  ) {
    this.healthHistoryService = healthHistoryService;
  }

  getHealthHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new BadRequestError("Bad Request");
      }

      const healthHistory =
        await this.healthHistoryService.getHealthHistory(patientId);

      res.status(200).json({ healthHistory });
    } catch (error) {
      logger.error("Failed to fetch health history", error);
      next(error);
    }
  };

  updateHealthHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;
      const updateData = req.body;

      if (!patientId || !updateData) {
        throw new BadRequestError("Bad request");
      }

      const healthHistory = await this.healthHistoryService.updateHealthHistory(
        patientId,
        updateData
      );

      res.status(200).json({
        healthHistory,
      });
    } catch (error) {
      logger.error("Failded to update health history", error);
      next(error);
    }
  };
}

export default HealthHistoryController;
