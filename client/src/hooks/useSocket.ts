import React from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}
// context for socket available globally
export const SocketContext = React.createContext<SocketContextType | null>(
  null
);

export const useSocket = (): SocketContextType => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket not inside the SocketProvider");
  }
  return context;
};
