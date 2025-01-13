import { Request, Response } from "express";
import logger from "../../configs/logger";
import AdminAuthService from "../../services/admin/AdminAuthService";




class AdminAuthController {

    private adminAuthService: AdminAuthService;

    constructor(adminAuthService: AdminAuthService) {
        this.adminAuthService = adminAuthService
    }


    signUpAdmin = async(req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            console.log(req.body)

            await this.adminAuthService.SignUpAdmin(email, password)

            res.status(200).json({
                message: 'admin signed up successfully'
            })

        } catch (error) {
            logger.error('error creatin new admin', error.message);
            throw new Error(`Error creating new admin ${error.message}`)
        }
    }

    signInAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            
            const result = await this.adminAuthService.signInAdmin(email, password)

            const { accessToken, refreshToken } = result;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })

            res.status(200).json({
                accessToken,
                message: 'admin signed in successfully'
            })
            
        } catch (error) {
            logger.error('controller:error sign in admin ', error.message);
            throw new Error(`Error sign in admin ${error.message}`)
        }
    }
}


export default AdminAuthController