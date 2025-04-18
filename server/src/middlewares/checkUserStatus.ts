import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger";
import { IDoctorAuthService } from "../interfaces/IDoctor";
import { IPatientAuthService } from "../interfaces/IPatient";
import { ITokenPayload } from "src/utils/jwt";
import { HttpStatusCode } from "../constants/httpStatusCodes";

export const isUserActive = (
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
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Unauthenticated" });
        return;
      }

      if ((req.user as ITokenPayload).role === "admin") {
        return next();
      }

      let isActive: boolean = true;

      if ((req.user as ITokenPayload).role === "patient") {
        isActive = await patientService.checkActiveStatus(
          (req.user as ITokenPayload).id
        );
      } else if ((req.user as ITokenPayload).role === "doctor") {
        isActive = await doctorService.checkActiveStatus(
          (req.user as ITokenPayload).id
        );
      }

      if (!isActive) {
        logger.error("User account is blocked");
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ message: "Your account is blocked." });
        return;
      }

      next();
    } catch (error) {
      logger.error("Error in checkUserStatus middleware:", error);
      next(error);
    }
  };
};
