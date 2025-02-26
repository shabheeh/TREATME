import { Document, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

export interface ISlot extends Document {
  _id: ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface IDaySchedule extends Document {
  date: Date;
  slots: ISlot[];
}

export interface ISchedule extends Document {
  doctorId: ObjectId;
  availability: IDaySchedule[];
}

export interface IScheduleService {
  getSchedule(doctorId: string): Promise<ISchedule | null>;
  updateSchedule(doctorId: string, updateData: ISchedule): Promise<ISchedule>;
}

export interface IScheduleController {
  getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
