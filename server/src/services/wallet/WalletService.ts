import IWalletRepository from "src/repositories/wallet/interface/IWalletRepository";
import { IWalletService } from "./interface/IWalletService";
import { ITransaction, IWallet, WalletData } from "src/interfaces/IWallet";
import { AppError } from "../../utils/errors";

class WalletService implements IWalletService {
  private walletRepo: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this.walletRepo = walletRepository;
  }

  async accessOrCreateWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<IWallet> {
    try {
      // if the user already has a wallet return that
      const wallet = await this.walletRepo.findByUserId(userId);

      if (wallet) {
        return wallet;
      }

      // if user has no wallet create one
      const walletData = {
        user: userId,
        userType: userType,
      };

      const newWallet = await this.walletRepo.create(walletData);

      return newWallet;
    } catch (error) {
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async updateWallet(
    walletId: string,
    walletData: Partial<WalletData>
  ): Promise<IWallet> {
    const updatedWallet = await this.walletRepo.update(walletId, walletData);
    return updatedWallet;
  }

  async addTransaction(
    userId: string,
    transactionData: ITransaction
  ): Promise<IWallet> {
    const updatedWallet = await this.walletRepo.addTransaction(
      userId,
      transactionData
    );
    return updatedWallet;
  }
}

export default WalletService;
