import express from "express";
import multer from "multer";
import { authenticate } from "../../middlewares/auth";
import { container } from "../../configs/container";
import { IChatController } from "src/controllers/chat/interface/IChatController";
import { TYPES } from "../../types/inversifyjs.types";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const chatController = container.get<IChatController>(TYPES.IChatController);

router.use(authenticate);

router.post("/", chatController.accessChat);
router.get("/", chatController.getChats);
router.post("/group", chatController.createGroupChat);
router.put("/group/rename", chatController.renameGroup);
router.put("/group/add", chatController.addToGroup);
router.put("/group/remove", chatController.removeFromGroup);

router.delete("/:chatId", chatController.deleteChat);

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
