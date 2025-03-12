import { Request, Response, NextFunction } from "express";

export interface INotificationController {
  markAllNotificationRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUnreadNotificationsCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getNotfications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
