import IWalletRepository from "src/repositories/wallet/interface/IWalletRepository";
import { IWalletService } from "./interface/IWalletService";
import { ITransaction, IWallet, TransactionData } from "src/interfaces/IWallet";
import { AppError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class WalletService implements IWalletService {
  private walletRepo: IWalletRepository;

  constructor(
    @inject(TYPES.IWalletRepository) walletRepository: IWalletRepository
  ) {
    this.walletRepo = walletRepository;
  }

  async accessOrCreateWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<{ wallet: IWallet; transactions: ITransaction[] }> {
    try {
      // if the user already has a wallet return that
      const wallet = await this.walletRepo.findWalletByUserId(userId);

      if (wallet) {
        const transactions = await this.walletRepo.getTransactionsByWalletId(
          wallet._id!.toString()
        );
        return { wallet, transactions };
      }

      // if user has no wallet create one
      const newWallet = await this.walletRepo.createWallet(userId, userType);
      return { wallet: newWallet, transactions: [] };
    } catch (error) {
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  // async updateWallet(
  //   walletId: string,
  //   walletData: Partial<WalletData>
  // ): Promise<IWallet> {
  //   const updatedWallet = await this.walletRepo.update(walletId, walletData);
  //   return updatedWallet;
  // }

  async addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<ITransaction> {
    const transaction = await this.walletRepo.addTransaction(
      userId,
      transactionData
    );
    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    transactionData: TransactionData
  ): Promise<ITransaction> {
    const transaction = await this.walletRepo.addTransaction(
      transactionId,
      transactionData
    );
    return transaction;
  }
}

export default WalletService;
