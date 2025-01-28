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

            const result = await this.doctorAuthService.signIn(email, password);

            const { accessToken, refreshToken, doctor } = result;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })

            res.status(200).json({
                doctor,
                accessToken,
                message: 'Doctor signed in successfully'
            })

        } catch (error) {
            logger.error('error sign in doctor')
            next(error)
        }
    }

    signOut = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
            });

            res.status(200).json({
                message: 'user signed out successfully'
            })


        } catch (error) {
            logger.error('controller: Error resending otp:', error);
            next(error)
        }
    }
}


export default DoctorAuthController