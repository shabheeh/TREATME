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
    specializaton: ObjectId;
    specialties: string[];
    license: string;
    experience: number;
    biography: string;
    availability: Availability[];
}