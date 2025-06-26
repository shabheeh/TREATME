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
import { setRefreshTokenCookie } from "../../utils/cookie";

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

      setRefreshTokenCookie(res, refreshToken);

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
