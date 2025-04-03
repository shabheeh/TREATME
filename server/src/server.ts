import http from "http";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configs/db";
import logger from "./configs/logger";
import app from "./app";
import { ISocketService } from "./socket/socket";
import { container } from "./configs/container";
import { TYPES } from "./types/inversifyjs.types";

// create http server
const server = http.createServer(app);

export const socketService = container.get<ISocketService>(
  TYPES.ISocketService
);

socketService.initialize(server);

// conntec mongodv
connectDB();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", error);
});

// Start the server
const PORT: string | undefined = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is not defined in env");
}

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
