import { IChatService } from "src/services/chat/interface/IChatService";
import { IChatController } from "./interface/IChatController";
import { Request, Response, NextFunction } from "express";
import {
  AppError,
  AuthError,
  AuthErrorCode,
  BadRequestError,
} from "../../utils/errors";
import logger from "../../configs/logger";
import { IAttachment } from "src/interfaces/IMessage";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { ITokenPayload } from "../../utils/jwt";

class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  // create or get new one-on-one chat
  accessChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId1 = (req.user as ITokenPayload).id;
      const userType = (req.user as ITokenPayload).role;
      const { userId2, userType2 } = req.body;

      if (!userId1 || !userType) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!userId2 || !userType2) {
        throw new BadRequestError("Missing required fields");
      }

      let creatorType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        creatorType = "Admin";
      } else if (userType === "doctor") {
        creatorType = "Doctor";
      } else {
        creatorType = "Patient";
      }

      const chat = await this.chatService.accessChat(
        userId1,
        userId2,
        creatorType,
        userType2
      );

      res.status(200).json({ chat });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error accessing chat"
      );
      next(error);
    }
  };

  getChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }
      const chats = await this.chatService.getUserChats(userId);

      res.status(200).json({ chats });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error fetching user chats"
      );
      next(error);
    }
  };

  createGroupChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, participants } = req.body;
      const userId = (req.user as ITokenPayload).id;
      const userType = (req.user as ITokenPayload).role;

      if (!userId || !userType) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      let creatorType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        creatorType = "Admin";
      } else if (userType === "doctor") {
        creatorType = "Doctor";
      } else {
        creatorType = "Patient";
      }

      if (
        !name ||
        !participants ||
        !Array.isArray(participants) ||
        participants.length < 1
      ) {
        throw new BadRequestError("Please Provide all required fields");
      }
      const groupchat = await this.chatService.createGroupChat(
        name,
        participants,
        userId,
        creatorType
      );
      res.status(200).json({ groupchat });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Failed to create group chat"
      );
      next(error);
    }
  };

  renameGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { chatId, name } = req.body;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chatId || !name) {
        throw new BadRequestError("Missing fileds");
      }

      const chat = await this.chatService.getChatById(chatId);

      if (!chat) {
        throw new AppError("Chat not found");
      }

      if (
        chat.isGroupChat &&
        chat.createdBy?.toString() === userId.toString()
      ) {
        throw new AuthError(
          AuthErrorCode.UNAUTHORIZED,
          "Only group admin can edit details",
          403
        );
      }

      const updatedChat = await this.chatService.renameGroup(chatId, name);
      res.status(200).json({ updatedChat });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error renaming group"
      );
      next(error);
    }
  };

  addToGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chatId, userId, userType } = req.body;

      if (!chatId || !userId || !userType) {
        throw new BadRequestError("Missing required fields");
      }
      const updatedChat = await this.chatService.addUserToGroup(
        chatId,
        userId,
        userType
      );
      res.status(200).json({ updatedChat });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error adding new user to group"
      );
      next(error);
    }
  };

  removeFromGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chatId, userId } = req.body;

      if (!chatId || !userId) {
        throw new BadRequestError("MIssing required fields");
      }

      const updatedChat = await this.chatService.removeUserFromGroup(
        chatId,
        userId
      );
      res.status(200).json({ updatedChat });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error removing user from group"
      );
      next(error);
    }
  };

  getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { chatId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }
      if (!chatId) {
        throw new BadRequestError("Missing chat id");
      }

      const messages = await this.chatService.getChatMessages(
        chatId,
        limit,
        skip
      );
      await this.chatService.markChatAsRead(chatId, userId);

      res.status(200).json({ messages });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error fetching all messages"
      );
      next(error);
    }
  };

  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const userType = (req.user as ITokenPayload).role;
      const { chat, content } = req.body;

      if (!userId || !userType) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chat || !content) {
        throw new BadRequestError("Missing required fields");
      }

      let senderType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        senderType = "Admin";
      } else if (userType === "doctor") {
        senderType = "Doctor";
      } else {
        senderType = "Patient";
      }

      const message = await this.chatService.sendMessage(
        userId,
        senderType,
        chat,
        content,
        []
      );

      res.status(200).json({ message });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error sending message"
      );
      next(error);
    }
  };

  uploadAttachments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.files, "files");
      if (
        !req.files ||
        !Array.isArray(req.files) ||
        (req.files as Express.Multer.File[]).length === 0
      ) {
        throw new BadRequestError("No files uploaded");
      }

      const userId = (req.user as ITokenPayload).id;
      const userType = (req.user as ITokenPayload).role;
      const { chat, content } = req.body;

      if (!userId || !userType) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chat) {
        throw new BadRequestError("Missing required fields");
      }

      let senderType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        senderType = "Admin";
      } else if (userType === "doctor") {
        senderType = "Doctor";
      } else {
        senderType = "Patient";
      }

      const attachments: IAttachment[] = [];

      for (const file of req.files as Express.Multer.File[]) {
        const attachment = await uploadToCloudinary(file, "Chats/attachments");
        attachments.push(attachment);
      }

      const message = await this.chatService.sendMessage(
        userId,
        senderType,
        chat,
        content || "",
        attachments
      );

      res.status(200).json({ message });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error sending message with attachments"
      );
      next(error);
    }
  };

  getUnreadMessagesCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { chatId } = req.params;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chatId) {
        throw new BadRequestError("Missing chat id");
      }
      const count = await this.chatService.getUnreadMessageCount(
        chatId,
        userId
      );
      res.status(200).json({ count });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error getting unread messages count"
      );
      next(error);
    }
  };

  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { chatId } = req.body;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chatId) {
        throw new BadRequestError("Missing chat information: id");
      }

      await this.chatService.markChatAsRead(chatId, userId);
      res.status(200);
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error marking messages as read"
      );
      next(error);
    }
  };

  deleteChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { chatId } = req.params;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chatId) {
        throw new BadRequestError("Missing Chat id");
      }

      await this.chatService.deleteChat(chatId, userId);

      res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error deleting chat"
      );
      next(error);
    }
  };

  deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { messageId } = req.params;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!messageId) {
        throw new BadRequestError("Missing Chat id");
      }

      await this.chatService.deleteMessage(messageId, userId);

      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error deleting message"
      );
      next(error);
    }
  };
}

export default ChatController;
