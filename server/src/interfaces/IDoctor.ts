import { Request, Response, NextFunction } from 'express';
import { Document, ObjectId } from 'mongoose';
import {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
} from 'src/repositories/doctor/interfaces/IDoctorRepository';

export interface ISlot extends Document {
  _id: ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface IDaySchedule extends Document {
  date: Date;
  slots: ISlot[];
}

export interface ISchedule extends Document {
  doctorId: ObjectId;
  availability: IDaySchedule[];
}

export default interface IDoctor extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: 'male' | 'female';
  specialization: ObjectId;
  specialties: string[];
  languages: string[];
  registerNo: string;
  experience: number;
  biography: string;
  profilePicture: string;
  imagePublicId: string;
  isActive: boolean;
}

export interface IDoctorsFilter {
  page: number;
  limit: number;
  search: string;
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

export interface IScheduleService {
  getSchedule(doctorId: string): Promise<ISchedule | null>;
  updateSchedule(doctorId: string, updateData: ISchedule): Promise<ISchedule>;
}

export interface IScheduleController {
  getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface IDoctorService {
  getDoctor(id: string): Promise<IDoctor>;
  getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult>;
}

export interface IDoctorController {
  getDoctorsWithSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
}
