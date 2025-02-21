import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorAuthService } from "../../interfaces/IDoctor";
import { IPatientAuthService } from "../../interfaces/IPatient";
import { AuthError, AuthErrorCode } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";

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
      if (!req.user || !(req.user as ITokenPayload).email) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      let isActive: boolean = true;

      if ((req.user as ITokenPayload).role === "patient") {
        isActive = await patientService.checkActiveStatus(
          (req.user as ITokenPayload).email
        );
      }

      if ((req.user as ITokenPayload).role === "doctor") {
        isActive = await doctorService.checkActiveStatus(
          (req.user as ITokenPayload).email
        );
      }

      if (!isActive) {
        res.status(200).json({
          success: false,
          message: "User is Blocked",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User is Active",
      });
    } catch (error) {
      logger.error("Error in checkUserStatus :", error);
      next(error);
    }
  };
};
