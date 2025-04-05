import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, ITokenPayload } from "../utils/jwt";
import logger from "../configs/logger";
import { HttpStatusCode } from "../constants/httpStatusCodes";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = (await verifyAccessToken(token)) as ITokenPayload;

    req.user = decoded;

    next();
  } catch (error) {
    logger.error("Authentication Error", error);
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Authentication required",
        });
        return;
      }

      if (!roles.includes((req.user as ITokenPayload)?.role)) {
        res.status(HttpStatusCode.FORBIDDEN).json({
          message: `Access Denied`,
        });
        return;
      }

      next();
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          message: "Internal Server Error",
        });
    }
  };
};
