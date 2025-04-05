import logger from "../configs/logger";
import { HttpStatusCode } from "../constants/httpStatusCodes";

export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_OTP = "INVALID_OTP",
  OTP_EXPIRED = "OTP_EXPIRED",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  USER_BLOCKED = "USER_BLOCKED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public status: string = "error"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "fail");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "fail");
  }
}

export class AuthError extends AppError {
  constructor(
    public code: AuthErrorCode,
    message?: string,
    public statusCode: number = 401
  ) {
    const defaultMessages = {
      [AuthErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
      [AuthErrorCode.INVALID_OTP]: "Invalid OTP provided",
      [AuthErrorCode.OTP_EXPIRED]: "OTP has expired. Please request a new one",
      [AuthErrorCode.SESSION_EXPIRED]:
        "Session has expired. Please login again",
      [AuthErrorCode.TOKEN_EXPIRED]: "Token has expired",
      [AuthErrorCode.INVALID_TOKEN]: "Invalid or malformed token",
      [AuthErrorCode.USER_BLOCKED]: "User account has been blocked",
      [AuthErrorCode.USER_NOT_FOUND]: "User not found",
      [AuthErrorCode.UNAUTHENTICATED]: "User is not Authenticated",
      [AuthErrorCode.UNAUTHORIZED]: "Not Authorized",
    };

    super(message || defaultMessages[code], statusCode, "fail");
    this.code = code;
  }
}

export function handleTryCatchError(
  context: string,
  error: unknown,
  logError: boolean = false
): never {
  const errorMessage = `${context} error: ${
    error instanceof Error ? error.message : "Unknown error"
  }`;

  if (logError) {
    logger.error(errorMessage, error);
  }

  throw new AppError(errorMessage, HttpStatusCode.INTERNAL_SERVER_ERROR);
}
