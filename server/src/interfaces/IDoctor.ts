import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";


export interface Slot {
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
}

export interface DaySchedule {
    date: Date;
    slots: Slot[]
}

export interface Schedule {
  doctorId: ObjectId;
  availability: DaySchedule[];
}

export default interface IDoctor extends Document {
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
  totalPages: number
}

export interface SignInResult {
  doctor: IDoctor;
  accessToken: string;
  refreshToken: string;
}


export interface IDoctorAuthService {
  signIn(email: string, password: string): Promise<SignInResult>
  checkActiveStatus(email: string): Promise<boolean>
}

export interface IDoctorAuthController {
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>
  signOut(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IScheduleService {
  updateAvailability(doctorId: string, updateData: Availability): Promise<Availability>;
}

export interface IScheduleController {
  updateAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
}