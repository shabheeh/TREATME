import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../configs/logger";
import { HttpStatusCode } from "../constants/httpStatusCodes";

export const errorHandler: ErrorRequestHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error(`${error.message} - ${error.stack}`);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
    return;
  }

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal server error",
  });
  return;
};
