import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";


export interface ILifestyle extends Document {
    patientId: ObjectId;
    patientType: 'Patient' | 'Dependent';
    sleepSevenPlusHrs: boolean;
    doExercise: boolean;
    doDrugs: boolean;
    doSmoke: boolean;
    doAlcohol: boolean;
    followDietPlan: boolean;
    highStress: boolean;
    vaccinatedCovid19: boolean
    doMeditate: boolean;
}


export interface ILifestyleService {
    findLifestyle(patientId: string): Promise<ILifestyle | null>;
    updateLifestyle(patientId: string, updateData: Partial<ILifestyle>): Promise<ILifestyle>;
}

export interface ILifestyleController {
    getLifestyle(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateLifestyle(req: Request, res: Response, next: NextFunction): Promise<void>;
}