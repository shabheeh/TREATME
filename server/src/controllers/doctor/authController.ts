import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IDoctorAuthController,
  IDoctorAuthService,
} from "../../interfaces/IDoctor";
import { BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "../../utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class DoctorAuthController implements IDoctorAuthController {
  private doctorAuthService: IDoctorAuthService;

  constructor(
    @inject(TYPES.IDoctorAuthService) doctorAuthService: IDoctorAuthService
  ) {
    this.doctorAuthService = doctorAuthService;
  }

  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.doctorAuthService.signIn(email, password);

      const { accessToken, refreshToken, doctor } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        doctor,
        accessToken,
        message: "Doctor signed in successfully",
      });
    } catch (error) {
      logger.error("error sign in doctor");
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

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctorId = (req.user as ITokenPayload).id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new BadRequestError("Missing current and new password");
      }

      await this.doctorAuthService.changePassword(
        doctorId,
        currentPassword,
        newPassword
      );

      res
        .status(200)
        .json({ success: true, message: "password changed successfully" });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: error changing password"
      );
      next(error);
    }
  };
}

export default DoctorAuthController;
