import IChatRepository from "src/repositories/chat/interfaces/IChatRepository";
import { IChatService } from "./interface/IChatService";
import IMessageRepository from "src/repositories/chat/interfaces/IMessageRepository";
import { IChat } from "src/interfaces/IChat";
import { IAttachment, IMessage } from "src/interfaces/IMessage";
import { Types } from "mongoose";
import { deleteCloudinaryFile } from "../../utils/cloudinary";
import {
  AppError,
  AuthError,
  AuthErrorCode,
  handleTryCatchError,
} from "../../utils/errors";
import logger from "../../configs/logger";
import { IAppointmentService } from "src/interfaces/IAppointment";
import { getDaysDifference } from "../../helpers/getDaysDifference";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class ChatService implements IChatService {
  private chatRepository: IChatRepository;
  private messageRepository: IMessageRepository;
  private appointmentService: IAppointmentService;

  constructor(
    @inject(TYPES.IChatRepository) chatRepository: IChatRepository,
    @inject(TYPES.IMessageRepository) messageRepository: IMessageRepository,
    @inject(TYPES.IAppointmentService) appointmentService: IAppointmentService
  ) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
    this.appointmentService = appointmentService;
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return await this.chatRepository.getUserChats(userId);
  }

  async getChatById(chatId: string): Promise<IChat | null> {
    return await this.chatRepository.findById(chatId);
  }

  async getMessageById(messageId: string): Promise<IMessage | null> {
    return await this.messageRepository.findById(messageId);
  }

  async getChatMessages(
    chatId: string,
    limit = 50,
    skip = 0
  ): Promise<IMessage[]> {
    const messages = await this.messageRepository.findByChatId(
      chatId,
      limit,
      skip
    );

    return messages.reverse();
  }

  async accessChat(
    userId1: string,
    userId2: string,
    creatorType: "Patient" | "Doctor" | "Admin",
    userType2: "Patient" | "Doctor" | "Admin"
  ): Promise<IChat> {
    const chat = await this.chatRepository.findOneOnOneChat(userId1, userId2);

    if (chat) {
      return chat;
    }

    const chatData = {
      participants: [
        {
          user: new Types.ObjectId(userId1),
          userType: creatorType,
        },
        {
          user: new Types.ObjectId(userId2),
          userType: userType2,
        },
      ],
      isGroupChat: false,
      createdBy: new Types.ObjectId(userId1),
      creatorType,
    };

    const newChat = await this.chatRepository.create(chatData);
    const populatedChat = await this.chatRepository.findById(
      newChat._id!.toString()
    );
    if (!populatedChat) {
      throw new AppError("Failed to Start new chat");
    }
    return populatedChat;
  }

  async createGroupChat(
    name: string,
    participants: { userId: string; userType: string }[],
    createdById: string,
    creatorType: "Patient" | "Doctor" | "Admin"
  ): Promise<IChat> {
    try {
      const isAdminIncluded = participants.some(
        (participant) => participant.userId === createdById
      );

      if (!isAdminIncluded) {
        participants.push({ userId: createdById, userType: "Admin" });
      }

      return await this.chatRepository.createGroupChat(
        name,
        participants,
        createdById,
        creatorType
      );
    } catch (error) {
      handleTryCatchError("Service", error);
    }
  }

  async addUserToGroup(
    chatId: string,
    userId: string,
    userType: "Patient" | "Doctor" | "Admin"
  ): Promise<IChat | null> {
    return await this.chatRepository.addUserToGroup(chatId, userId, userType);
  }

  async removeUserFromGroup(
    chatId: string,
    userId: string
  ): Promise<IChat | null> {
    return await this.chatRepository.removeUserFromGroup(chatId, userId);
  }

  async renameGroup(chatId: string, newName: string): Promise<IChat | null> {
    return await this.chatRepository.renameGroup(chatId, newName);
  }

  async sendMessage(
    sender: string,
    senderType: "Patient" | "Dependent" | "Doctor" | "Admin",
    chatId: string,
    content: string,
    attachments: IAttachment[]
  ): Promise<IMessage> {
    let messageType: "text" | "image" | "video" | "mixed" = "text";

    if (attachments.length > 0) {
      const hasImage = attachments.some((a) => a.resourceType === "imgage");
      const hasVideo = attachments.some((a) => a.resourceType === "video");

      if (hasImage && !hasVideo) {
        messageType = "image";
      } else if (hasVideo && !hasImage) {
        messageType = "video";
      } else if (hasImage || hasVideo) {
        messageType = "mixed";
      }
    }

    const messageData = {
      sender: new Types.ObjectId(sender),
      senderType,
      chat: new Types.ObjectId(chatId),
      content,
      attachments,
      type: messageType,
      isRead: false,
    };

    const newMessage = await this.messageRepository.create(messageData);

    await this.chatRepository.updateLastMessage(
      chatId,
      newMessage._id!.toString()
    );

    const message = await this.messageRepository.findById(
      newMessage._id!.toString()
    );
    return message as IMessage;
  }

  async markChatAsRead(chatId: string, userId: string): Promise<boolean> {
    return await this.messageRepository.markMessagesAsRead(chatId, userId);
  }

  async getUnreadMessageCount(chatId: string, userId: string): Promise<number> {
    return await this.messageRepository.getUnreadCount(chatId, userId);
  }

  async deleteChat(chatId: string, userId: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.findById(chatId);

      if (!chat) {
        throw new AppError("Chat not found", HttpStatusCode.NOT_FOUND);
      }

      if (chat.createdBy?.toString() !== userId) {
        throw new AuthError(
          AuthErrorCode.UNAUTHORIZED,
          "Only the creator can delete tha chat",
          HttpStatusCode.FORBIDDEN
        );
      }

      const success = await this.chatRepository.deleteChat(chatId);
      if (!success) {
        throw new AppError("Failed to delete chat", HttpStatusCode.BAD_REQUEST);
      }
      return success;
    } catch (error) {
      logger.error("Error deleting chat", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = await this.messageRepository.findById(messageId);

      if (!message) {
        throw new AppError("Message not found");
      }

      if (message.sender.toString() !== userId) {
        throw new AuthError(
          AuthErrorCode.UNAUTHORIZED,
          "You can only delete your own messages",
          HttpStatusCode.FORBIDDEN
        );
      }

      if (message.attachments && message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          const publicId = attachment.publicId;

          if (publicId) {
            await deleteCloudinaryFile(publicId);
          }
        }
      }

      const success = await this.messageRepository.deleteMessage(messageId);

      if (!success) {
        throw new AppError(
          "Failed to delete message",
          HttpStatusCode.BAD_REQUEST
        );
      }

      return success;
    } catch (error) {
      logger.error("Error deleting message", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async validateMessagingRestriction(
    chatId: string,
    sender: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const chat = await this.chatRepository.findById(chatId);
      let receiver;
      if (chat?.participants.length === 2) {
        receiver = chat.participants.find(
          (participant) => participant.userType === "Doctor"
        );
      }
      if (!receiver) {
        return {
          success: false,
          message: "receiver not found",
        };
      }

      const receiverId = receiver.user._id.toString();
      const appointment =
        await this.appointmentService.getAppointmentByPatientIdAndDoctorId(
          sender,
          receiverId
        );
      if (!appointment) {
        return {
          success: false,
          message:
            "You need to make appointment with this doctor to send message",
        };
      }

      const daysAfterLastAppointment = getDaysDifference(
        appointment.date.toString()
      );

      if (daysAfterLastAppointment > 7) {
        return {
          success: false,
          message:
            "You need to make appointment with this doctor to send more messages",
        };
      }

      return {
        success: true,
        message: "eligible for sending messages",
      };
    } catch (error) {
      logger.error("Error validating message sending restriction", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default ChatService;
