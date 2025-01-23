import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger";
import { IDoctorAuthService } from "../interfaces/IDoctor";
import { IPatientAuthService } from "../interfaces/IPatient";




export const checkUserStatus = (service: IPatientAuthService | IDoctorAuthService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {

        if (!req.user || !req.user.email) {
          res.status(401).json({ message: "Unauthorized" });
          return
        }
  
        if (req.user.role === 'admin') {
          return next();
        }
  
        const isActive = await service.checkActiveStatus(req.user.email);
  

        if (!isActive) {
          res.status(403).json({ message: "Your account is blocked." });
          return
        }
  

        return next();
      } catch (error) {
        logger.error('Error in checkUserStatus middleware:', error);
        return next(error);  
      }
    };
  };
  