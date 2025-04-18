import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IPatient, {
  IPatientAccountController,
  IPatientAccountService,
} from "src/interfaces/IPatient";
import { AuthError, AuthErrorCode, BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class PatientAcccountController implements IPatientAccountController {
  private patientAccountService: IPatientAccountService;

  constructor(
    @inject(TYPES.IPatientAcccountService)
    patientAccountService: IPatientAccountService
  ) {
    this.patientAccountService = patientAccountService;
  }

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      const { id } = req.user as ITokenPayload;

      const imageFile: Express.Multer.File | undefined = req.file;

      let patientData: Partial<IPatient> = {};

      if (req.body.street) {
        patientData.address = req.body;
      } else {
        patientData = req.body;
      }

      const updatedData = await this.patientAccountService.updateProfile(
        id,
        patientData,
        imageFile
      );

      res.status(HttpStatusCode.OK).json({
        patient: updatedData,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("error updating profile", error);
      next(error);
    }
  };

  getHealthProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }
      const result = await this.patientAccountService.getHealthProfile(id);
      res.status(HttpStatusCode.OK).json({
        healthHistory: result.healtHistory,
        behaviouralHealth: result.behaviouralHealth,
        lifestyle: result.lifestyle,
      });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Controller: getHealthProfile"
      );
      next(error);
    }
  };
}

export default PatientAcccountController;
