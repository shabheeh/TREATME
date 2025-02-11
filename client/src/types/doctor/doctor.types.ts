
import { ISpecialization } from "../specialization/specialization.types";

export interface ISlot {
    _id?: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
}

export interface IDaySchedule {
    _id?: string;
    date: Date;
    slots: ISlot[]
}

export interface ISchedule {
    availability: IDaySchedule[]
}



export interface IDoctor {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female';
    specialization: ISpecialization;
    specialties: string[];
    languages: string[];
    registerNo: string;
    experience: number;
    biography: string;
    profilePicture: string;
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


export interface IDoctorWithSchedule extends IDoctor {
    availability: IDaySchedule[]
}

export interface getDoctorWithScheduleQuery {
    specialization: string;
    gender: 'male' | 'female' | 'any' | '';
    language: string,
    page: number;
    selectedDate: Date;
}

export interface getDoctorsWithSchedulesResult {
    doctors: IDoctorWithSchedule[]
    currentPage: number;
    totalPages: number;
}
