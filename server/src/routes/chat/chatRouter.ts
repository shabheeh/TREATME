import express from "express";
import multer from "multer";
import ChatController from "../../controllers/chat/ChatController";
import { authenticate } from "../../middlewares/auth";
import { ChatModel } from "../../models/Chat";
import { MessageModel } from "../../models/Message";
import ChatRepository from "../../repositories/chat/ChatRepository";
import MessageRepository from "../../repositories/chat/MessageRepository";
import ChatService from "../../services/chat/ChatService";
import AppointmentRepository from "../../repositories/appointment/AppointmentRepository";
import { AppointmentModel } from "../../models/Appointment";
import AppointmentService from "../../services/appointment/appointmentService";
import ScheduleRepository from "../../repositories/doctor/ScheduleRepository";
import { ScheduleModel } from "../../models/Schedule";
import ScheduleService from "../../services/doctor/scheduleService.ts";
import NotificationRepository from "../../repositories/notification/NotificationRepository";
import { NotificationModel } from "../../models/Notification";
import NotificationService from "../../services/notification/NotificationService";
import WalletRepository from "../../repositories/wallet/WalletRepository";
import { WalletModel } from "../../models/Wallet";
import WalletService from "../../services/wallet/WalletService";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const scheduleRepository = new ScheduleRepository(ScheduleModel);
const scheduleService = new ScheduleService(scheduleRepository);
const notificationRepository = new NotificationRepository(NotificationModel);
const notificationService = new NotificationService(notificationRepository);
const walletRepository = new WalletRepository(WalletModel);
const walletService = new WalletService(walletRepository);

const appointmentRepository = new AppointmentRepository(AppointmentModel);
const appointmentService = new AppointmentService(
  appointmentRepository,
  scheduleService,
  notificationService,
  walletService
);

const chatRepository = new ChatRepository(ChatModel);
const messageRepository = new MessageRepository(MessageModel);
const chatService = new ChatService(
  chatRepository,
  messageRepository,
  appointmentService
);
const chatController = new ChatController(chatService);

router.use(authenticate);

// chat routes
router.post("/", chatController.accessChat);
router.get("/", chatController.getChats);
router.post("/group", chatController.createGroupChat);
router.put("/group/rename", chatController.renameGroup);
router.put("/group/add", chatController.addToGroup);
router.put("/group/remove", chatController.removeFromGroup);

router.delete("/:chatId", chatController.deleteChat);

// message routes
router.get("/:chatId/messages", chatController.getMessages);
router.post("/messages", chatController.sendMessage);
router.post(
  "/messages/attachments",
  upload.array("attachments", 5),
  chatController.uploadAttachments
);
router.get("/:chatId/messages/count", chatController.getUnreadMessagesCount);
router.put("/messages", chatController.markAsRead);
router.delete("/:messageId", chatController.deleteMessage);

export default router;
