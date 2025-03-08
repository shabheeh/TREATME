import { INotification } from "src/interfaces/INotification";

export interface INotificationService {
  createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification>;
  findNotificationById(notificationId: string): Promise<INotification | null>;
  markAsRead(notificationId: string): Promise<boolean>;
}
