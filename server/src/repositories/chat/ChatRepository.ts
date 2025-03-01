import { Model, Types } from "mongoose";
import IChatRepository from "./interfaces/IChatRepository";
import { IChat } from "src/interfaces/IChat";
import { AppError } from "../../utils/errors";

class ChatRepository implements IChatRepository {
  private readonly model: Model<IChat>;

  constructor(model: Model<IChat>) {
    this.model = model;
  }

  async create(chatData: Partial<IChat>): Promise<IChat> {
    try {
      const chat = await this.model.create(chatData);
      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findById(chatId: string): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findById(chatId)
        .populate("participants", "firstName lastName email profilePicture")
        .populate("lastMessage")
        .populate("createdBy", "firstName lastName email profilePicture");

      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
  async findOneOnOneChat(
    userId1: string,
    userId2: string
  ): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findOne({
          isGroupChat: false,
          participants: {
            $all: [new Types.ObjectId(userId1), new Types.ObjectId(userId2)],
            $size: 2,
          },
        })
        .populate("partipants", "firstName lastName email profilePicture")
        .populate("lastMessage")
        .populate("createdBy", "firstName lastName email profilePicture");

      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    try {
      const chats = await this.model
        .find({
          participants: { $in: [new Types.ObjectId(userId)] },
        })
        .populate("partipants", "firstName lastName email profilePicture")
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "firstName lastName email profilePicture",
          },
        })
        .populate("createdBy", "firstName lastName email profilePicture")
        .sort({ updatedAt: -1 });

      return chats;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateLastMessage(
    chatId: string,
    messageId: string
  ): Promise<IChat | null> {
    try {
      const chat = await this.model.findByIdAndUpdate(
        chatId,
        { lastMessage: new Types.ObjectId(messageId) },
        { new: true }
      );

      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async createGroupChat(
    name: string,
    participants: string[],
    createdBy: string
  ): Promise<IChat> {
    try {
      const participantsIds = participants.map((id) => new Types.ObjectId(id));

      const groupChat = new this.model({
        name,
        participants: participantsIds,
        isGroupChat: true,
        createdBy: new Types.ObjectId(createdBy),
      });

      return await groupChat.save();
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async addUserToGroup(chatId: string, userId: string): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findByIdAndUpdate(
          chatId,
          { $addToSet: { participants: new Types.ObjectId(userId) } },
          { new: true }
        )
        .populate("partipants", "firstName lastName email profilePicture")
        .populate("lastMessage")
        .populate("createdBy", "firstName lastName email profilePicture");

      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async removeUserFromGroup(
    chatId: string,
    userId: string
  ): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findByIdAndUpdate(chatId, {
          $pull: { participants: new Types.ObjectId(userId) },
        })
        .populate("partipants", "firstName lastName email profilePicture")
        .populate("lastMessage")
        .populate("createdBy", "firstName lastName email profilePicture");
      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async renameGroup(chatId: string, newName: string): Promise<IChat | null> {
    try {
      const chat = this.model
        .findByIdAndUpdate(chatId, { name: newName }, { new: true })
        .populate("partipants", "firstName lastName email profilePicture")
        .populate("lastMessage")
        .populate("createdBy", "firstName lastName email profilePicture");

      return chat;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(chatId).exec();
      return !!result;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default ChatRepository;
