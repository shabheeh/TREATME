import { NextFunction, Request, Response } from "express";

export interface IWalletController {
  accessWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
  createWithdrawalRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
