import { Document, ObjectId } from "mongoose";


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
    specializaton: string;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number;
    biography: string;
    profilePicture: string;
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


