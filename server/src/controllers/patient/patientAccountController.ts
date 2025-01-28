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

            if (!req.user) {
                throw new AppError('User not authenticated')
            }

            const identifier = req.user.email;

            

            const imageFile: Express.Multer.File | undefined = req.file;
            
            const patientData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                gender: req.body.gender,
                dateOfBirth: req.body.dateOfBirth,
                address: {
                    street: req.body.street,
                    city: req.body.city,
                    landmark: req.body.landmark,
                    state: req.body.state,
                    pincode: req.body.pincode
                }
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