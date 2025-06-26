import { IMessage } from "src/interfaces/IMessage";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

interface IMessageRepository extends IBaseRepository<IMessage> {
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
