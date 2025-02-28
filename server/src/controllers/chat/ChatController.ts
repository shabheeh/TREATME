import { IChatService } from "src/services/chat/interface/IChatService";
import { IChatController } from "./interface/IChatController";
import { Request, Response, NextFunction } from "express";

class ChatController implements IChatController {
    private chatService : IChatService;

    constructor(chatService: IChatService) {
        this.chatService = chatService
    }

    // create or get new one-on-one chat
    // accessChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const userId = req
    //     } catch (error) {
            
    //     }
    // }
}