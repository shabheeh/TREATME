import { Document } from "mongoose";
import { NextFunction, Request, Response } from "express";

export default interface ISpecialization extends Document {
  name: string;
  description: string;
  note: string;
  fee: number;
  durationInMinutes: number;
  image: string;
  imagePublicId: string;
}

export interface ISpecializationService {
  createSpecialization(
    specialization: ISpecialization,
    imageFile: Express.Multer.File
  ): Promise<void>;
  getSpecializations(): Promise<ISpecialization[]>;
  getSpecializationById(
    specializationId: string
  ): Promise<ISpecialization | null>;
  updateSpecialization(
    specializationId: string,
    updateData: Partial<ISpecialization>,
    imageFile: Express.Multer.File | undefined
  ): Promise<ISpecialization | null>;
}

export interface ISpecializationController {
  createSpecialization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSpecializations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSpecializationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateSpecialization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
