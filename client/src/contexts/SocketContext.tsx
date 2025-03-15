import React, { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/app/store";
import { toast } from "sonner";
import { INotification } from "../types/notification/notification.types";
import { incrementUnreadCount } from "../redux/features/notification/notificationSlice";
import { useToaster } from "./ToastContext";
import { IMessage } from "../types/chat/chat.types";
import useCurrentUser from "../hooks/useCurrentUser";

export interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch();
  const { showNotification } = useToaster();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!token) return;

    const socketInstance: Socket = io(import.meta.env.VITE_SERVER_ORIGIN, {
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
      auth: {
        token,
      },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setConnected(true);
    });

    socketInstance.on("appointment-notification", handleAppNotifications);
    socketInstance.on("new-message", handleNewMessageNotifications);

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Connection error", error);
    });

    socketInstance.on("message-restriction", (message: string) => {
      console.log("rstricted")
      toast.error(message);
    });

    setSocket(socketInstance);

    // Disconnect when component unmounts
    return () => {
      socketInstance.disconnect();
      socketInstance.off("appointment-notification");
      socketInstance.off("new-message");
    };
  }, [token]);

  const handleAppNotifications = (notification: INotification) => {
    showNotification(notification);

    dispatch(incrementUnreadCount());
  };

  const handleNewMessageNotifications = (message: IMessage) => {
    if (currentUser?._id === message.sender._id) {
      return;
    }

    showNotification({
      _id: message._id,
      title: "New Message",
      message: `Recieved message from ${message.sender.firstName}`,
      isRead: message.isRead,
      priority: "low",
      type: "messages",
      userType: message.senderType,
      createdAt: message.createdAt,
      userId: message.sender._id,
    });
  };

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
