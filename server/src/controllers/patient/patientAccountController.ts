import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IPatient, { IPatientAccountController, IPatientAccountService } from "src/interfaces/IPatient";
import { AppError } from "../../utils/errors";
import { TokenPayload } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}


class PatientAcccountController implements IPatientAccountController {
    
    private patientAccountService: IPatientAccountService;

    constructor(patientAccountService: IPatientAccountService) {
        this.patientAccountService = patientAccountService
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            if (!req.user) {
                throw new AppError('User not authenticated')
            }

            const identifier = req.user.email;

            

            const imageFile: Express.Multer.File | undefined = req.file;
            
            let patientData: Partial<IPatient> = {}

            if(req.body.street) {
                patientData.address = req.body;
            }else {
                patientData = req.body;
            }
            

            
            const updatedData = await this.patientAccountService.updateProfile(identifier, patientData, imageFile)


            res.status(200).json({
                patient: updatedData,
                message: 'Profile updated Successfully'
            })


        } catch (error) {
            logger.error('error updating profile', error)
            next(error)
        }
    }
}

export default PatientAcccountController;