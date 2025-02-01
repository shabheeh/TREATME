import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger";
import { IDoctorAuthService } from "../interfaces/IDoctor";
import { IPatientAuthService } from "../interfaces/IPatient";
import { TokenPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
} 

  
export const isUserActive = (patientService: IPatientAuthService, doctorService: IDoctorAuthService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          if (!req.user || !req.user.email) {
              res.status(401).json({ message: "Unauthenticated" });
              return;
          }

          if (req.user.role === 'admin') {
              return next();
          }

          let isActive: boolean = true;

          if (req.user.role === 'patient') {
              isActive = await patientService.checkActiveStatus(req.user.email);
          } else if (req.user.role === 'doctor') {
              isActive = await doctorService.checkActiveStatus(req.user.email);
          }

          if (!isActive) {
              logger.error('User account is blocked');
              res.status(403).json({ message: "Your account is blocked." });
              return;
          }

          next();

      } catch (error) {
          logger.error('Error in checkUserStatus middleware:', error);
          next(error);
      }
  };
};