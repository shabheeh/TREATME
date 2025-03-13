import { NextFunction, Request, Response } from "express";

export interface IWalletController {
  accessWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
}
