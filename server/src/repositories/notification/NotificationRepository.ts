import { FilterQuery, Model, Types } from "mongoose";
import INotificationRepository from "./interface/INotificationRepository";
import { INotification } from "../../interfaces/INotification";
import { handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import BaseRepository from "../base/BaseRepository";

@injectable()
class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor(@inject(TYPES.NotificationModel) model: Model<INotification>) {
    super(model);
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const isUpdated = await this.model
        .findByIdAndUpdate(notificationId, { isRead: true }, { new: true })
        .exec();
      return isUpdated !== null;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const result = await this.model
        .updateMany({ user: userId, isRead: false }, { isRead: true })
        .exec();

      return result.modifiedCount > 0;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const unreadCount = await this.model
        .find({ user: new Types.ObjectId(userId), isRead: false })
        .countDocuments();
      return unreadCount;
    } catch (error) {
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
    }
  }
}

export default NotificationRepository;
