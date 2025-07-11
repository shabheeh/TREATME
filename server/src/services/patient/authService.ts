import bcrypt from "bcryptjs";
import IPatient, {
  IPatientAuthService,
  SignInResult,
  googleSignInResult,
} from "../../interfaces/IPatient";
import IPatientRepository from "../../repositories/patient/interface/IPatientRepository";
import { generateTokens, ITokenPayload } from "../../utils/jwt";
import CacheService from "../CacheService";
import OtpService from "../OtpService";
import logger from "../../configs/logger";
import { OAuth2Client } from "google-auth-library";
import {
  AppError,
  AuthError,
  AuthErrorCode,
  BadRequestError,
  ConflictError,
  handleTryCatchError,
} from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

const mailSubject = {
  verifyEmail: "Verify Your Email Address",
  resetPassword: "Reset Your Password",
};

@injectable()
class PatientAuthService implements IPatientAuthService {
  private patientRepository: IPatientRepository;
  private otpService: OtpService;
  private cacheService: CacheService;

  constructor(
    @inject(TYPES.IPatientRepository) patientRepository: IPatientRepository,
    @inject(TYPES.IOtpService) otpService: OtpService,
    @inject(TYPES.ICacheService) cacheService: CacheService
  ) {
    this.patientRepository = patientRepository;
    this.otpService = otpService;
    this.cacheService = cacheService;
  }

