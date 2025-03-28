import { api } from "../../utils/axiosInterceptor";

class AIChatService {
  async askAI(message: string): Promise<string> {
    try {
      const response = await api.post("/ai", { message });
      return response.data.message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`error sending ai chat: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown sending ai chat`, error);
      throw new Error(`Something went error`);
    }
  }
}

const aiChatService = new AIChatService();
export default aiChatService;
