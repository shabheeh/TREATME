import { Document, Types } from "mongoose";
import { Request, Response, NextFunction } from "express";

export interface ISlot {
  _id?: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface IDaySchedule {
  _id?: Types.ObjectId;
  date: Date;
  slots: ISlot[];
}

export interface ISchedule extends Document {
  doctorId: Types.ObjectId;
  availability: IDaySchedule[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddTimeSlotRequest {
  doctorId: string;
  date: string;
  startTime: string;
  timeZone: string;
  durationInMinutes?: number;
}

export interface RemoveTimeSlotRequest {
  doctorId: string;
  date: string;
  slotId: string;
}

export interface BulkUpdateSlotsRequest {
  doctorId: string;
  updates: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isBooked: boolean;
    }>;
  }>;
}

export interface IScheduleService {
  getSchedule(doctorId: string): Promise<ISchedule | null>;
  updateSchedule(doctorId: string, updateData: ISchedule): Promise<ISchedule>;
  addTimeSlot(request: AddTimeSlotRequest): Promise<ISchedule>;
  removeTimeSlot(request: RemoveTimeSlotRequest): Promise<ISchedule>;
  updateBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void>;
  toggleBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void>;
  getAvailableSlots(doctorId: string, date: string): Promise<ISlot[]>;
  bulkUpdateSlots(request: BulkUpdateSlotsRequest): Promise<ISchedule>;
  getScheduleSummary(doctorId: string): Promise<{
    totalDays: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    upcomingDates: string[];
  }>;
  generateSlotsForDateRange(
    doctorId: string,
    startDate: string,
    endDate: string,
    timeSlots: Array<{
      start: string;
      duration: number;
    }>,
    excludeWeekends: boolean
  ): Promise<ISchedule>;
}

export interface IScheduleController {
  getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addTimeSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAvailableSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  bulkUpdateSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getScheduleSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  generateSlotsForDateRange(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
