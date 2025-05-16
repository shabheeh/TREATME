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
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(@inject(TYPES.IChatService) chatService: IChatService) {
    this.chatService = chatService;
  }

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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
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

      res.status(HttpStatusCode.OK).json({ chat });
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

      res.status(HttpStatusCode.OK).json({ chats });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const groupchat = await this.chatService.createGroupChat(
        name,
        participants,
        userId,
        creatorType
      );
      res.status(HttpStatusCode.OK).json({ groupchat });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const chat = await this.chatService.getChatById(chatId);

      if (!chat) {
        throw new AppError(ResponseMessage.ERROR.RESOURCE_NOT_FOUND);
      }

      if (
        chat.isGroupChat &&
        chat.createdBy?.toString() === userId.toString()
      ) {
        throw new AuthError(
          AuthErrorCode.UNAUTHORIZED,
          "Only group admin can edit details",
          HttpStatusCode.FORBIDDEN
        );
      }

      const updatedChat = await this.chatService.renameGroup(chatId, name);
      res.status(HttpStatusCode.OK).json({ updatedChat });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const updatedChat = await this.chatService.addUserToGroup(
        chatId,
        userId,
        userType
      );
      res.status(HttpStatusCode.OK).json({ updatedChat });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const updatedChat = await this.chatService.removeUserFromGroup(
        chatId,
        userId
      );
      res.status(HttpStatusCode.OK).json({ updatedChat });
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
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const messages = await this.chatService.getChatMessages(
        chatId,
        limit,
        skip
      );
      await this.chatService.markChatAsRead(chatId, userId);

      res.status(HttpStatusCode.OK).json({ messages });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      let senderType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        senderType = "Admin";
      } else if (userType === "doctor") {
        senderType = "Doctor";
      } else {
        senderType = "Patient";
      }

      if (senderType === "Patient") {
        const result = await this.chatService.validateMessagingRestriction(
          chat,
          userId
        );
        if (!result.success) {
          throw new AppError(result.message, HttpStatusCode.BAD_REQUEST);
        }
      }

      const message = await this.chatService.sendMessage(
        userId,
        senderType,
        chat,
        content,
        []
      );

      res.status(HttpStatusCode.OK).json({ message });
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
      if (
        !req.files ||
        !Array.isArray(req.files) ||
        (req.files as Express.Multer.File[]).length === 0
      ) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const userId = (req.user as ITokenPayload).id;
      const userType = (req.user as ITokenPayload).role;
      const { chat, content } = req.body;

      if (!userId || !userType) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!chat) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      let senderType: "Admin" | "Patient" | "Doctor";

      if (userType === "admin") {
        senderType = "Admin";
      } else if (userType === "doctor") {
        senderType = "Doctor";
      } else {
        senderType = "Patient";
      }

      if (senderType === "Patient") {
        const result = await this.chatService.validateMessagingRestriction(
          chat,
          userId
        );
        if (!result.success) {
          throw new AppError(result.message, HttpStatusCode.BAD_REQUEST);
        }
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

      res.status(HttpStatusCode.OK).json({ message });
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
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }
      const count = await this.chatService.getUnreadMessageCount(
        chatId,
        userId
      );
      console.log(count, "count");
      res.status(HttpStatusCode.OK).json({ count });
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
      res.status(HttpStatusCode.OK);
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

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Chat deleted successfully" });
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

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Message deleted successfully" });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error deleting message"
      );
      next(error);
    }
  };
}

export default ChatController;
