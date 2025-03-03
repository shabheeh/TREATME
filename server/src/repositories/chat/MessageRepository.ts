import { AppError } from "../../utils/errors";
import IMessageRepository from "./interfaces/IMessageRepository";
import { IMessage } from "src/interfaces/IMessage";
import { Model, Types } from "mongoose";

class MessageRepository implements IMessageRepository {
  private readonly model: Model<IMessage>;

  constructor(model: Model<IMessage>) {
    this.model = model;
  }

  async create(messageData: Partial<IMessage>): Promise<IMessage> {
    try {
      const message = await this.model.create(messageData);
      return message;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findById(messageId: string): Promise<IMessage | null> {
    try {
      const message = await this.model
        .findById(messageId)
        .populate("sender", "_id firstName lastName email profilePicture")
        .populate("chat");

      return message;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findByChatId(
    chatId: string,
    limit: number,
    skip: number
  ): Promise<IMessage[]> {
    try {
      const messages = await this.model
        .find({ chat: new Types.ObjectId(chatId) })
        .populate("sender", "_id firstName lastName profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return messages;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.model.updateMany(
        {
          chat: new Types.ObjectId(chatId),
          sender: { $ne: new Types.ObjectId(userId) },
          isRead: false,
        },
        { isRead: true }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    try {
      const count = await this.model.countDocuments({
        chat: new Types.ObjectId(chatId),
        sender: { $ne: new Types.ObjectId(userId) },
        isRead: false,
      });
      return count;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(messageId).exec();
    return !!result;
  }
}

export default MessageRepository;
