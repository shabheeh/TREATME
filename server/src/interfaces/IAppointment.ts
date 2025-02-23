import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";
import IDoctor from "./IDoctor";
import IPatient from "./IPatient";
import IDependent from "./IDependent";

export interface IAppointment extends Document {
  patient: ObjectId;
  patientType: "Patient" | "Dependent";
  doctor: ObjectId;
  specialization: ObjectId;
  date: Date;
  duration: string;
  reason: string;
  status: "pending" | "requested" | "confirmed" | "completed" | "cancelled";
  fee: number;
  slotId: string;
  dayId: string;
  paymentStatus: "pending" | "paid";
}

export default IAppointment;

export interface IAppointmentPopulated extends Document {
  patient: IPatient | IDependent;
  patientType: "Patient" | "Dependent";
  doctor: IDoctor;
  specialization: { name: string };
  date: Date;
  duration: string;
  reason: string;
  status: "pending" | "requested" | "confirmed" | "completed" | "cancelled";
  fee: number;
  slotId: string;
  dayId: string;
  paymentStatus: "failed" | "completed";
}

export interface IAppointmentService {
  createAppointment(
    appointmentData: IAppointment
  ): Promise<IAppointmentPopulated>;
  getAppointmentById(
    appointmentId: string
  ): Promise<Partial<IAppointmentPopulated>>;
  updateAppointment(
    appointmentId: string,
    updateData: Partial<IAppointment>
  ): Promise<Partial<IAppointment>>;
  getAppointmentsByUserId(
    userId: string,
    role: string
  ): Promise<IAppointment[]>;
  getAppointments(): Promise<IAppointment[]>;
  stripePayment(
    appointmentData: IAppointment
  ): Promise<{ clientSecret: string }>;
  handleWebHook(payload: Buffer, sig: string): Promise<void>;
}

export interface IAppointmentController {
  createAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAppointmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAppointmentsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  stripePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
