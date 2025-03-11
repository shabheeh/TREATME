import { INotification } from "../../types/notification/notification.types";
import { api } from "../../utils/axiosInterceptor";

class NotificationService {
  async getNotifications(
    type: string,
    limit: number
  ): Promise<INotification[]> {
    try {
      const response = await api.get(
        `/notifications?type=${type}&limit=${limit}`
      );
      const { notifications } = response.data;
      return notifications;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to notifications: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
