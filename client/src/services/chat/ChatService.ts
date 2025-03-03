import { IChat, IMessage } from "../../types/chat/chat.types";
import { api } from "../../utils/axiosInterceptor";

class ChatService {
  async createOrAccessChat(userId2: string): Promise<IChat> {
    try {
      const response = await api.post("/chats/", { userId2 });
      const { chat } = response.data;
      return chat;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error creating/accessing chat: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getChats(): Promise<IChat[]> {
    try {
      const response = await api.get("/chats");
      const { chats } = response.data;
      return chats;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching user chats: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
  async deleteChat(chatId: string): Promise<void> {
    try {
      await api.delete(`/chats/${chatId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error deleting chat: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      const { messages } = response.data;
      return messages;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching messages: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const chatService = new ChatService();
export default chatService;
