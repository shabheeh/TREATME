import React, { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../hooks/useSocket";

export interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance: Socket = io(import.meta.env.VITE_SERVER_ORIGIN, {
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketInstance.on("connect", () => {
      console.log("Conntected to socket server");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disonntected from socket server");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Connection error", error);
    });

    setSocket(socketInstance);

    // disocnnect when component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
