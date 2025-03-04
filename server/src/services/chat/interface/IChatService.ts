import { IChat } from "src/interfaces/IChat";
import { IAttachment, IMessage } from "src/interfaces/IMessage";

export interface IChatService {
  getUserChats(userId: string): Promise<IChat[]>;
  getChatById(chatId: string): Promise<IChat | null>;
  getChatMessages(chatId: string, limit: number, skip: number): Promise<IMessage[]>;
  accessChat(userId1: string, userId2: string, creatorType: "Patient" | "Doctor" | "Admin", userType2: "Patient" | "Doctor" | "Admin"): Promise<IChat>;
  createGroupChat(
    name: string,
    participants: { userId: string; userType: string }[],
    createdById: string,
    creatorType: "Patient" | "Doctor" | "Admin",
  ): Promise<IChat>;
  addUserToGroup(chatId: string, userId: string, userType: "Patient" | "Doctor" | "Admin"): Promise<IChat | null>;
  removeUserFromGroup(chatId: string, userId: string): Promise<IChat | null>;
  renameGroup(chatId: string, newName: string): Promise<IChat | null>;
  sendMessage(
    sender: string,
    senderType: "Patient" | "Dependent" | "Doctor" | "Admin",
    chatId: string,
    content: string,
    attachments: IAttachment[]
  ): Promise<IMessage>;
  markChatAsRead(chatId: string, userId: string): Promise<boolean>;
  getUnreadMessageCount(chatId: string, userId: string): Promise<number>;
  deleteChat(chatId: string, userId: string): Promise<boolean>;
  deleteMessage(messageId: string, userId: string): Promise<boolean>;
}