  async sendOtp(email: string, password: string): Promise<void> {
    try {
      const existingPatient =
        await this.patientRepository.findPatientByEmail(email);

      if (existingPatient) {
        throw new ConflictError("User with this email already exists");
      }

      await this.cacheService.store(
        `signup:${email}`,
        JSON.stringify({ email, password }),
        600
      );

      const otpSent = await this.otpService.sendOTP(
        email,
        "signup",
        mailSubject.verifyEmail
      );

      logger.info(otpSent);

      if (!otpSent) {
        throw new BadRequestError("Error Sending OTP");
      }
    } catch (error) {
      logger.error("errro sending otp", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    try {
      const patientData = await this.cacheService.retrieve(`signup:${email}`);

      if (!patientData) {
        throw new AuthError(AuthErrorCode.SESSION_EXPIRED);
      }

      const parsedPatientData = JSON.parse(patientData);

      const isOtpVerified = await this.otpService.verifyOTP(
        email,
        otp,
        "signup"
      );

      if (!isOtpVerified) {
        throw new AuthError(AuthErrorCode.INVALID_OTP);
      }

      await this.cacheService.store(
        `signup:${email}`,
        JSON.stringify({ ...parsedPatientData, isOtpVerified: true }),
        600
      );

      await this.otpService.deleteOTP(email, "signup");
    } catch (error) {
      logger.error("error verifying otp", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async signup(patient: IPatient): Promise<{ newUser: Partial<IPatient> }> {
    try {
      const cachedPatientData = await this.cacheService.retrieve(
        `signup:${patient.email}`
      );

      if (!cachedPatientData) {
        throw new AuthError(AuthErrorCode.SESSION_EXPIRED);
      }

      const parsedPatientData = JSON.parse(cachedPatientData);

      if (!parsedPatientData.isOtpVerified) {
        throw new BadRequestError("Please verify your email");
      }

      const hashedPassword = await bcrypt.hash(parsedPatientData.password, 0);

      patient.password = hashedPassword;

      const newUser = await this.patientRepository.create(patient);

      await this.cacheService.delete(`signup:${patient.email}`);

      const { password, ...userWithoutPassword } = newUser;

      void password;

      return { newUser: userWithoutPassword };
    } catch (error) {
      logger.error("error during signup", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async signin(email: string, password: string): Promise<SignInResult> {
    try {
      const patient = await this.patientRepository.findPatientByEmail(email);

      if (patient && !patient.isActive) {
        throw new AuthError(
          AuthErrorCode.USER_BLOCKED,
          undefined,
          HttpStatusCode.FORBIDDEN
        );
      }

      if (!patient) {
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          undefined,
          HttpStatusCode.BAD_REQUEST
        );
      }

      if (!patient.password) {
        throw new BadRequestError(
          "You signed in with Google, please use Google for future sign in"
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, patient.password);

      if (!isPasswordMatch) {
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          undefined,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const payload: ITokenPayload = {
        id: patient._id!.toString(),
        email: patient.email,
        role: "patient",
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      return { accessToken, refreshToken, patient };
    } catch (error) {
      logger.error("error signin patient", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async getUserByEmail(email: string): Promise<IPatient> {
    try {
      const patient = await this.patientRepository.findPatientByEmail(email);

      if (patient && !patient.isActive) {
        throw new AuthError(AuthErrorCode.USER_BLOCKED);
      }

      if (!patient) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
      }

      return patient;
    } catch (error) {
      logger.error("errro sending otp for forgot password", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async sendOtpForgotPassword(email: string): Promise<IPatient> {
    try {
      const patient = await this.patientRepository.findPatientByEmail(email);

      if (patient && !patient.isActive) {
        throw new AuthError(AuthErrorCode.USER_BLOCKED);
      }

      if (!patient) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
      }

      const isOtpSent = await this.otpService.sendOTP(
        email,
        "signin",
        mailSubject.resetPassword
      );

      if (!isOtpSent) {
        throw new BadRequestError("Failed to sent otp, Please try again later");
      }

      return patient;
    } catch (error) {
      logger.error("errro sending otp for forgot password", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async verifyOtpForgotPassword(email: string, otp: string): Promise<boolean> {
    try {
      const isOtpVerified = await this.otpService.verifyOTP(
        email,
        otp,
        "signin"
      );

      return isOtpVerified;
    } catch (error) {
      logger.error("error sign in with google", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedData = await this.patientRepository.updatePatient(id, {
        password: hashedPassword,
      });

      if (!updatedData) {
        throw new BadRequestError("Error reseting password");
      }
    } catch (error) {
      logger.error("error reseting password", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async googleSignIn(credential: string): Promise<googleSignInResult> {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (
        !payload ||
        !payload.email ||
        !payload.given_name ||
        !payload.family_name
      ) {
        throw new AuthError(AuthErrorCode.INVALID_TOKEN);
      }

      const patient = await this.patientRepository.findPatientByEmail(
        payload.email
      );
      const partialUser = false;

      if (patient && !patient.isActive) {
        throw new AuthError(AuthErrorCode.USER_BLOCKED);
      }

      if (patient) {
        const jwtPayload: ITokenPayload = {
          id: patient._id!.toString(),
          email: patient.email,
          role: "patient",
        };

        const { accessToken, refreshToken } = generateTokens(jwtPayload);

        return { patient, accessToken, refreshToken, partialUser };
      }

      const newPatient = {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        profilePicture: payload.picture,
      };

      await this.cacheService.store(
        `google:${newPatient.email}`,
        JSON.stringify(newPatient),
        300
      );

      return { newPatient, partialUser: true };
    } catch (error) {
      logger.error("error google signin", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async completeProfileAndSignUp(
    patientData: IPatient
  ): Promise<{ patient: IPatient; accessToken: string; refreshToken: string }> {
    try {
      const jsonGoogleData = await this.cacheService.retrieve(
        `google:${patientData.email}`
      );

      type GoogleData = {
        email: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
      };
      let googleData: GoogleData | null = null;

      if (jsonGoogleData) {
        googleData = JSON.parse(jsonGoogleData) as GoogleData;
      }

      const updatedPatientData = {
        ...patientData,
        email: googleData?.email || patientData.email,
        profilePicture:
          googleData?.profilePicture || patientData.profilePicture,
      } as IPatient;

      const patient = await this.patientRepository.create(updatedPatientData);

      if (!patient) {
        throw new AppError("Failed to create New User");
      }

      const jwtPayload: ITokenPayload = {
        id: patient._id!.toString(),
        email: patient.email,
        role: "patient",
      };

      const { accessToken, refreshToken } = generateTokens(jwtPayload);

      return {
        patient,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("error creating a new googleUser", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async resendOtp(email: string): Promise<void> {
    try {
      await this.otpService.deleteOTP(email, "signup");

      const otp = await this.otpService.sendOTP(
        email,
        "signup",
        mailSubject.verifyEmail
      );

      if (!otp) {
        throw new BadRequestError("Failed to Resend OTP");
      }

      logger.info(otp);
    } catch (error) {
      logger.error("error re-sending otp", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async resendOtpForgotPassword(email: string): Promise<void> {
    try {
      await this.otpService.deleteOTP(email, "signin");

      const otp = await this.otpService.sendOTP(
        email,
        "signin",
        mailSubject.resetPassword
      );

      if (!otp) {
        throw new BadRequestError("Failed to resend otp");
      }

      logger.info(otp);
    } catch (error) {
      logger.error("error re-sending otp", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async checkActiveStatus(id: string): Promise<boolean> {
    try {
      const patient = await this.patientRepository.findPatientById(id);

      if (!patient) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
      }

      return patient.isActive;
    } catch (error) {
      logger.error("error checking patient status", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const patient =
        await this.patientRepository.getPatientWithPassword(userId);

      if (!patient?.password) {
        throw new BadRequestError(
          "User signed with google can't change password"
        );
      }

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        patient?.password
      );

      if (!isPasswordMatch) {
        throw new BadRequestError("Incorrect current password");
      }

      await this.resetPassword(userId, newPassword);
    } catch (error) {
      logger.error("error changin password", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default PatientAuthService;
