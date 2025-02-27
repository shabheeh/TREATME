import { Document, Types } from "mongoose";

interface IAttachment {
  url?: string;
}

interface IChat extends Document {
  sender: Types.ObjectId;
  senderType: "Patient" | "Dependent" | "Doctor" | "Admin";
  content?: string;
  attachments: IAttachment[];
  type: "text" | "image" | "video" | "mixed";
  chat: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { IChat, IAttachment };
