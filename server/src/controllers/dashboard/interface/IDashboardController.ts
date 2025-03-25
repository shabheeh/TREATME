import { Request, Response, NextFunction } from "express";

interface IDashboardController {
  getDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export default IDashboardController;
