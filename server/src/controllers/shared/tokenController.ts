import { Request, Response, NextFunction } from "express";
import { refreshAccessToken } from "../../utils/jwt";
import { AuthError, AuthErrorCode } from "../../utils/errors";
import logger from "../../configs/logger";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

class AuthController {
  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AuthError(AuthErrorCode.TOKEN_EXPIRED);
      }

      const newAccessToken = refreshAccessToken(refreshToken);

      res.status(HttpStatusCode.OK).json({
        accessToken: newAccessToken,
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("error refreshing tokens", error);
      next(error);
    }
  };
}

export default AuthController;
