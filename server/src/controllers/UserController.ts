import { Request, Response } from "express";
import UserService from "../services/UserService";
// import IUser from "../interfaces/IUser";
import OtpService from "../services/OptService";



class UserController {

    private userService: UserService;
    private otpService: OtpService;

    constructor(userService: UserService, otpService: OtpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    sendOtp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password }: { email: string; password: string } = req.body;

            await this.userService.sendOtp(email, password)
            
            const otp = await this.otpService.getOTP(email);
    
            res.status(200).json({
                message: `A verification OTP has been sent to ${email}`,
                otp 
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    verifyOtp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp }: { email: string; otp: string } = req.body;
            
            await this.userService.verifyOtp(email, otp)
    
            res.status(200).json({
                message: 'OTP verified successfully',
                email
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const profileData = req.body; 

    
            await this.userService.signup(profileData)
    
            res.status(201).json({
                message: "User signed up successfully"
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    signin = async(req: Request, res: Response): Promise<void> => {
        try {
            const { email, password }: { email: string, password: string } = req.body

            const result = await this.userService.signin(email, password)

            if(result.googleUser) {
                res.status(202).json(result.message);
            }

            res.status(200).json(result);

        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

}

 
export default UserController;