import IAIChatRepository from "src/repositories/aiChat/interface/IAIChatRepository";
import IAIChatService from "./interface/IAIChatService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class AIChatService implements IAIChatService {
  private aiChatRepo: IAIChatRepository;

  constructor(@inject(TYPES.IAIChatRepository) aiChatRepo: IAIChatRepository) {
    this.aiChatRepo = aiChatRepo;
  }

  async processChatInteraction(message: string): Promise<string> {
    return this.aiChatRepo.generateAIResponse(message);
  }
}

export default AIChatService;
