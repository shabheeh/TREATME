import { IDoctorAuthService, SignInResult } from "../../interfaces/IDoctor";
import IDoctorRepository from "../../repositories/doctor/interfaces/IDoctorRepository";
import bcrypt from "bcryptjs";
import { AppError, AuthError, AuthErrorCode } from "../../utils/errors";
import logger from "../../configs/logger";
import { generateTokens, ITokenPayload } from "../../utils/jwt";

class DoctorAuthService implements IDoctorAuthService {
  private doctorRepository: IDoctorRepository;

  constructor(doctorRepository: IDoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const doctor = await this.doctorRepository.findDoctorByEmail(email);

      if (doctor && !doctor.isActive) {
        throw new AuthError(AuthErrorCode.USER_BLOCKED, undefined, 403);
      }

      if (!doctor) {
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, undefined, 400);
      }

      const isPasswordMatch = await bcrypt.compare(password, doctor.password);

      if (!isPasswordMatch) {
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, undefined, 400);
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
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async checkActiveStatus(email: string): Promise<boolean> {
    try {
      const doctor = await this.doctorRepository.findDoctorByEmail(email);

      if (!doctor) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
      }

      return doctor.isActive;
    } catch (error) {
      logger.error("error checking doctor status", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default DoctorAuthService;
