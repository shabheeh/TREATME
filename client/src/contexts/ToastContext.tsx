import { createContext, useContext } from "react";
import { INotification } from "../types/notification/notification.types";

interface ToasterContextType {
  showNotification: (notification: INotification) => void;
}

export const ToasterContext = createContext<ToasterContextType>({
  showNotification: () => {},
});

export const useToaster = () => useContext(ToasterContext);
