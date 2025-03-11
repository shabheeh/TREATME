import { model, Schema } from "mongoose";
import { INotification } from "src/interfaces/INotification";

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor", "Admin"],
    },
    type: {
      type: String,
      required: true,
      enum: ["appointments", "messages", "general"],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
