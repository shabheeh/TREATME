import { IWalletService } from "src/services/wallet/interface/IWalletService";
import { IWalletController } from "./interface/IWalletController";
import { Request, Response, NextFunction } from "express";
import { ITokenPayload } from "../../utils/jwt";
import logger from "../../configs/logger";

class WalletController implements IWalletController {
  private walletService: IWalletService;

  constructor(walletService: IWalletService) {
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
      const wallet = await this.walletService.accessOrCreateWallet(
        userId,
        userType
      );
      res.status(200).json({ wallet });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "failed to create or access wallet"
      );
      next(error);
    }
  };

  updateWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as ITokenPayload).id;

      const { walletData } = req.body;

      const wallet = await this.walletService.updateWallet(userId, walletData);
      res.status(200).json({ wallet });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "failed to create or access wallet"
      );
      next(error);
    }
  };
}

export default WalletController;
