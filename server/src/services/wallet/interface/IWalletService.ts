import { ITransaction, IWallet, TransactionData } from "src/interfaces/IWallet";
import { TransactionsPagination } from "src/repositories/wallet/interface/IWalletRepository";

export interface IWalletService {
  accessOrCreateWallet(
    userId: string,
    userType: "Patient" | "Doctor",
    page: number
  ): Promise<{
    wallet: IWallet;
    transactions: ITransaction[];
    pagination: TransactionsPagination;
  }>;
  addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<ITransaction>;
  updateTransaction(
    transactionId: string,
    transactionData: TransactionData
  ): Promise<ITransaction>;
}
