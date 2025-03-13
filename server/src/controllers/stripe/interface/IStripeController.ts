import { Request, Response, NextFunction } from "express";

export interface IStripeController {
  createPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
}
