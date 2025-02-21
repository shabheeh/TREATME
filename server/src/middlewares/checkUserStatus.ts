import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger";
import { IDoctorAuthService } from "../interfaces/IDoctor";
import { IPatientAuthService } from "../interfaces/IPatient";
import { ITokenPayload } from "src/utils/jwt";
// import { ITokenPayload } from "../utils/jwt";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: IITokenPayload;
//     }
//   }
// }

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
      if (!req.user || !(req.user as ITokenPayload).email) {
        res.status(401).json({ message: "Unauthenticated" });
        return;
      }

      if ((req.user as ITokenPayload).role === "admin") {
        return next();
      }

      let isActive: boolean = true;

      if ((req.user as ITokenPayload).role === "patient") {
        isActive = await patientService.checkActiveStatus(
          (req.user as ITokenPayload).email
        );
      } else if ((req.user as ITokenPayload).role === "doctor") {
        isActive = await doctorService.checkActiveStatus(
          (req.user as ITokenPayload).email
        );
      }

      if (!isActive) {
        logger.error("User account is blocked");
        res.status(403).json({ message: "Your account is blocked." });
        return;
      }

      next();
    } catch (error) {
      logger.error("Error in checkUserStatus middleware:", error);
      next(error);
    }
  };
};
