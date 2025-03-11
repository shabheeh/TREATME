export type NotificationType = "message" | "appointment" | "general";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface INotification {
  _id: string;
  userId: string;
  userType: "Admin" | "Doctor" | "Patient";
  title: string;
  message: string;
  type: NotificationType;
  priority: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: Date;
}
