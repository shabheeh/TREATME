import { Document } from "mongoose";
import IDoctor, { IDoctorsFilter, IDoctorsFilterResult } from "./IDoctor";
import { Request, Response, NextFunction } from "express";
import { IPatientsFilter, IPatientsFilterResult } from "./IPatient";
export default interface IAdmin extends Document {
  email: string;
  password: string;
}

export interface SignInAdminResult {
  admin: IAdmin;
  accessToken: string;
  refreshToken: string;
}

export interface IAdminAuthService {
  signInAdmin(email: string, password: string): Promise<SignInAdminResult>;
}

export interface IAdminAuthController {
  signInAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAdminDoctorService {
  createDoctor(
    doctor: IDoctor,
    imageFile: Express.Multer.File
  ): Promise<Partial<IDoctor>>;
  getDoctors(params: IDoctorsFilter): Promise<IDoctorsFilterResult>;
  updateDoctor(
    doctorId: string,
    updateData: Partial<IDoctor>,
    imageFile: Express.Multer.File | undefined
  ): Promise<IDoctor>;
}

export interface IAdminDoctorController {
  createDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAdminPatientsService {
  getPatients(params: IPatientsFilter): Promise<IPatientsFilterResult>;
  togglePatientActivityStatus(id: string, isAcitve: boolean): Promise<void>;
}

export interface IAdminPatientsController {
  getPatients(req: Request, res: Response, next: NextFunction): Promise<void>;
  togglePatientActivityStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
