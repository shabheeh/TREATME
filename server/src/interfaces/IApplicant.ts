import { Document, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import ISpecialization from "./ISpecilazation";


export interface IApplicant extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    registerNo: string;
    specialization: ObjectId | ISpecialization;
    languages: string[];
    experience: number;
    workingTwoHrs: 'Yes' | 'No';
    licensedState: string;
    idProof: string;
    resume: string;
}

export interface IApplicantsFilter {
    page: number;
    limit: number;
    search: string;
}
  
export interface IApplicantsFilterResult {
    applicants: IApplicant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number
}
  
  export interface IApplicantService {
    createApplicant(applicantData: IApplicant, idProofFile: Express.Multer.File, resumeFile: Express.Multer.File): Promise<void>
    getApplicants(params: IApplicantsFilter): Promise<IApplicantsFilterResult>
    getApplicant(id: string): Promise<IApplicant>
    deleteApplicant(id: string): Promise<void>
  }
  
  export interface IApplicantController {
    createApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicants(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
  }


