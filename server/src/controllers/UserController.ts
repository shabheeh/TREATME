import { Request, Response } from "express";
import UserService from "../services/UserService";
// import IUser from "../interfaces/IUser";
import OtpService from "../services/OtpService";
import logger from "../configs/logger";
import IUser from "src/interfaces/IUser";


interface JwtPayload {
    email: string;
    role: string;
  }
  
  interface AuthRequest extends Request {
      user: JwtPayload;
    }

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
            
            const otp = await this.otpService.getOTP(email, 'signup');
    
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
            logger.error(error.message)

        }
    }
    
    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('signup called')
            const userData = req.body; 

    
            await this.userService.signup(userData)
    
            res.status(201).json({
                message: "User signed up successfully"
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
            logger.error(error.message)

        }
    }

    signin = async(req: Request, res: Response): Promise<void> => {
        try {
            const { email, password }: { email: string, password: string } = req.body

            const result = await this.userService.signin(email, password)

            if("googleUser" in result) {
                res.status(202).json(result.message);
                return
            }

            const { accessToken, refreshToken, user } = result;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })

            res.status(200).json({
                accessToken, 
                user
            });

        } catch (error) {
            res.status(401).json({ error: error.message });
            logger.error(error.message)

        }
    }

    sendOtpForgotPassowrd = async (req: Request, res: Response): Promise<void> => {
        try {

            const { email } = req.body;

            const user = await this.userService.sendOtpForgotPassword(email);

            res.status(200).json({
                user
            })
            
            
        } catch (error) {
            res.status(401).json({ error: error.message });
            logger.error(error.message)
        }
    }

    verifyOtpForgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp } = req.body;

            await this.userService.verifyOtpForgotPassword(email, otp);


            res.status(200).json({
                messge: "OTP verified successfully"
            })

        } catch (error) {
            res.status(500).json({ error: error.message });
            logger.error(error.message)
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, password } = req.body;

            await this.userService.resetPassword(id, password);

            res.status(200).json({
                message: 'Password reset successfully'
            })
        } catch (error) {
            res.status(500).json({error: error.message })
            logger.error(error.message)
        }
    }

    googleCallback = async (req: Request, res: Response): Promise<void> => {
        try {
            if(!req.user) {
                res.status(401).json({
                    message: 'Authentication falied'
                })
                return
            }

            const gooleUser = req.user as Partial<IUser>

            const result = await this.userService.googleCallback(gooleUser);

            if ("partialUser" in result) { 
                const { partialUser } = result;
                res.status(202).json({
                    partialUser,
                    message: "Complete your profile"
                })
                return
            }

            const { accessToken, refreshToken, user } = result;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, 
              });
            
              res.status(200).json({
                accessToken,
                user
              })

        } catch (error) {
            logger.error('Error during Google authentication:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    googleSignIn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { credential } = req.body;

            const result = await this.userService.googleSignIn(credential)

            if(!result.partialUser) {

                const { user, accessToken, refreshToken, partialUser } = result


                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                })

            logger.info(user)


                res.status(200).json({
                    user,
                    accessToken,
                    partialUser
                })
                return
            }

            const { newUser, accessToken, refreshToken, partialUser } = result;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })


            res.status(200).json({
                user: newUser,
                accessToken,
                partialUser
            })

        } catch (error) {
            logger.error('Error during Google authentication:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    completeProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { userData } = req.body;
            const { email } = req.user

            userData.email = email

            const user = await this.userService.completeProfileAndSignUp(userData)

            res.status(200).json({
                user
            })

        } catch (error) {
            logger.error('Error during Google authentication singup:', error);
            res.status(500).json({ error: 'Server error' });
        }
    } 

}

 
export default UserController;