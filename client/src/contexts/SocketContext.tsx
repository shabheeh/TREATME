import React, { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../hooks/useSocket";
import { useSelector } from "react-redux";
import { RootState } from "../redux/app/store";
import { toast } from "sonner";
import { error } from "loglevel";

export interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

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

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Connection error", error);
    });

    socketInstance.on("error", (error: string) => {
      toast.error(error);
    });

    setSocket(socketInstance);

    // Disconnect when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
