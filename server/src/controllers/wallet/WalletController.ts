import { IWalletService } from "src/services/wallet/interface/IWalletService";
import { IWalletController } from "./interface/IWalletController";
import { Request, Response, NextFunction } from "express";
import { ITokenPayload } from "../../utils/jwt";
import logger from "../../configs/logger";
import { AuthError, AuthErrorCode, BadRequestError } from "../../utils/errors";
import { TransactionData } from "src/interfaces/IWallet";
import { error } from "console";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class WalletController implements IWalletController {
  private walletService: IWalletService;

  constructor(@inject(TYPES.IWalletService) walletService: IWalletService) {
    this.walletService = walletService;
  }

  accessWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const role = (req.user as ITokenPayload).role;
      let userType: "Patient" | "Doctor";

      if (role === "patient") {
        userType = "Patient";
      } else {
        userType = "Doctor";
      }
      const { wallet, transactions } =
        await this.walletService.accessOrCreateWallet(userId, userType);
      res.status(200).json({ wallet, transactions });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "failed to create or access wallet"
      );
      next(error);
    }
  };

  createWithdrawalRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;
      const { amount } = req.body;

      if (!userId) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      if (!amount) {
        throw new BadRequestError("Amount is required");
      }

      const transactionData: TransactionData = {
        amount: amount,
        date: new Date(),
        type: "request",
        status: "pending",
        description: "Wallet withdrawal request",
      };
      const transaction = await this.walletService.addTransaction(
        userId,
        transactionData
      );
      res.status(200).json({ transaction });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "controller: error creating withdrawal request"
      );
      next(error);
    }
  };

  updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { transactionId, transactionData } = req.body;
      if (!transactionId || !transactionData) {
        throw new BadRequestError("Transaction is required");
      }
      const transaction = await this.walletService.updateTransaction(
        transactionId,
        transactionData
      );

      res.status(200).json({ transaction });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controler: error updating trasaction"
      );
    }
    next(error);
  };
}

export default WalletController;
