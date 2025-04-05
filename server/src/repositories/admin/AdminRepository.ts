import { Model } from "mongoose";
import IAdmin from "../../interfaces/IAdmin";
import IAdminRepository from "./interfaces/IAdminRepository";
import { AppError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
@injectable()
class AdminRepository implements IAdminRepository {
  private readonly model: Model<IAdmin>;

  constructor(@inject(TYPES.AdminModel) model: Model<IAdmin>) {
    this.model = model;
  }

  async findAdminById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findById(id).select("-password").lean();
      return admin;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findOne({ email }).lean();
      return admin;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default AdminRepository;
