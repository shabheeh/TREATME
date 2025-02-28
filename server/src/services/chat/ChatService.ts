import IChatRepository from "src/repositories/chat/interfaces/IChatRepository";
import { IChatService } from "./interface/IChatService";
import IMessageRepository from "src/repositories/chat/interfaces/IMessageRepository";
import { IChat } from "src/interfaces/IChat";
import { IAttachment, IMessage } from "src/interfaces/IMessage";
import { Types } from "mongoose";

class ChatService implements IChatService {
  private chatRepository: IChatRepository;
  private messageRepository: IMessageRepository;

  constructor(
    chatRepository: IChatRepository,
    messageRepository: IMessageRepository
  ) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return await this.chatRepository.getUserChats(userId);
  }

  async getChatById(chatId: string): Promise<IChat | null> {
    return await this.chatRepository.findById(chatId);
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
    
    // returning messages in ascending order old messages will be first
    return messages.reverse();
  }

  async accessChat(userId1: string, userId2: string): Promise<IChat> {
    let chat = await this.chatRepository.findOneOnOneChat(userId1, userId2);

    if (chat) {
      return chat;
    }
    
    // if no existing chat create new one
    const chatData = {
      participants: [new Types.ObjectId(userId1), new Types.ObjectId(userId2)],
      isGroupChat: false,
      createdBy: new Types.ObjectId(userId1),
    };

    return await this.chatRepository.create(chatData);
  }

  async createGroupChat(
    name: string,
    participants: string[],
    createdById: string
  ): Promise<IChat> {

    // ensuring admin is included
    if (!participants.includes(createdById)) {
      participants.push(createdById);
    }

    return await this.chatRepository.createGroupChat(
      name,
      participants,
      createdById
    );
  }

  async addUserToGroup(chatId: string, userId: string): Promise<IChat | null> {
    return await this.chatRepository.addUserToGroup(chatId, userId);
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
      const hasImage = attachments.some((a) => a.resource_type === "imgage");
      const hasVideo = attachments.some((a) => a.resource_type === "video");

      if (hasImage && !hasVideo) {
        messageType = "image";
      } else if (hasVideo && !hasImage) {
        messageType = "video";
      } else if (hasImage || hasVideo) {
        messageType = "mixed";
      }
    }

    // create message 0bj
    const messageData = {
      sender: new Types.ObjectId(sender),
      senderType,
      chat: new Types.ObjectId(chatId),
      content,
      attachments,
      type: messageType,
      isRead: false,
    };

    // update last message in chat
    const message = await this.messageRepository.create(messageData);

    await this.chatRepository.updateLastMessage(
      chatId,
      message._id!.toString()
    );

    return (await this.messageRepository.findById(
      message._id!.toString()
    )) as IMessage;
  }

  async markChatAsRead(chatId: string, userId: string): Promise<void> {
    await this.messageRepository.markMessagesAsRead(chatId, userId);
  }

  async getUnreadMessageCount(chatId: string, userId: string): Promise<number> {
    return await this.messageRepository.getUnreadCount(chatId, userId);
  }
}

export default ChatService;
