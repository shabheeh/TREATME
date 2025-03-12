import { FilterQuery, Model, Types } from "mongoose";
import INotificationRepository from "./interface/INotificationRepository";
import { INotification } from "../../interfaces/INotification";
import { AppError } from "../../utils/errors";

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

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const result = await this.model
        .updateMany({ user: userId, isRead: false }, { isRead: true })
        .exec();

      return result.modifiedCount > 0;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const unreadCount = await this.model
        .find({ user: new Types.ObjectId(userId), isRead: false })
        .countDocuments();
      return unreadCount;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getNotifications(
    userId: string,
    type: string,
    limit: number
  ): Promise<INotification[]> {
    try {
      const query: FilterQuery<INotification> = {
        user: new Types.ObjectId(userId),
      };

      if (type) {
        query.type = type;
      }

      const notifications = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();

      return notifications;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default NotificationRepository;
