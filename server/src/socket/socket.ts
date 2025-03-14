import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import logger from "../configs/logger";
import { IChat } from "src/interfaces/IChat";
import { IMessage } from "src/interfaces/IMessage";
import { IChatService } from "src/services/chat/interface/IChatService";
import { ITokenPayload, verifyAccessToken } from "../utils/jwt";
import { INotification } from "src/interfaces/INotification";
import { eventBus } from "../eventBus";

export interface ISocketService {
  initialize(server: HttpServer): void;
  emitNewMessage(chatId: string, message: IMessage): void;
  emitChatUpdated(chatId: string, chat: IChat): void;
  emitUserOnline(userId: string): void;
  emitUserOffline(userId: string): void;
}

export class SocketService implements ISocketService {
  // private static instance: SocketService;
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, string> = new Map();
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;

    eventBus.subscribe(
      "appointment-notification",
      this.handleAppointmentNotification.bind(this)
    );
  }

  initialize(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });

    this.io.use(this.authenticateSocket);
    this.setupSocketEvents();
  }

  private authenticateSocket = async (
    socket: Socket,
    next: (err?: ExtendedError) => void
  ) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        const err = new Error(
          "Authentication failed: No token provided"
        ) as ExtendedError;
        err.data = { status: 401 };
        return next(err);
      }

      const decoded: ITokenPayload = await verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      const err = new Error(
        `Authentication failed: ${error instanceof Error ? error.message : "Invalid token"}`
      ) as ExtendedError;
      err.data = { status: 401 };
      return next(err);
    }
  };

  private setupSocketEvents(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.user.id;

      // store the user's connection
      this.connectedUsers.set(userId, socket.id);
      logger.info(`user connected: ${userId} with socket id: ${socket.id}`);

      // join user to their chat rooms
      this.joinUserChats(userId, socket);

      // handle client events
      socket.on("join-chat", (chatId: string) =>
        this.handleJoinChat(socket, chatId)
      );
      socket.on("leave-chat", (chatId: string) =>
        this.handleLeaveChat(socket, chatId)
      );
      socket.on("send-message", (data: IMessage) =>
        this.handleSendMessage(socket, data)
      );
      socket.on("typing", (data: { chatId: string; isTyping: boolean }) =>
        this.handleTyping(socket, data)
      );
      socket.on("stop-typing", (data: { chatId: string }) =>
        this.handleStopTyping(socket, data)
      );
      socket.on("read-messages", (chatId: string) =>
        this.handleReadMessages(socket, chatId)
      );
      // for message sent with attachments
      socket.on("message-sent", (data: { chat: string; messageId: string }) =>
        this.handleMessageSent(socket, data)
      );

      // Handle disconnection
      socket.on("disconnect", () => this.handleDisconnect(userId));
    });
  }

  private async joinUserChats(userId: string, socket: Socket): Promise<void> {
    try {
      const chats = await this.chatService.getUserChats(userId);
      chats.forEach((chat) => {
        socket.join(chat._id!.toString());
        logger.info(`User ${userId} joined chat room: ${chat._id}`);
      });
      this.emitUserOnline(userId);
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error joining user chats"
      );
    }
  }

  private handleJoinChat(socket: Socket, chatId: string): void {
    socket.join(chatId);
    logger.info(`User ${socket.data.user.id} joined chat room: ${chatId}`);
  }

  private handleLeaveChat(socket: Socket, chatId: string): void {
    socket.leave(chatId);
    logger.info(`User ${socket.data.user.id} left chat room: ${chatId}`);
  }

  private async handleSendMessage(
    socket: Socket,
    data: IMessage
  ): Promise<void> {
    try {
      const { chat, content, attachments = [] } = data;
      const userId = socket.data.user.id;
      const userType = socket.data.user.role;

      let senderType: "Admin" | "Doctor" | "Patient";

      if (userType === "admin") {
        senderType = "Admin";
      } else if (userType === "doctor") {
        senderType = "Doctor";
      } else {
        senderType = "Patient";
      }

      if (!attachments.length) {
        const message = await this.chatService.sendMessage(
          userId,
          senderType,
          chat.toString(),
          content,
          []
        );

        // emit the message to all users in the chat
        this.io?.to(chat.toString()).emit("new-message", message);
      }
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error sending message"
      );
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private async handleMessageSent(
    socket: Socket,
    data: { chat: string; messageId: string }
  ) {
    try {
      const message = await this.chatService.getMessageById(data.messageId);
      if (message) {
        // emit the message to all users in the chat
        this.io?.to(data.chat.toString()).emit("new-message", message);
      }
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Error sending message"
      );
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private handleTyping(
    socket: Socket,
    data: { chatId: string; isTyping: boolean }
  ): void {
    const { chatId, isTyping } = data;
    const userId = socket.data.user.id;

    // emit typing event to all users
    socket.to(chatId).emit("typing", { chatId, userId, isTyping });
  }

  private handleStopTyping(socket: Socket, data: { chatId: string }): void {
    const { chatId } = data;
    const userId = socket.data.user.id;

    // emit typing stopped event to all users
    socket.to(chatId).emit("stop-typing", { chatId, userId });
  }

  private async handleReadMessages(
    socket: Socket,
    chatId: string
  ): Promise<void> {
    try {
      const userId = socket.data.user.id;

      const success = await this.chatService.markChatAsRead(chatId, userId);

      if (success) {
        // broadcast to read message
        this.io?.to(chatId).emit("messages-read", { chatId, userId });
      }
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error marking messages as read"
      );
    }
  }

  private handleDisconnect(userId: string): void {
    // remove the user from connectedUsers Map()
    this.connectedUsers.delete(userId);
    this.emitUserOffline(userId);
    logger.info(`User: ${userId} disconnected`);
  }

  // notification events
  private handleAppointmentNotification({
    userId,
    notification,
  }: {
    userId: string;
    notification: INotification;
  }): void {
    this.emitToUser(userId, "appointment-notification", notification);
  }

  // Emit event to a specific user
  public emitToUser<T>(userId: string, eventName: string, data: T): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit(eventName, data);
    } else {
      logger.error(`User ${userId} is not connected.`);
    }
  }

  // public methods for sending events from outside the socket service
  public emitNewMessage(chatId: string, message: IMessage): void {
    this.io?.to(chatId).emit("new-message", message);
  }

  public emitChatUpdated(chatId: string, chat: IChat): void {
    this.io?.to(chatId).emit("chat-updated", chat);
  }

  public emitUserOnline(userId: string): void {
    const chatIds = this.getUserChatRooms(userId);
    chatIds.forEach((chatId) => {
      this.io?.to(chatId).emit("user-online", { userId });
    });
  }

  public emitUserOffline(userId: string): void {
    const chatIds = this.getUserChatRooms(userId);
    chatIds.forEach((chatId) => {
      this.io?.to(chatId).emit("user-offline", { userId });
    });
  }

  // Helper methods
  private getUserChatRooms(userId: string): string[] {
    if (!this.io) return [];

    const socketId = this.connectedUsers.get(userId);
    if (!socketId) return [];

    const socket = this.io.sockets.sockets.get(socketId);
    if (!socket) return [];

    return Array.from(socket.rooms).filter((room) => room !== socketId);
  }
}
