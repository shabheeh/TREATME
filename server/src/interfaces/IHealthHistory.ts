import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";

export interface IMedication {
    name: string;
    frequency: string;
    reportedBy: string;
}

export interface IAllergy {
    allergicTo: string;
    Severity: string;
    reaction: string;
}

export interface ISurgery {
    procedure: string,
    date: Date;
}

export interface IFamilyHistory {
    condition: string;
    relationship: string;
}

// export interface IBodyMeasureMents {
//     height: {
//         feet: number;
//         inches: number;
//     }
//     weight: number;
//     bmi: string
// }

export interface IHealthHistory extends Document {
    patientId: ObjectId;
    patientType: 'Patient' | 'Dependent';
    medications: IMedication[];
    allergies: IAllergy[];
    healthConditions: string[];
    surgeries: ISurgery[];
    familyHistory: IFamilyHistory[];
    // bodyMeasurements: IBodyMeasureMents

}

export interface IHealthHistoryService {
    getHealthHistory(patientId: string): Promise<IHealthHistory | null>
    updateHealthHistory(patientId: string, updateData: Partial<IHealthHistory>): Promise<IHealthHistory>
}

export interface IHealthHistoryController {
    getHealthHistory(req: Request, res: Response, next: NextFunction): Promise<void>
    updateHealthHistory(req: Request, res: Response, next: NextFunction): Promise<void>
}