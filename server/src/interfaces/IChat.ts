import { Document, Types } from "mongoose";

interface IParticipant {
  user: Types.ObjectId;
  userType: "Patient" | "Doctor" | "Admin";
}

interface IChat extends Document {
  participants: IParticipant[];
  isGroupChat: boolean;
  name?: string | null;
  lastMessage?: Types.ObjectId | null;
  createdBy?: Types.ObjectId | null;
  creatorType: "Patient" | "Doctor" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}

export { IChat };
