import { Request, Response, NextFunction } from "express";

export interface IChatController {
    accessChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChats(req: Request, res: Response, next: NextFunction): Promise<void>;
    createGroupChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    renameGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    addToGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeFromGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}