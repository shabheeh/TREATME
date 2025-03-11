import INotificationRepository from "src/repositories/notification/interface/INotificationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotification } from "../../interfaces/INotification";
import { AppError } from "../../utils/errors";
// import { ISocketService } from "../../socket/socket";
import logger from "../../configs/logger";
// import { socketService } from "src/server";
import { SocketService } from "../../socket/socket";

class NotificationService implements INotificationService {
  private notificationRepo: INotificationRepository;
  // private socketService: ISocketService;

  constructor(
    notificationRepo: INotificationRepository
    // socketService: ISocketService
  ) {
    this.notificationRepo = notificationRepo;
    // this.socketService = socketService;
  }

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await this.notificationRepo.create(notificationData);

      // console.log("SocketService instance:", this.socketService);
      // if (!this.socketService) {
      //   throw new AppError("socketService is not initialized");
      // }
      // this.socketService.emitAppointmentNotification(
      //   notification.user._id.toString(),
      //   notification
      // );
      const socketService = SocketService.getInstance();

      socketService.emitNotification(
        notification.user._id.toString(),
        ""
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
