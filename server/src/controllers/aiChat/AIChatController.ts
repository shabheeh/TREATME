import IAIChatService from "src/services/aiChat/interface/IAIChatService";
import IAIChatController from "./interface/IAIChatController";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const aiResponse =
        await this.aiChatService.processChatInteraction(message);
      res.status(HttpStatusCode.OK).json({ message: aiResponse });
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
