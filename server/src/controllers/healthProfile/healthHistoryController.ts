import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IHealthHistoryController,
  IHealthHistoryService,
} from "../../interfaces/IHealthHistory";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

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
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const healthHistory =
        await this.healthHistoryService.getHealthHistory(patientId);

      res.status(HttpStatusCode.OK).json({ healthHistory });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const healthHistory = await this.healthHistoryService.updateHealthHistory(
        patientId,
        updateData
      );

      res.status(HttpStatusCode.OK).json({
        healthHistory,
      });
    } catch (error) {
      logger.error("Failded to update health history", error);
      next(error);
    }
  };

  addMedication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;
      const { medication } = req.body;

      if (!patientId || !medication) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      await this.healthHistoryService.addOrUpdateMedication(
        patientId,
        medication
      );
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
      });
    } catch (error) {
      logger.error("Failed to add medicaton", error);
      next(error);
    }
  };
}

export default HealthHistoryController;
