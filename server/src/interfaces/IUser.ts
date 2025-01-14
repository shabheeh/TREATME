import { Document } from 'mongoose';
import { Request, Response } from 'express';
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
  completeProfileAndSignUp(userData: IUser): Promise<IUser>
}

export interface IUserController {
  sendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  signup(req: Request, res: Response): Promise<void>;
  signin(req: Request, res: Response): Promise<void>;
  sendOtpForgotPassowrd(req: Request, res: Response): Promise<void>;
  verifyOtpForgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleSignIn(req: Request, res: Response): Promise<void>;
  completeProfile(req: Request, res: Response): Promise<void>;
}
