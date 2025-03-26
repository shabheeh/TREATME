import { Request, Response, NextFunction } from "express";

interface IDashboardController {
  getAdminDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getDoctorDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export default IDashboardController;
