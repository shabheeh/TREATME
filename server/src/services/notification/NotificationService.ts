import INotificationRepository from "src/repositories/notification/interface/INotificationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotification } from "../../interfaces/INotification";
import { AppError, handleTryCatchError } from "../../utils/errors";

import logger from "../../configs/logger";
import { eventBus } from "../../utils/eventBus";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class NotificationService implements INotificationService {
  private notificationRepo: INotificationRepository;

  constructor(
    @inject(TYPES.INotificationRepository)
    notificationRepo: INotificationRepository
  ) {
    this.notificationRepo = notificationRepo;
  }

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await this.notificationRepo.create(notificationData);

      eventBus.publish("appointment-notification", {
        userId: notification.user._id.toString(),
        notification,
      });

      return notification;
    } catch (error) {
      logger.error("Failded to create notification", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async findNotificationById(
    notificationId: string
  ): Promise<INotification | null> {
    const notification = await this.notificationRepo.findById(notificationId);
    return notification;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const result = await this.notificationRepo.markAsRead(notificationId);
      if (!result) {
        throw new AppError("Failed to mark notification as read");
      }
      return result;
    } catch (error) {
      logger.error("Failded to mark notification", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const result = await this.notificationRepo.markAllAsRead(userId);
      if (!result) {
        throw new AppError("Failed to mark notification as read");
      }
      return result;
    } catch (error) {
      logger.error("Failded to mark notification", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.getUnreadCount(userId);
  }

  async getNotifications(
    userId: string,
    type: string,
    limit: number
  ): Promise<INotification[]> {
    const notfications = await this.notificationRepo.getNotifications(
      userId,
      type,
      limit
    );
    return notfications;
  }
}

export default NotificationService;
