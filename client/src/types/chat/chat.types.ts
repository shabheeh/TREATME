interface IAttachment {
  url: string;
  publicId?: string;
  resourceType?: string;
}

export interface IParticipant {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
  };
  userType: "Patient" | "Doctor" | "Admin";
}

export interface ISender {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface IMessage {
  _id: string;
  sender: ISender;
  senderType: "Patient" | "Doctor" | "Admin";
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
  participants: IParticipant[];
  isGroupChat: boolean;
  name?: string | null;
  lastMessage?: IMessage;
  createdBy?: ISender;
  createdAt: Date;
  updatedAt: Date;
}

export type SendMessageType = {
  // sender: string;
  // senderType: "Admin" | "Patient" | "Doctor";
  chat: string;
  content: string;
  attachments: File[];
};
