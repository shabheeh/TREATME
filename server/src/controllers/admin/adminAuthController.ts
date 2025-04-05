import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IAdminAuthController,
  IAdminAuthService,
} from "../../interfaces/IAdmin";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class AdminAuthController implements IAdminAuthController {
  private adminAuthService: IAdminAuthService;

  constructor(
    @inject(TYPES.IAdminAuthService) adminAuthService: IAdminAuthService
  ) {
    this.adminAuthService = adminAuthService;
  }

  signInAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.adminAuthService.signInAdmin(email, password);

      const { admin, accessToken, refreshToken } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        admin,
        accessToken,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("controller:error sign in admin ", error);
      next(error);
    }
  };
}

export default AdminAuthController;
