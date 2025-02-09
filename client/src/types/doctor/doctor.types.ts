import dayjs from "dayjs";
import { ISpecialization } from "../specialization/specialization.types";

export interface ISlot {
    _id?: string;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    isBooked: boolean;
}

export interface IDaySchedule {
    date: dayjs.Dayjs;
    slots: ISlot[]
}

export interface ISchedule {
    _id: string;
    doctorId: string;
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