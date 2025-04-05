import { NextFunction, Request, Response } from "express";
import ISpecialization, {
  ISpecializationController,
  ISpecializationService,
} from "../../interfaces/ISpecilazation";
import { BadRequestError } from "../../utils/errors";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class SpecializationController implements ISpecializationController {
  private specializationService: ISpecializationService;

  constructor(
    @inject(TYPES.ISpecializationService)
    specializationService: ISpecializationService
  ) {
    this.specializationService = specializationService;
  }

  createSpecialization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const specialization = {
        name: req.body.name,
        description: req.body.description,
        note: req.body.note,
        fee: req.body.fee,
        durationInMinutes: req.body.durationInMinutes,
        concerns: JSON.parse(req.body.concerns),
      } as ISpecialization;

      const imageFile = req.file;

      await this.specializationService.createSpecialization(
        specialization,
        imageFile
      );

      res.status(HttpStatusCode.CREATED).json({
        message: ResponseMessage.SUCCESS.RESOURCE_CREATED,
      });
    } catch (error) {
      logger.error("Error creating Specialization", error);
      next(error);
    }
  };

  getSpecializations = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const specializations =
        await this.specializationService.getSpecializations();

      res.status(HttpStatusCode.OK).json({
        specializations,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("Error Fetching Specializations", error);
      next(error);
    }
  };

  getSpecializationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { specializationId } = req.params;

      if (!specializationId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const specialization =
        await this.specializationService.getSpecializationById(
          specializationId
        );

      res.status(HttpStatusCode.OK).json({
        specialization,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("Error Fetching Specialization", error);
      next(error);
    }
  };

  updateSpecialization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { specializationId } = req.params;

      if (!specializationId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const updateData = {
        name: req.body.name,
        description: req.body.description,
        note: req.body.note,
        fee: req.body.fee,
        durationInMinutes: req.body.durationInMinutes,
        concerns: JSON.parse(req.body.concerns),
      } as ISpecialization;

      const imageFile: Express.Multer.File | undefined = req.file;

      const updatedData = await this.specializationService.updateSpecialization(
        specializationId,
        updateData,
        imageFile
      );

      res.status(HttpStatusCode.OK).json({
        updatedData,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("Error upadating Specializations", error);
      next(error);
    }
  };
}

export default SpecializationController;
