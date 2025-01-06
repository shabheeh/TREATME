import { Request, Response } from 'express';
import  OtpService  from '../services/OptService';
import UserService  from '../services/UserService';

export class AuthController {
    private otpService: OtpService;
    private userService: UserService;

    constructor(userService: UserService) {
        this.otpService = new OtpService();
        this.userService = userService;
    }

    sendSignupOTP = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email } = req.body;

            // Check if email already exists
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Generate and send OTP
            await this.otpService.sendOTP(email);

            return res.status(200).json({ 
                message: 'OTP sent successfully',
                email 
            });
        } catch (error) {
            console.error('OTP send error:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
    };

    verifySignupOTP = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, otp, userData } = req.body;

            // Verify OTP
            const isValid = await this.otpService.verifyOTP(email, otp);
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }

            // Create user
            const user = await this.userService.createUser(userData);

            // Delete used OTP
            await this.otpService.deleteOTP(email);

            // Generate JWT token
            const token = signToken(user._id.toString());

            return res.status(201).json({ 
                message: 'User registered successfully',
                token 
            });
        } catch (error) {
            console.error('OTP verification error:', error);
            return res.status(500).json({ error: 'Failed to verify OTP' });
        }
    };
}