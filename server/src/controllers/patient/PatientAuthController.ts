import { NextFunction, Request, Response } from "express";
import OtpService from "../../services/OtpService";
import logger from "../../configs/logger";
import {
  IPatientAuthService,
  IPatientAuthController,
} from "../../interfaces/IPatient";
import { BadRequestError } from "../../utils/errors";

class PatientAuthController implements IPatientAuthController {
  private patientAuthService: IPatientAuthService;
  private otpService: OtpService;

  constructor(patientAuthService: IPatientAuthService, otpService: OtpService) {
    this.patientAuthService = patientAuthService;
    this.otpService = otpService;
  }

  sendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      await this.patientAuthService.sendOtp(email, password);

      const otp = await this.otpService.getOTP(email, "signup");

      res.status(200).json({
        message: `A verification OTP has been sent to ${email}`,
        otp,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp }: { email: string; otp: string } = req.body;

      await this.patientAuthService.verifyOtp(email, otp);

      res.status(200).json({
        message: "OTP verified successfully",
        email,
      });
    } catch (error) {
      logger.error("error verifying otp", error);
      next(error);
    }
  };

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body;

      await this.patientAuthService.signup(userData);

      res.status(201).json({
        message: "User signed up successfully",
      });
    } catch (error) {
      logger.error("error signup", error);
      next(error);
    }
  };

  signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const result = await this.patientAuthService.signin(email, password);

      if ("googleUser" in result) {
        res.status(202).json(result.message);
        return;
      }

      const { accessToken, refreshToken, patient } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        accessToken,
        patient,
      });
    } catch (error) {
      logger.error("error signin", error);
      next(error);
    }
  };

  sendOtpForgotPassowrd = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      const patient =
        await this.patientAuthService.sendOtpForgotPassword(email);

      res.status(200).json({
        patient,
      });
    } catch (error) {
      logger.error("error sedning otp fogotpassword", error);
      next(error);
    }
  };

  verifyOtpForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;

      await this.patientAuthService.verifyOtpForgotPassword(email, otp);

      res.status(200).json({
        messge: "OTP verified successfully",
      });
    } catch (error) {
      logger.error("error veriying otp forgotpassword", error);
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, password } = req.body;

      await this.patientAuthService.resetPassword(id, password);

      res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error) {
      logger.error("error reset password", error);
      next(error);
    }
  };

  googleSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { credential } = req.body;

      const result = await this.patientAuthService.googleSignIn(credential);

      if (!result.partialUser) {
        const { patient, accessToken, refreshToken, partialUser } = result;

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          patient,
          accessToken,
          partialUser,
        });
        return;
      }

      const { newPatient, partialUser } = result;

      res.status(200).json({
        patient: newPatient,
        partialUser,
      });
    } catch (error) {
      logger.error("Error during Google authentication:", error);
      next(error);
    }
  };

  completeProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { patientData } = req.body;

      const result =
        await this.patientAuthService.completeProfileAndSignUp(patientData);

      const { patient, accessToken, refreshToken } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        patient,
        accessToken,
      });
    } catch (error) {
      logger.error("Error during Google authentication singup:", error);
      next(error);
    }
  };

  resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError("No email not provided");
      }

      await this.patientAuthService.resendOtp(email);

      res.status(200).json({
        message: "otp resent successfully",
      });
    } catch (error) {
      logger.error("controller: Error resending otp:", error);
      next(error);
    }
  };

  resendOtpForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError("No email not provided");
      }

      await this.patientAuthService.resendOtpForgotPassword(email);

      res.status(200).json({
        message: "otp resent successfully",
      });
    } catch (error) {
      logger.error("controller: Error resending otp:", error);
      next(error);
    }
  };

  signOut = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(200).json({
        message: "user signed out successfully",
      });
    } catch (error) {
      logger.error("controller: Error resending otp:", error);
      next(error);
    }
  };

  
}

export default PatientAuthController;
