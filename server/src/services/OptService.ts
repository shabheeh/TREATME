import nodemailer from 'nodemailer';
import CacheService from './CacheService';

export default class OtpService {
    private emailTransporter;
    private cacheService: CacheService;

    constructor(cacheService: CacheService) {
        this.cacheService = cacheService;

        this.emailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOTP(email: string): Promise<string> {
        const otp = this.generateOTP();


        await this.cacheService.store(`otp:${email}`, otp, 300);

        await this.emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Signup',
            html: `
                <h1>OTP Verification</h1>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
            `,
        });

        return otp;
    }

    async verifyOTP(email: string, otp: string): Promise<boolean> {
        const storedOTP = await this.cacheService.retrieve(`otp:${email}`);
        return storedOTP === otp;
    }

    async getOTP(email: string): Promise<string | null> {
        return await this.cacheService.retrieve(`otp:${email}`);
    }

    async deleteOTP(email: string): Promise<void> {
        await this.cacheService.delete(`otp:${email}`);
    }
}
