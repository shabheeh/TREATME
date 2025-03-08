import { Model } from "mongoose";
import INotificationRepository from "./interface/INotificationRepository";
import { INotification } from "src/interfaces/INotification";
import { AppError } from "src/utils/errors";

class NotificationRepository implements INotificationRepository {
  private model: Model<INotification>;

  constructor(model: Model<INotification>) {
    this.model = model;
  }

  async create(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await this.model.create(notificationData);
      return notification;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findById(notificationId: string): Promise<INotification | null> {
    try {
      const notification = await this.model.findById(notificationId);
      return notification;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const isUpdated = await this.model
        .findByIdAndUpdate(notificationId, { isRead: true }, { new: true })
        .exec();
      return isUpdated !== null;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default NotificationRepository;
