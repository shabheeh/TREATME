import IWalletRepository, {
  TransactionsPagination,
} from "src/repositories/wallet/interface/IWalletRepository";
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
    userType: "Patient" | "Doctor",
    page: number = 1
  ): Promise<{
    wallet: IWallet;
    transactions: ITransaction[];
    pagination: TransactionsPagination;
  }> {
    try {
      const wallet = await this.walletRepo.findWalletByUserId(userId);

      if (wallet) {
        const { transactions, pagination } =
          await this.walletRepo.getTransactionsByWalletId(
            wallet._id!.toString(),
            page
          );

        return { wallet, transactions, pagination };
      }

      const pagination: TransactionsPagination = {
        page,
        totalPages: 0,
        totalTransactions: 0,
      };

      const newWallet = await this.walletRepo.createWallet(userId, userType);
      return { wallet: newWallet, transactions: [], pagination };
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
