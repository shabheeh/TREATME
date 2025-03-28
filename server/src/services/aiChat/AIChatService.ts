import IAIChatRepository from "src/repositories/aiChat/interface/IAIChatRepository";
import IAIChatService from "./interface/IAIChatService";

class AIChatService implements IAIChatService {
  private aiChatRepo: IAIChatRepository;

  constructor(aiChatRepo: IAIChatRepository) {
    this.aiChatRepo = aiChatRepo;
  }

  async processChatInteraction(message: string): Promise<string> {
    return this.aiChatRepo.generateAIResponse(message);
  }
}

export default AIChatService;
