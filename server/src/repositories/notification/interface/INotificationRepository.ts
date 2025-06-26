import { INotification } from "src/interfaces/INotification";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

interface INotificationRepository extends IBaseRepository<INotification> {
  markAsRead(notificationId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
  getNotifications(
    userId: string,
    type: string,
    limit: number
  ): Promise<INotification[]>;
}

export default INotificationRepository;
