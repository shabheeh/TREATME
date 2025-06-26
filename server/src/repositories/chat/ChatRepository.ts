import { Model, Types } from "mongoose";
import IChatRepository from "./interfaces/IChatRepository";
import { IChat } from "src/interfaces/IChat";
import { handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import BaseRepository from "../base/BaseRepository";

@injectable()
class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor(@inject(TYPES.ChatModel) model: Model<IChat>) {
    super(model);
  }

  async findById(chatId: string): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findById(chatId)
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate("lastMessage")
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        });

      return chat;
    } catch (error) {
      handleTryCatchError("Database", error);
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
          "participants.user": {
            $all: [new Types.ObjectId(userId1), new Types.ObjectId(userId2)],
          },
          participants: { $size: 2 },
        })
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate("lastMessage")
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        });

      return chat;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    try {
      const chats = await this.model
        .find({
          "participants.user": { $in: [new Types.ObjectId(userId)] },
        })
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "_id firstName lastName email profilePicture",
          },
        })
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        })
        .sort({ updatedAt: -1 });

      return chats;
    } catch (error) {
      handleTryCatchError("Database", error);
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
      handleTryCatchError("Database", error);
    }
  }

  async createGroupChat(
    name: string,
    participants: { userId: string; userType: string }[],
    createdBy: string,
    creatorType: string
  ): Promise<IChat> {
    try {
      const participantsData = participants.map(({ userId, userType }) => ({
        user: new Types.ObjectId(userId),
        userType: userType,
      }));

      const groupChat = new this.model({
        name,
        participants: participantsData,
        isGroupChat: true,
        createdBy: new Types.ObjectId(createdBy),
        creatorType,
      });

      return await groupChat.save();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async addUserToGroup(
    chatId: string,
    userId: string,
    userType: string
  ): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findByIdAndUpdate(
          chatId,
          {
            $addToSet: {
              participants: {
                user: new Types.ObjectId(userId),
                userType: userType,
              },
            },
          },
          { new: true }
        )
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate("lastMessage")
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        });

      return chat;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async removeUserFromGroup(
    chatId: string,
    userId: string
  ): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findByIdAndUpdate(
          chatId,
          {
            $pull: {
              participants: { user: new Types.ObjectId(userId) },
            },
          },
          { new: true }
        )
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate("lastMessage")
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        });

      return chat;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async renameGroup(chatId: string, newName: string): Promise<IChat | null> {
    try {
      const chat = await this.model
        .findByIdAndUpdate(chatId, { name: newName }, { new: true })
        .populate({
          path: "participants.user",
          select: "_id firstName lastName email profilePicture",
        })
        .populate("lastMessage")
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email profilePicture",
        });

      return chat;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(chatId).exec();
      return !!result;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default ChatRepository;
