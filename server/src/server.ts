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
import AppointmentService from "./services/appointment/AppointmentService";
import AppointmentRepository from "./repositories/appointment/AppointmentRepository";
import { AppointmentModel } from "./models/Appointment";
import ScheduleRepository from "./repositories/doctor/ScheduleRepository";
import { ScheduleModel } from "./models/Schedule";
import ScheduleService from "./services/doctor/scheduleService.ts";
import NotificationRepository from "./repositories/notification/NotificationRepository";
import { NotificationModel } from "./models/Notification";
import NotificationService from "./services/notification/NotificationService";
import WalletRepository from "./repositories/wallet/WalletRepository";
import { TransactionModel, WalletModel } from "./models/Wallet";
import WalletService from "./services/wallet/WalletService";

// create http server
const server = http.createServer(app);

const scheduleRepository = new ScheduleRepository(ScheduleModel);
const scheduleService = new ScheduleService(scheduleRepository);
const notificationRepository = new NotificationRepository(NotificationModel);
const notificationService = new NotificationService(notificationRepository);
const walletRepository = new WalletRepository(WalletModel, TransactionModel);
const walletService = new WalletService(walletRepository);

const appointmentRepository = new AppointmentRepository(AppointmentModel);
const appointmentService = new AppointmentService(
  appointmentRepository,
  scheduleService,
  notificationService,
  walletService
);

// initialize services
const messageRepository = new MessageRepository(MessageModel);
const chatRepository = new ChatRepository(ChatModel);
const chatService = new ChatService(
  chatRepository,
  messageRepository,
  appointmentService
);
export const socketService = new SocketService(chatService);

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
