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
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

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
      const { page = 1 } = req.query;
      let userType: "Patient" | "Doctor";

      if (role === "patient") {
        userType = "Patient";
      } else {
        userType = "Doctor";
      }

      const parsedPage = parseInt(page as string, 10);

      if (isNaN(parsedPage) || parsedPage < 1) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }
      const { wallet, transactions, pagination } =
        await this.walletService.accessOrCreateWallet(
          userId,
          userType,
          parsedPage
        );
      res.status(HttpStatusCode.OK).json({ wallet, transactions, pagination });
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
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
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
      res.status(HttpStatusCode.OK).json({ transaction });
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

      res.status(HttpStatusCode.OK).json({ transaction });
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
