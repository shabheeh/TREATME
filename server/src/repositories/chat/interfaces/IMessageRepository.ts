import { IMessage } from "src/interfaces/IMessage";

interface IMessageRepository {
  create(messageData: Partial<IMessage>): Promise<IMessage>;
  findById(messageId: string): Promise<IMessage | null>;
  findByChatId(chatId: string, limit: number, skip: number): Promise<IMessage[]>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
  getUnreadCount(chatId: string, userId: string): Promise<number>;
}

export default IMessageRepository;
