import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IBehaviouralHealthController,
  IBehaviouralHealthService,
} from "../../interfaces/IBehaviouralHealth";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class BehaviouralHealthController implements IBehaviouralHealthController {
  private behavioralHealthService: IBehaviouralHealthService;

  constructor(
    @inject(TYPES.IBehaviouralHealthService)
    behaviouralHealthService: IBehaviouralHealthService
  ) {
    this.behavioralHealthService = behaviouralHealthService;
  }

  getBehaviuoralHealth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const behavioralHealth =
        await this.behavioralHealthService.findBehaviouralHealth(patientId);

      res.status(HttpStatusCode.OK).json({ behavioralHealth });
    } catch (error) {
      logger.error("failed to fetch behavioural health", error);
      next(error);
    }
  };

  updateBehavouralHealth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;
      const { updateData } = req.body;

      if (!patientId || !updateData) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const behavioralHealth =
        await this.behavioralHealthService.updateBehavouralHealth(
          patientId,
          updateData
        );

      res.status(HttpStatusCode.OK).json({ behavioralHealth });
    } catch (error) {
      logger.error("failed to update behavioural health", error);
      next(error);
    }
  };
}

export default BehaviouralHealthController;
