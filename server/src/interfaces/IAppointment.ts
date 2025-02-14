import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";


export interface IAppointment extends Document {
    patient: ObjectId;
    patientType: 'Patient' | 'Dependent';
    doctor: ObjectId;
    specialization: ObjectId;
    date: Date;
    duration: string;
    reason: string;
    status: 'pending' | 'requested' | 'confirmed' | 'completed' | 'cancelled',
    fee: number;
    slotId: ObjectId;
    dayId: ObjectId;
    paymentStatus: 'pending' | 'paid'

}

export default IAppointment


export interface IAppointmentService {
    createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    getAppointmentById(id: string): Promise<Partial<IAppointment>>
    updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    getAppointmentsByUserId(id: string, role: string): Promise<IAppointment[]>
    getAppointments(): Promise<IAppointment[]>
}

export interface IAppointmentController {
    createAppointment(req: Request, res: Response, next: NextFunction): Promise<void>
    getAppointmentById(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAppointment(req: Request, res: Response, next: NextFunction): Promise<void>
    getAppointmentsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
    getAppointments(req: Request, res: Response, next: NextFunction): Promise<void>
}