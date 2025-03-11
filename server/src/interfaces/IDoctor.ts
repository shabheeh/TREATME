import { Request, Response, NextFunction } from "express";
import { Document, ObjectId, Types } from "mongoose";
import {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
} from "src/repositories/doctor/interfaces/IDoctorRepository";

export default interface IDoctor extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female";
  specialization: ObjectId;
  specialties: string[];
  languages: string[];
  registerNo: string;
  experience: number;
  biography: string;
  licensedState: string;
  profilePicture: string;
  imagePublicId: string;
  isActive: boolean;
}

export interface IDoctorsFilter {
  specialization?: string | Types.ObjectId;
  gender?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface IDoctorsFilterResult {
  doctors: IDoctor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SignInResult {
  doctor: IDoctor;
  accessToken: string;
  refreshToken: string;
}

export interface IDoctorAuthService {
  signIn(email: string, password: string): Promise<SignInResult>;
  checkActiveStatus(email: string): Promise<boolean>;
}

export interface IDoctorAuthController {
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  signOut(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IDoctorService {
  getDoctor(doctorId: string): Promise<IDoctor>;
  getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult>;
  getDoctors(query: IDoctorsFilter): Promise<IDoctorsFilterResult>;
}

export interface IDoctorController {
  getDoctorsWithSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
}
