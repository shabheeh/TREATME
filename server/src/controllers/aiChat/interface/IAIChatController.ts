import { Request, Response, NextFunction } from "express";

interface IAIChatController {
  handleAIChatInteraction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export default IAIChatController;
