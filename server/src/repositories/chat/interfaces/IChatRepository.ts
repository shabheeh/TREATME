import { IChat } from "src/interfaces/IChat";

interface IChatRepository {
  create(chatData: Partial<IChat>): Promise<IChat>;
  findById(chatId: string): Promise<IChat | null>;
  findOneOnOneChat(userId1: string, userId2: string): Promise<IChat | null>;
  getUserChats(userId: string): Promise<IChat[]>;
  updateLastMessage(chatId: string, messageId: string): Promise<IChat | null>;
  createGroupChat(
    name: string,
    participants: { userId: string; userType: string }[],
    createdBy: string,
    creatorType: string
  ): Promise<IChat>;
  addUserToGroup(chatId: string, userId: string, userType: string): Promise<IChat | null>;
  removeUserFromGroup(chatId: string, userId: string): Promise<IChat | null>;
  renameGroup(chatId: string, newName: string): Promise<IChat | null>;
  deleteChat(chatId: string): Promise<boolean>;
}

export default IChatRepository;
