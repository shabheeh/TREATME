import { Request, Response } from "express";
import UserService from "../services/UserService";
import IUser from "../interfaces/IUser";
import OtpService from "../services/OptService";
import { Session } from "express-session";

interface SignupRequest extends Request {
    user?: Express.User;
    session: Session & {
        user?: Partial<IUser>;
    };
}

interface VerifyOTPRequest extends Request {
    user?: Express.User;
    session: Session & {
        user: IUser;
    };
}

class UserController {

    private userService: UserService;
    private otpService: OtpService;

    constructor(userService: UserService, otpService: OtpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    signup = async(req: SignupRequest, res: Response): Promise<void> => {
        try {
            const user: IUser = req.body;
            req.session.user = user;

            const sendOTP = await this.otpService.sendOTP(user.email)

            if (!sendOTP) {
                res.json({
                    message: 'Faild to verification otp please try again later'
                })
                return
            }

            // const otp = await this.otpService.getOtp(user.email)

            res.status(200).json({
                message: `A verification otp sent to your email ${user.email} `
            });

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }


    verifyOtp = async(req: VerifyOTPRequest, res: Response): Promise<void> => {
        try {
            const { email, otp }: { email: string, otp: string } = req.body;
            const verifyOtp = await this.otpService.verifyOTP(email,otp);
            
            if (!verifyOtp) {
                res.json({
                    message: 'Invalid Otp'
                })
                return
            }

            const user = req.session.user;

            const newUser = await this.userService.signup(user);

            if(!newUser) {
                res.json({
                    message: "Something went wrong in signup user"
                })
                return
            }

            res.status(201).json({
                message: "User signed up successfully"
            })

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

    signin = async(req: Request, res: Response): Promise<void> => {
        try {
            const { email, password }: { email: string, password: string } = req.body
            const result = await this.userService.signin(email, password)

            if(result.googleUser) {
                res.status(202).json(result.message)
            }

            res.status(200).json(result)
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

}


export default UserController;