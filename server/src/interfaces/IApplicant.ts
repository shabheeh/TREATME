import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";


export interface IApplicant extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    registerNo: string;
    speciality: string;
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
    createApplicant(applicant: IApplicant): Promise<void>
    getApplicants(params: IApplicantsFilter): Promise<IApplicantsFilterResult>
  }
  
  export interface IApplicantController {
    createApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicants(req: Request, res: Response, next: NextFunction): Promise<void>
  }


