import React from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

// for socket available globally
export const SocketContext = React.createContext<SocketContextType | null>(
  null
);

export const useSocket = (): SocketContextType => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside the SocketProvider");
  }
  return context;
};
