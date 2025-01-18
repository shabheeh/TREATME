import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
export interface Address {
  city: string;
  landmark: string;
  pincode: string;
  state: string;
  street: string;
}

export default interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  address?: Address;
  profilePicture?: string;
  isActive: boolean;
  phone: string;
}

export type SignInResult = {  
  message: string, 
  googleUser: boolean } | {
  user: IUser,
  accessToken: string,
  refreshToken: string 
}

export type googleSignInResult = { 
  accessToken: string,
  refreshToken: string, 
  user?: IUser,
  newUser?: Partial<IUser>,
  partialUser: boolean
}


export interface IUserAuthService {
  sendOtp(email: string, password: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  signup(user: IUser): Promise<{ newUser: Partial<IUser>}>
  signin(email: string, password: string): Promise<SignInResult>;
  getUserByEmail(email: string): Promise<IUser>;
  sendOtpForgotPassword(email: string): Promise<IUser>;
  verifyOtpForgotPassword(email: string, otp: string): Promise<boolean>;
  resetPassword(id: string, password: string): Promise<void>;
  googleSignIn(credential: string): Promise<googleSignInResult>;
  completeProfileAndSignUp(userData: IUser): Promise<IUser>;
  resendOtp(email: string): Promise<void>;
  resendOtpForgotPassword(email: string): Promise<void>
}

export interface IUserController {
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  signin(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendOtpForgotPassowrd(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtpForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  completeProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>
  resendOtpForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>
}


export interface IUsersFilter {
  page: number;
  limit: number;
  search: string;
}

export interface IUsersFilterResult {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number
}