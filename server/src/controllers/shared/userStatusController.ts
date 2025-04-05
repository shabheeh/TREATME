import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorAuthService } from "../../interfaces/IDoctor";
import { IPatientAuthService } from "../../interfaces/IPatient";
import { AuthError, AuthErrorCode } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

export const checkUserStatus = (
  patientService: IPatientAuthService,
  doctorService: IDoctorAuthService
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || !(req.user as ITokenPayload).id) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      let isActive: boolean = true;

      if ((req.user as ITokenPayload).role === "patient") {
        isActive = await patientService.checkActiveStatus(
          (req.user as ITokenPayload).id
        );
      }

      if ((req.user as ITokenPayload).role === "doctor") {
        isActive = await doctorService.checkActiveStatus(
          (req.user as ITokenPayload).id
        );
      }

      if (!isActive) {
        res.status(HttpStatusCode.OK).json({
          success: false,
          message: ResponseMessage.ERROR.FORBIDDEN_ACCESS,
        });
        return;
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("Error in checkUserStatus :", error);
      next(error);
    }
  };
};
