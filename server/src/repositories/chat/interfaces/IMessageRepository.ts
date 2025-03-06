import { IMessage } from "src/interfaces/IMessage";

interface IMessageRepository {
  create(messageData: Partial<IMessage>): Promise<IMessage>;
  findById(messageId: string): Promise<IMessage | null>;
  findByChatId(
    chatId: string,
    limit: number,
    skip: number
  ): Promise<IMessage[]>;
  markMessagesAsRead(chatId: string, userId: string): Promise<boolean>;
  getUnreadCount(chatId: string, userId: string): Promise<number>;
  deleteMessage(messageId: string): Promise<boolean>;
}

export default IMessageRepository;
