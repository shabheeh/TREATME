
interface Slot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface Availability {
    day: string;
    slots: Slot[]
}


export default interface IDoctor {
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
    availability?: Availability[];
}

export interface IApplicant {
    firstName: string;
    lastName: string;
    email: string;
    registerNo: string;
    phone: string;
    specialty: string;
}