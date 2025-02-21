import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  ILifestyleController,
  ILifestyleService,
} from "../../interfaces/ILifestyle";
import { BadRequestError } from "../../utils/errors";

class LifestyleController implements ILifestyleController {
  private lifestyleService: ILifestyleService;

  constructor(lifestyleService: ILifestyleService) {
    this.lifestyleService = lifestyleService;
  }

  getLifestyle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const lifestyle = await this.lifestyleService.findLifestyle(patientId);

      res.status(200).json({ lifestyle });
    } catch (error) {
      logger.error("Failed to fetch lifestyle");
      next(error);
    }
  };

  updateLifestyle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientId } = req.params;
      const updateData = req.body;

      if (!patientId || !updateData) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const lifestyle = await this.lifestyleService.updateLifestyle(
        patientId,
        updateData
      );

      res.status(200).json({ lifestyle });
    } catch (error) {
      logger.error("Failed to update lifestyle");
      next(error);
    }
  };
}

export default LifestyleController;
