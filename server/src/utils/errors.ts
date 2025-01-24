

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INVALID_OTP = 'INVALID_OTP', 
    OTP_EXPIRED = 'OTP_EXPIRED',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    USER_BLOCKED = 'USER_BLOCKED',
    USER_NOT_FOUND = 'USER_NOT_FOUND'
  }
  
  export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public status: string = 'error'
    ) {
      super(message);
      this.statusCode = statusCode;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class BadRequestError extends AppError {
    constructor(message: string) {
      super(message, 400, 'fail');
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message: string) {
      super(message, 409, 'fail');
    }
  }
  
  export class AuthError extends AppError {
    constructor(
      public code: AuthErrorCode,
      message?: string
    ) {
      const defaultMessages = {
        [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
        [AuthErrorCode.INVALID_OTP]: 'Invalid OTP provided',
        [AuthErrorCode.OTP_EXPIRED]: 'OTP has expired. Please request a new one',
        [AuthErrorCode.SESSION_EXPIRED]: 'Session has expired. Please login again',
        [AuthErrorCode.TOKEN_EXPIRED]: 'Token has expired',
        [AuthErrorCode.INVALID_TOKEN]: 'Invalid or malformed token', 
        [AuthErrorCode.USER_BLOCKED]: 'User account has been blocked',
        [AuthErrorCode.USER_NOT_FOUND]: 'User not found'
      };
  
      super(message || defaultMessages[code], 403, 'fail');
      this.code = code;
    }
  }