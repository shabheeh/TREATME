import { Request, Response, NextFunction } from "express";
import { Document, Types } from "mongoose";
import IDoctor from "./IDoctor";
import IPatient from "./IPatient";
import IDependent from "./IDependent";
import { IPatientForDoctor } from "src/repositories/appointment/interfaces/IAppointmentRepository";

export interface IAppointment extends Document {
  patient: Types.ObjectId;
  patientType: "Patient" | "Dependent";
  doctor: Types.ObjectId;
  specialization: Types.ObjectId;
  date: Date;
  duration: number;
  reason: string;
  status: "pending" | "requested" | "confirmed" | "completed" | "cancelled";
  fee: number;
  slotId: string;
  dayId: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentIntentId: string;
}

export default IAppointment;

export interface IAppointmentPopulated extends Document {
  patient: IPatient | IDependent;
  patientType: "Patient" | "Dependent";
  doctor: IDoctor;
  specialization: { name: string };
  date: Date;
  duration: number;
  reason: string;
  status: "pending" | "requested" | "confirmed" | "completed" | "cancelled";
  fee: number;
  slotId: string;
  dayId: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentIntentId: string;
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
  ): Promise<IAppointment>;
  cancelAppointment(appointmentId: string): Promise<void>;
  getAppointmentsByUserId(
    userId: string,
    role: string
  ): Promise<IAppointment[]>;
  getAppointments(): Promise<IAppointmentPopulated[]>;
  getAppointmentByPaymentId(
    paymentIntentId: string
  ): Promise<IAppointmentPopulated>;
  getAppointmentByPatientIdAndDoctorId(
    patientId: string,
    doctorId: string
  ): Promise<IAppointment | null>;
  getPatientsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ patients: IPatientForDoctor[]; totalPatients: number }>;
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
  cancelAppointment(
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
  getAppointmentByPaymentId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPatientsForDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}