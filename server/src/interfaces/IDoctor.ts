import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";


interface Slot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface Availability {
    day: string;
    slots: Slot[]
}

export default interface IDoctor extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female';
    // specializaton: ObjectId;
    specialization: string;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number;
    biography: string;
    profilePicture: string;
    imagePublicId: string;
    isActive: boolean;
    availability: Availability[];
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

export interface IDoctorService {
  updateAvailability(id: string, updateData: Partial<IDoctor>): Promise<IDoctor>;
}

export interface IDoctorController {
  updateAvailability(req: Request, res: Response, next: NextFunction): Promise<IDoctor>;
}