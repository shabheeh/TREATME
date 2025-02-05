import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";



export interface IBehaviouralHealth extends Document {
    patientId: ObjectId;
    patientType: 'Patient' | 'Dependent';
    conditions: string[];
    anxietyLevel: number;
    depressionLevel: number;
    stressLevel: number;
    therapyStatus: string;
    supportSystem: string[];
    copingMechanisms: string[];
    lastEpisodeDate?: Date;
}


export interface IBehaviouralHealthService {
    findBehaviouralHealth(patientId: string): Promise<IBehaviouralHealth | null>;
    updateBehavouralHealth(patientId: string, updateData: Partial<IBehaviouralHealth>): Promise<IBehaviouralHealth>;
}

export interface IBehaviouralHealthController {
    getBehaviuoralHealth(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBehavouralHealth(req: Request, res: Response, next: NextFunction): Promise<void>
}