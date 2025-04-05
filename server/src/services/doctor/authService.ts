import { IDoctorAuthService, SignInResult } from "../../interfaces/IDoctor";
import IDoctorRepository from "../../repositories/doctor/interfaces/IDoctorRepository";
import bcrypt from "bcryptjs";
import {
  AppError,
  AuthError,
  AuthErrorCode,
  BadRequestError,
  handleTryCatchError,
} from "../../utils/errors";
import logger from "../../configs/logger";
import { generateTokens, ITokenPayload } from "../../utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class DoctorAuthService implements IDoctorAuthService {
  private doctorRepository: IDoctorRepository;

  constructor(
    @inject(TYPES.IDoctorRepository) doctorRepository: IDoctorRepository
  ) {
    this.doctorRepository = doctorRepository;
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const doctor = await this.doctorRepository.findDoctorByEmail(email);

      if (doctor && !doctor.isActive) {
        throw new AuthError(
          AuthErrorCode.USER_BLOCKED,
          undefined,
          HttpStatusCode.FORBIDDEN
        );
      }

      if (!doctor) {
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          undefined,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, doctor.password);

      if (!isPasswordMatch) {
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          undefined,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const payload: ITokenPayload = {
        id: doctor._id!.toString(),
        email: doctor.email,
        role: "doctor",
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      return { accessToken, refreshToken, doctor };
    } catch (error) {
      logger.error("error doctor signin", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async checkActiveStatus(id: string): Promise<boolean> {
    try {
      const doctor = await this.doctorRepository.findDoctorById(id);

      if (!doctor) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
      }

      return doctor.isActive;
    } catch (error) {
      logger.error("error checking doctor status", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async changePassword(
    doctorId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const doctor =
        await this.doctorRepository.getDoctorWithPassword(doctorId);

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        doctor.password
      );

      if (!isPasswordMatch) {
        throw new BadRequestError("Incorrect current password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedData = await this.doctorRepository.updateDoctor(doctorId, {
        password: hashedPassword,
      });

      if (!updatedData) {
        throw new AppError("Something went wrong");
      }
    } catch (error) {
      logger.error("error changing password", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default DoctorAuthService;
