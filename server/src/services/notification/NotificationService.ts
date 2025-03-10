import INotificationRepository from "src/repositories/notification/interface/INotificationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotification } from "../../interfaces/INotification";
import { AppError } from "../../utils/errors";
import { ISocketService } from "../../socket/socket";
import logger from "../../configs/logger";

class NotificationService implements INotificationService {
  private notificationRepo: INotificationRepository;
  private socketService: ISocketService;

  constructor(
    notificationRepo: INotificationRepository,
    socketService: ISocketService
  ) {
    this.notificationRepo = notificationRepo;
    this.socketService = socketService;
  }

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await this.notificationRepo.create(notificationData);

      console.log("SocketService instance:", this.socketService);
      if (!this.socketService) {
        throw new AppError("socketService is not initialized");
      }
      this.socketService.emitAppointmentNotification(
        notification.user._id.toString(),
        notification
      );
      return notification;
    } catch (error) {
      logger.error("Failded to create notification", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
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
