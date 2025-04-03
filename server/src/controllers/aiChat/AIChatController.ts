import IAIChatService from "src/services/aiChat/interface/IAIChatService";
import IAIChatController from "./interface/IAIChatController";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class AIChatController implements IAIChatController {
  private aiChatService: IAIChatService;

  constructor(@inject(TYPES.IAIChatService) aiChatService: IAIChatService) {
    this.aiChatService = aiChatService;
  }

  handleAIChatInteraction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { message } = req.body;

      if (!message) {
        throw new BadRequestError("Message is required");
      }
      const aiResponse =
        await this.aiChatService.processChatInteraction(message);
      res.status(200).json({ message: aiResponse });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: error at ai chat bot"
      );
      next(error);
    }
  };
}

export default AIChatController;
