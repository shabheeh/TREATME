import { ISpecialization } from "../specialization/specialization.types";

export interface ISlot {
  _id?: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface ISlotInput {
  _id?: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface IDaySchedule {
  _id?: string;
  date: Date;
  slots: ISlot[];
}

export interface IDayScheduleInput {
  _id?: string;
  date: string;
  slots: ISlotInput[];
}

export interface ISchedule {
  availability: IDaySchedule[];
}

export interface IScheduleInput {
  availability: IDayScheduleInput[];
}

export interface IDoctor {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female";
  specialization: ISpecialization;
  specialties: string[];
  languages: string[];
  registerNo: string;
  experience: number;
  licensedState: string;
  biography: string;
  profilePicture: string;
}

export interface IDoctorSignUp {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female" | "";
  specialization: string;
  specialties: string[];
  languages: string[];
  registerNo: string;
  experience: number | null;
  licensedState: string;
  biography: string;
  profilePicture: File | null;
}

export interface IApplicant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  registerNo: string;
  phone: string;
  specialization: ISpecialization;
  experience: number;
  workingTwoHrs: string;
  licensedState: string;
  languages: string[];
  idProof: string;
  resume: string;
}

export interface IDoctorWithSchedule extends IDoctor {
  availability: IDaySchedule[];
}

export interface getDoctorWithScheduleQuery {
  specialization: string;
  gender: "male" | "female" | "any" | "";
  language: string;
  page: number;
  selectedDate: Date | string;
}

export interface getDoctorsWithSchedulesResult {
  doctors: IDoctorWithSchedule[];
  currentPage: number;
  totalPages: number;
}

export interface getDoctorsQuery {
  specialization: string;
  gender: "male" | "female" | "any" | "";
  search: string;
  page: number;
  limit: number;
}

export interface getDoctorsResult {
  doctors: IDoctor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
