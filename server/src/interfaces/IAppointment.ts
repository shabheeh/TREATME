import { Document, ObjectId } from "mongoose";


export interface IAppointment extends Document {
    patientId: ObjectId;
    doctorId: ObjectId;
    specialization: ObjectId;
    date: Date;
    duration: string;
    reason: string;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
}

export default IAppointment