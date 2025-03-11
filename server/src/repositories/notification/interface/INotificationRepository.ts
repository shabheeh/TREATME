import { INotification } from "src/interfaces/INotification";

interface INotificationRepository {
  create(notificationData: Partial<INotification>): Promise<INotification>;
  findById(notificationId: string): Promise<INotification | null>;
  markAsRead(notificationId: string): Promise<boolean>;
  getNotifications(
    userId: string,
    type: string,
    limit: number
  ): Promise<INotification[]>;
}

export default INotificationRepository;
