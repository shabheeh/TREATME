import { INotificationService } from "src/services/notification/interface/INotificationService";
import { INotificationController } from "./interface/INotificationController";
import { Request, Response, NextFunction } from "express";
import { ITokenPayload } from "../../utils/jwt";
import { AuthError, AuthErrorCode } from "../../utils/errors";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class NotificationController implements INotificationController {
  private notificationService: INotificationService;

  constructor(
    @inject(TYPES.INotificationService)
    notificationService: INotificationService
  ) {
    this.notificationService = notificationService;
  }

  getNotfications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const type =
        req.query.type === "all" ? "" : req.query.type?.toString() || "";
      const limit = Number(req.query.limit) || 15;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      const notifications = await this.notificationService.getNotifications(
        userId,
        type,
        limit
      );
      res.status(HttpStatusCode.OK).json({ notifications });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Failed to get notifications"
      );
      next(error);
    }
  };

  markAllNotificationRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }
      await this.notificationService.markAllAsRead(userId);
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Failed to mark notifications read"
      );
      next(error);
    }
  };

  getUnreadNotificationsCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHORIZED);
      }
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      res.status(HttpStatusCode.OK).json({ unreadCount });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch unread notifications count"
      );
      next(error);
    }
  };
}

export default NotificationController;
