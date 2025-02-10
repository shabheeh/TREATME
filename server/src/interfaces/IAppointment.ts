import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";


export interface IAppointment extends Document {
    patientId: ObjectId;
    doctorId: ObjectId;
    specialization: ObjectId;
    date: Date;
    duration: string;
    reason: string;
    status: 'pending' | 'requested' | 'confirmed' | 'completed' | 'cancelled',

}

export default IAppointment


export interface IAppointmentService {
    createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>>
}

export interface IAppointmentController {
    createAppointment(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAppointment(req: Request, res: Response, next: NextFunction): Promise<void>
}