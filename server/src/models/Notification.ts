import { Model, model, Schema } from "mongoose";
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
    link: {
      type: String,
      optional: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30,
    },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotification> = model<INotification>(
  "Notification",
  notificationSchema
);
