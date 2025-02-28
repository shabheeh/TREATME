import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IHealthHistory } from "./IHealthHistory";
import { IBehaviouralHealth } from "./IBehaviouralHealth";
import { ILifestyle } from "./ILifestyle";
export interface Address {
  city: string;
  landmark: string;
  pincode: string;
  state: string;
  street: string;
}

export default interface IPatient extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: Date;
  address?: Address;
  isActive: boolean;
  phone: string;
  profilePicture?: string;
  imagePublicId?: string;
}

export type SignInResult =
  | {
      message: string;
      googleUser: boolean;
    }
  | {
      patient: IPatient;
      accessToken: string;
      refreshToken: string;
    };

export type googleSignInResult = {
  accessToken?: string;
  refreshToken?: string;
  patient?: IPatient;
  newPatient?: Partial<IPatient>;
  partialUser: boolean;
};

export interface IPatientsFilter {
  page: number;
  limit: number;
  search: string;
}

export interface IPatientsFilterResult {
  patients: IPatient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPatientAuthService {
  sendOtp(email: string, password: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  signup(patient: IPatient): Promise<{ newUser: Partial<IPatient> }>;
  signin(email: string, password: string): Promise<SignInResult>;
  getUserByEmail(email: string): Promise<IPatient>;
  sendOtpForgotPassword(email: string): Promise<IPatient>;
  verifyOtpForgotPassword(email: string, otp: string): Promise<boolean>;
  resetPassword(id: string, password: string): Promise<void>;
  googleSignIn(credential: string): Promise<googleSignInResult>;
  completeProfileAndSignUp(
    userData: IPatient
  ): Promise<{ patient: IPatient; accessToken: string; refreshToken: string }>;
  resendOtp(email: string): Promise<void>;
  resendOtpForgotPassword(email: string): Promise<void>;
  checkActiveStatus(email: string): Promise<boolean>;
}

export interface IPatientAuthController {
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  signin(req: Request, res: Response, next: NextFunction): Promise<void>;
  signOut(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendOtpForgotPassowrd(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  verifyOtpForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  completeProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtpForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface IPatientAccountService {
  updateProfile(
    identifier: string,
    patientData: Partial<IPatient>,
    imageFile: Express.Multer.File | undefined
  ): Promise<IPatient | null>;
  getHealthProfile(id: string): Promise<{
    healtHistory: IHealthHistory | null;
    behaviouralHealth: IBehaviouralHealth | null;
    lifestyle: ILifestyle | null;
  }>;
}

export interface IPatientAccountController {
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  getHealthProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
