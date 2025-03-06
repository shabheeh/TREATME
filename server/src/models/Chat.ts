import { Schema, model } from "mongoose";
import { IChat } from "src/interfaces/IChat";

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "participants.userType",
        },
        userType: {
          type: String,
          required: true,
          enum: ["Patient", "Doctor", "Admin"],
        },
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
      ref: "Message",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "creatorType",
      default: null,
    },
    creatorType: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);

export const ChatModel = model<IChat>("Chat", chatSchema);
