import { Schema, model } from "mongoose";
import { IMessage } from "src/interfaces/IMessage";

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "senderType",
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
          publicId: String,
          resourceType: String,
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
