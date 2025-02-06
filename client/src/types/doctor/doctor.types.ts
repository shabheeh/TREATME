import dayjs from "dayjs";
import { ISpecialization } from "../specialization/specialization.types";

export interface Slot {
    _id?: string;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    isBooked: boolean;
}

export interface Availability {
    date: dayjs.Dayjs;
    slots: Slot[]
}


export interface IDoctor {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female';
    specialization: string;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number;
    biography: string;
    profilePicture: string;
    availability: Availability[];
}

export interface IDoctorSignUp {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female' | "";
    specialization: string;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number | null;
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
    languages: string[]
    idProof: string;
    resume: string;
}