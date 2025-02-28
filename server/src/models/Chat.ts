import { Schema, model } from "mongoose";
import { IChat } from "src/interfaces/IChat";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const ChatModel = model<IChat>("Chat", chatSchema);
