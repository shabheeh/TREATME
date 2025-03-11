import { Request, Response, NextFunction } from "express";

export interface INotificationController {
  getNotfications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
