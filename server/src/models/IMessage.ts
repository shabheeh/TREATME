import { Schema, model } from "mongoose";

const messageSchema = new Schema(
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

// Create the ChatMessage model
export const MessageModel = model("Message", messageSchema);
