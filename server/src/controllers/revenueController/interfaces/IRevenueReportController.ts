import { Request, Response, NextFunction } from "express";

export interface IRevenueReportController {
  getRevenueReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAllDoctorsRevenueSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
