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
    reportedBy: string;
}

export interface ISurgery {
    procedure: string,
    year: string;
    reportedBy: string;
}

export interface IFamilyHistory {
    condition: string;
    relationship: string;
    reportedBy: string;
}

 
export interface IHealthCondition {
    condition: string;
    reportedBy: string
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
    healthConditions: IHealthCondition[];
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