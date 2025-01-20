import { Document } from "mongoose";
import { NextFunction, Request, Response } from 'express';

export default interface ISpecialization extends Document {
    name: string;
    description: string;
    note: string;
    fee: number;
    image: string;
}


export interface ISpecializationService {
    createSpecialization(specialization: ISpecialization): Promise<void>;
    getSpecializations(): Promise<ISpecialization[]>
}

export interface ISpecializationController {
    createSpecialization(req: Request, res: Response, next: NextFunction): Promise<void>
    getSpecializations(req: Request, res: Response, next: NextFunction): Promise<void>

}