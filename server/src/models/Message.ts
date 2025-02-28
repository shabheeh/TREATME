import { Schema, model } from "mongoose";
import { IMessage } from "src/interfaces/IMessage";

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderType: {
      type: String,
      enum: ["Patient", "Dependent", "Doctor", "Admin"],
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [
        {
          url: String,
          public_id: String,
          resource_type: String,
        },
      ],
      default: [],
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "mixed"],
      default: "text",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
