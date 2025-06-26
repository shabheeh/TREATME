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
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";
import { setRefreshTokenCookie } from "../../utils/cookie";

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

      setRefreshTokenCookie(res, refreshToken);

      res.status(HttpStatusCode.OK).json({
        doctor,
        accessToken,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      await this.doctorAuthService.changePassword(
        doctorId,
        currentPassword,
        newPassword
      );

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
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
