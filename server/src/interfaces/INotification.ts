import { Document, Types } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  userType: "Admin" | "Doctor" | "Patient";
  type: "appointments" | "messages" | "general";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  link?: string;
  expiresAt?: Date;
}
