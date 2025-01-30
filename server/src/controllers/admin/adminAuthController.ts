import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import AdminAuthService from "../../services/admin/AdminAuthService";
import { IAdminAuthController } from "../../interfaces/IAdmin";




class AdminAuthController implements IAdminAuthController {

    private adminAuthService: AdminAuthService;

    constructor(adminAuthService: AdminAuthService) {
        this.adminAuthService = adminAuthService
    }

    signInAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            
            const result = await this.adminAuthService.signInAdmin(email, password)

            const { admin, accessToken, refreshToken } = result;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })

            res.status(200).json({
                admin,
                accessToken,
                message: 'admin signed in successfully'
            })
            
        } catch (error) {
            logger.error('controller:error sign in admin ', error);
            next(error)
        }
    }
}


export default AdminAuthController