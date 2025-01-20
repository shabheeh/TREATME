import { Document } from "mongoose";
import IDoctor, { IDoctorsFilter, IDoctorsFilterResult } from "./IDoctor";
import { Request, Response, NextFunction } from "express";
import { IUsersFilter, IUsersFilterResult } from "./IUser";
export default interface IAdmin extends Document {
    email: string;
    password: string;
}

export interface SignInAdminResult {
    accessToken: string,
    refreshToken: string
}


// Admin - Auth
export interface IAdminAuthService {
    signInAdmin(email: string, password: string): Promise<SignInAdminResult>
}

export interface IAdminAuthController {
    signInAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
}


// Admin - Doctor
export interface IAdminDoctorService {
    createDoctor(doctor: IDoctor): Promise<Partial<IDoctor>>
    getDoctors(params: IDoctorsFilter): Promise<IDoctorsFilterResult>
}

export interface IAdminDoctorController {
    createDoctor(req: Request, res: Response, next: NextFunction): Promise<void>
    getDoctors(req: Request, res: Response, next: NextFunction): Promise<void>
}


// Admin - Patient
export interface IAdminPatientsService {
    getPatients(params: IUsersFilter): Promise<IUsersFilterResult>
    togglePatientActivityStatus(id: string, isAcitve: boolean): Promise<void>
    
}

export interface IAdminPatientsController {
    getPatients(req: Request, res: Response, next: NextFunction): Promise<void>
    togglePatientActivityStatus(req: Request, res: Response, next: NextFunction): Promise<void>
}

