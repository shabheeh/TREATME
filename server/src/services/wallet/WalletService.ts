import IWalletRepository from "src/repositories/wallet/interface/IWalletRepository";
import { IWalletService } from "./interface/IWalletService";
import { ITransaction, IWallet, TransactionData } from "src/interfaces/IWallet";
import { handleTryCatchError } from "../../utils/errors";
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
      const wallet = await this.walletRepo.findWalletByUserId(userId);

      if (wallet) {
        const transactions = await this.walletRepo.getTransactionsByWalletId(
          wallet._id!.toString()
        );
        return { wallet, transactions };
      }

      const newWallet = await this.walletRepo.createWallet(userId, userType);
      return { wallet: newWallet, transactions: [] };
    } catch (error) {
      handleTryCatchError("Service", error);
    }
  }

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
