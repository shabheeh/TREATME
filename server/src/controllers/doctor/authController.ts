import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorAuthController, IDoctorAuthService } from "../../interfaces/IDoctor";




class DoctorAuthController implements IDoctorAuthController {

    private doctorAuthService: IDoctorAuthService 

    constructor(doctorAuthService: IDoctorAuthService) {
        this.doctorAuthService = doctorAuthService
    }


    signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const { email, password } = req.body;

            const doctor = await this.doctorAuthService.signIn(email, password);

            res.status(200).json({
                doctor,
                message: 'Doctor signed in successfully'
            })

        } catch (error) {
            logger.error('error sign in doctor')
            next(error)
        }
    }
}


export default DoctorAuthController