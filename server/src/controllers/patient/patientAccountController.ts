import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IPatientAccountController, IPatientAccountService } from "src/interfaces/IPatient";
import { AppError } from "../../utils/errors";




class PatientAcccountController implements IPatientAccountController {
    
    private patientAccountService: IPatientAccountService;

    constructor(patientAccountService: IPatientAccountService) {
        this.patientAccountService = patientAccountService
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { patientData } = req.body;

            const identifier = req.user?.email;

            if (!identifier) {
                throw new AppError('Something went wrong')
            }

            const updatedData = await this.patientAccountService.updateProfile(identifier, patientData)

            res.status(200).json({
                updatedData,
                message: 'Profile updated Successfully'
            })


        } catch (error) {
            logger.error('error updateing profile', error)
            next(error)
        }
    }
}

export default PatientAcccountController;