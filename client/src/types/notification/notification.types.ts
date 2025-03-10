export type NotificationType = "message" | "appointment" | "general";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  actions?: NotificationAction[];
  route?: string;
}
