import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IDependent, {
  IDependentController,
  IDependentService,
} from "../../interfaces/IDependent";
import { AppError, BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class DependentController implements IDependentController {
  private dependentService: IDependentService;

  constructor(
    @inject(TYPES.IDependentService) dependentService: IDependentService
  ) {
    this.dependentService = dependentService;
  }

  createDependent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(ResponseMessage.ERROR.UNAUTHORIZED_ACCESS);
      }

      const imageFile: Express.Multer.File | undefined = req.file;

      const dependentData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        primaryUserId: req.body.primaryUserId,
        relationship: req.body.relationship,
        dateOfBirth: req.body.dateOfBirth,
      } as IDependent;

      const dependent = await this.dependentService.createDependent(
        dependentData,
        imageFile
      );

      res.status(HttpStatusCode.CREATED).json({
        dependent,
        message: ResponseMessage.SUCCESS.RESOURCE_CREATED,
      });
    } catch (error) {
      logger.error("error creating dependent", error);
      next(error);
    }
  };

  getDependents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const primaryUserId = req.params.id;

      const dependents =
        await this.dependentService.getDependents(primaryUserId);

      res.status(HttpStatusCode.OK).json({ dependents });
    } catch (error) {
      logger.error("error fetching dependents");
      next(error);
    }
  };

  deleteDependent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;

      await this.dependentService.deleteDependent(id);

      res.status(HttpStatusCode.OK);
    } catch (error) {
      logger.error("error deleteing dependent");
      next(error);
    }
  };

  updateDependent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const imageFile: Express.Multer.File | undefined = req.file;

      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        relationship: req.body.relationship,
        dateOfBirth: req.body.dateOfBirth,
      };

      const dependent = await this.dependentService.updateDependent(
        id,
        updateData,
        imageFile
      );

      res.status(HttpStatusCode.OK).json({
        dependent,
        message: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
      });
    } catch (error) {
      logger.error("error updating profile", error);
      next(error);
    }
  };
}

export default DependentController;
