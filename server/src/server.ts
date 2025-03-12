import http from "http";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configs/db";
import logger from "./configs/logger";
import app from "./app";
import { SocketService } from "./socket/socket";
import ChatService from "./services/chat/ChatService";
import ChatRepository from "./repositories/chat/ChatRepository";
import MessageRepository from "./repositories/chat/MessageRepository";
import { MessageModel } from "./models/Message";
import { ChatModel } from "./models/Chat";
// import { NotificationModel } from "./models/Notification";
// import NotificationService from "./services/notification/NotificationService";
// import NotificationRepository from "./repositories/notification/NotificationRepository";

// create http server
const server = http.createServer(app);

// initialize services
const messageRepository = new MessageRepository(MessageModel);
const chatRepository = new ChatRepository(ChatModel);
const chatService = new ChatService(chatRepository, messageRepository);
export const socketService = new SocketService(chatService);
// const socketService = SocketService.getInstance(chatService);

// const notificationRepository = new NotificationRepository(NotificationModel);
// export const notificationService = new NotificationService(
//   notificationRepository,
//   // socketService
// );

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
