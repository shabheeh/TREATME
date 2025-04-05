import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  ILifestyleController,
  ILifestyleService,
} from "../../interfaces/ILifestyle";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class LifestyleController implements ILifestyleController {
  private lifestyleService: ILifestyleService;

  constructor(
    @inject(TYPES.ILifestyleService) lifestyleService: ILifestyleService
  ) {
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
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const lifestyle = await this.lifestyleService.findLifestyle(patientId);

      res.status(HttpStatusCode.OK).json({ lifestyle });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const lifestyle = await this.lifestyleService.updateLifestyle(
        patientId,
        updateData
      );

      res.status(HttpStatusCode.OK).json({ lifestyle });
    } catch (error) {
      logger.error("Failed to update lifestyle");
      next(error);
    }
  };
}

export default LifestyleController;
