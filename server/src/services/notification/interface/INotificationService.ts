import { INotification } from "src/interfaces/INotification";

export interface INotificationService {
  createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification>;
  findNotificationById(notificationId: string): Promise<INotification | null>;
  markAsRead(notificationId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
  getNotifications(
    userId: string,
    type: string,
    limit: number
  ): Promise<INotification[]>;
}
