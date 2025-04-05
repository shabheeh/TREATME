import { ITransaction, IWallet, TransactionData } from "src/interfaces/IWallet";

export interface IWalletService {
  accessOrCreateWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<{ wallet: IWallet; transactions: ITransaction[] }>;
  addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<ITransaction>;
  updateTransaction(
    transactionId: string,
    transactionData: TransactionData
  ): Promise<ITransaction>;
}
