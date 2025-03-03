import express from "express";
import multer from "multer";
import ChatController from "../../controllers/chat/ChatController";
import { authenticate } from "../../middlewares/auth";
import { ChatModel } from "../../models/Chat";
import { MessageModel } from "../../models/Message";
import ChatRepository from "../../repositories/chat/ChatRepository";
import MessageRepository from "../../repositories/chat/MessageRepository";
import ChatService from "../../services/chat/ChatService";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const chatRepository = new ChatRepository(ChatModel);
const messageRepository = new MessageRepository(MessageModel);
const chatService = new ChatService(chatRepository, messageRepository);
const chatController = new ChatController(chatService);

router.use(authenticate);

// chat routes
router.post("/", chatController.accessChat);
router.get("/", chatController.getChats);
router.post("/group", chatController.createGroupChat);
router.put("/group/rename", chatController.renameGroup);
router.put("/group/add", chatController.addToGroup);
router.put("/group/remove", chatController.removeFromGroup);

router.delete('/:chatId', chatController.deleteChat);

// message routes
router.get("/:chatId/messages", chatController.getMessages);
router.post("/messages", chatController.sendMessage);
router.post(
  "/messages/attachments",
  upload.array("attachments", 5),
  chatController.uploadAttachments
);
router.put("/messages", chatController.markAsRead);
router.delete("/:messageId", chatController.deleteMessage)

export default router;
