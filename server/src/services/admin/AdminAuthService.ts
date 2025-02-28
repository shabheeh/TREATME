import bcrpyt from "bcryptjs";
import logger from "../../configs/logger";
import IAdminRepository from "src/repositories/admin/interfaces/IAdminRepository";
import { generateTokens, ITokenPayload } from "../../utils/jwt";
import { IAdminAuthService, SignInAdminResult } from "../../interfaces/IAdmin";
import { AppError, AuthError, AuthErrorCode } from "../../utils/errors";

class AdminAuthService implements IAdminAuthService {
  private readonly adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async signInAdmin(
    email: string,
    password: string
  ): Promise<SignInAdminResult> {
    try {
      const admin = await this.adminRepository.findAdminByEmail(email);

      if (!admin) {
        throw new AuthError(AuthErrorCode.USER_NOT_FOUND, "Admin not Found");
      }

      const isPasswordMatch = await bcrpyt.compare(password, admin.password);

      if (!isPasswordMatch) {
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS);
      }

      const payload: ITokenPayload = {
        id: admin._id!.toString(),
        email: admin.email,
        role: "admin",
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      return { admin, accessToken, refreshToken };
    } catch (error) {
      logger.error("service: error sign in admin", error);
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

export default AdminAuthService;
