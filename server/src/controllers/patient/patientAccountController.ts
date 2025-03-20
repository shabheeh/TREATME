import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IPatient, {
  IPatientAccountController,
  IPatientAccountService,
} from "src/interfaces/IPatient";
import { AppError, BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";
// import { ITokenPayload } from "../../utils/jwt";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: ITokenPayload;
//     }
//   }
// }

class PatientAcccountController implements IPatientAccountController {
  private patientAccountService: IPatientAccountService;

  constructor(patientAccountService: IPatientAccountService) {
    this.patientAccountService = patientAccountService;
  }

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated");
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

      res.status(200).json({
        patient: updatedData,
        message: "Profile updated Successfully",
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
        throw new BadRequestError("Bad Request: Missing info");
      }
      const result = await this.patientAccountService.getHealthProfile(id);
      res.status(200).json({
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
