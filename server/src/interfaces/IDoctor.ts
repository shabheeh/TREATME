import { Document, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

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
    specializaton: ObjectId;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number;
    biography: string;
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


export interface IApplicant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registerNo: string;
  speciality: string;
}

export interface IApplicantService {
  createApplicant(applicant: IApplicant): Promise<void>
}

export interface IApplicantController {
  createApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
}