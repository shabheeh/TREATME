interface IAttachment {
  url: string;
  publicId?: string;
  resourceType?: string;
}

export interface ISender {
  _id: string;
  fistName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface IMessage {
  _id: string;
  sender: ISender;
  senderType: "Patient" | "Dependent" | "Doctor" | "Admin";
  content: string;
  attachments?: IAttachment[];
  type: "text" | "image" | "video" | "mixed";
  chat: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat {
  _id: string;
  participants: ISender[];
  isGroupChat: boolean;
  name?: string | null;
  lastMessage?: IMessage;
  createdBy?: ISender;
  createdAt: Date;
  updatedAt: Date;
}
