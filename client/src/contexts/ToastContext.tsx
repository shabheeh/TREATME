import { createContext, useContext } from "react";
import { Notification } from "../types/notification/notification.types";

interface ToasterContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const ToasterContext = createContext<ToasterContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearAll: () => {},
});

export const useToaster = () => useContext(ToasterContext);
