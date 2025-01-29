import { Document, ObjectId } from "mongoose"

export interface IMedication {
    name: string;
    dosage: string;
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

export interface IBodyMeasureMents {
    height: {
        feet: number;
        inches: number;
    }
    weight: number;
    bmi: string
}

export interface IHealthHistory extends Document {
    patientId: ObjectId;
    patientType: 'Patient' | 'Dependent';
    medications: IMedication[];
    allergies: IAllergy[];
    healthConditions: string[];
    surgeries: ISurgery[];
    familyHistory: IFamilyHistory[];
    bodyMeasurements: IBodyMeasureMents

}