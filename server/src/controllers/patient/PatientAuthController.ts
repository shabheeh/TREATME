import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger";
import {
  IPatientAuthService,
  IPatientAuthController,
} from "../../interfaces/IPatient";
import { AuthError, AuthErrorCode, BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class PatientAuthController implements IPatientAuthController {
  private patientAuthService: IPatientAuthService;

  constructor(
    @inject(TYPES.IPatientAuthService)
    patientAuthService: IPatientAuthService
  ) {
    this.patientAuthService = patientAuthService;
  }

  sendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      await this.patientAuthService.sendOtp(email, password);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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

      res.status(HttpStatusCode.CREATED).json({
        message: ResponseMessage.SUCCESS.RESOURCE_CREATED,
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

      res.status(HttpStatusCode.OK).json({
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

      res.status(HttpStatusCode.OK).json({
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

      res.status(HttpStatusCode.OK).json({
        messge: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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

        res.status(HttpStatusCode.OK).json({
          patient,
          accessToken,
          partialUser,
        });
        return;
      }

      const { newPatient, partialUser } = result;

      res.status(HttpStatusCode.OK).json({
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

      res.status(HttpStatusCode.OK).json({
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      await this.patientAuthService.resendOtp(email);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      await this.patientAuthService.resendOtpForgotPassword(email);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
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
      const { currentPassword, newPassword } = req.body;
      const { id } = req.user as ITokenPayload;
      if (!id) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!currentPassword || !newPassword) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      await this.patientAuthService.changePassword(
        id,
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
          : "Controller: Error changing password"
      );
      next(error);
    }
  };
}

export default PatientAuthController;
