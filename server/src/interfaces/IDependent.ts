import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";

export default interface IDependent extends Document {
    firstName: string;
    lastName: string;
    primaryUserId: ObjectId;
    email: string;
    gender: 'male' | 'female';
    relationship: string;
    dateOfBirth: Date;
    profilePicture?: string;
    imagePublicId?: string;
    
}


export interface IDependentService {
    createDependent(dependent: IDependent, imageFile: Express.Multer.File | undefined): Promise<IDependent>;
    getDependents(primaryUserId: string): Promise<IDependent[] | []>;
    deleteDependent(id: string): Promise<void>;
    updateDependent(id: string, updateData: Partial<IDependent>, imageFile: Express.Multer.File | undefined): Promise<IDependent>
}

export interface IDependentController {
    createDependent(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDependents(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteDependent(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateDependent(req: Request, res: Response, next: NextFunction): Promise<void>
}