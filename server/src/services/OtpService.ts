import CacheService from "./CacheService";
import logger from "../configs/logger";
import { IOtpService } from "../interfaces/IShared";
import { getEmailTransporter } from "../configs/nodemailer";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/inversifyjs.types";

@injectable()
class OtpService implements IOtpService {
  private emailTransporter;
  private cacheService: CacheService;

  constructor(@inject(TYPES.ICacheService) cacheService: CacheService) {
    this.cacheService = cacheService;
    this.emailTransporter = getEmailTransporter();
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string, type: string, subject: string): Promise<string> {
    try {
      const otp = this.generateOTP();

      await this.cacheService.store(`otp-${type}:${email}`, otp, 300);

      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
                    <h1>OTP Verification</h1>
                    <p>Your OTP is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in 5 minutes.</p>
                `,
      });

      return otp;
    } catch (error) {
      logger.error("otp service", error);
      throw new Error("error sending otp");
    }
  }

  async verifyOTP(email: string, otp: string, type: string): Promise<boolean> {
    const storedOTP = await this.cacheService.retrieve(`otp-${type}:${email}`);
    return storedOTP === otp;
  }

  async getOTP(email: string, type: string): Promise<string | null> {
    return await this.cacheService.retrieve(`otp-${type}:${email}`);
  }

  async deleteOTP(email: string, type: string): Promise<void> {
    await this.cacheService.delete(`otp-${type}:${email}`);
  }
}

export default OtpService;
