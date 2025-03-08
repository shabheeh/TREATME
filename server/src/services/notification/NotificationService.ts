import INotificationRepository from "src/repositories/notification/interface/INotificationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotification } from "src/interfaces/INotification";
import { AppError } from "src/utils/errors";

class NotificationService implements INotificationService {
  private notificationRepo: INotificationRepository;

  constructor(notificationRepo: INotificationRepository) {
    this.notificationRepo = notificationRepo;
  }

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await this.notificationRepo.create(notificationData);
      return notification;
    } catch (error) {
      throw new AppError(
        `Failed to create group chat: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async findNotificationById(
    notificationId: string
  ): Promise<INotification | null> {
    const notification = await this.notificationRepo.findById(notificationId);
    return notification;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    return await this.notificationRepo.markAsRead(notificationId);
  }
}

export default NotificationService;
