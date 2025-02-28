import { Document, Types } from "mongoose";

interface IChat extends Document {
  participants: Types.ObjectId[];
  isGroupChat: boolean;
  name?: string | null;
  lastMessage?: Types.ObjectId | null;
  createdBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export { IChat };
