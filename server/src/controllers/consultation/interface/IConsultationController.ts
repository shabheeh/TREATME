import { Request, Response, NextFunction } from "express";

export interface IConsultationController {
  getConsultationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateConsultation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getConsultationByAppointmentId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
