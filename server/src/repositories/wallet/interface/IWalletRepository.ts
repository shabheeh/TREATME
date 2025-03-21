import { ITransaction, IWallet, TransactionData } from "src/interfaces/IWallet";

interface IWalletRepository {
  createWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<IWallet>;
  findWalletByUserId(userId: string): Promise<IWallet | null>;
  addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<ITransaction>;
  updateTransaction(
    transactionId: string,
    updatedData: Partial<TransactionData>
  ): Promise<ITransaction>;
  getTransactionsByWalletId(walletId: string): Promise<ITransaction[]>;
  getTransactions(): Promise<ITransaction[]>;
  getWalletWithTransactions(
    userId: string
  ): Promise<{ wallet: IWallet; transactions: ITransaction[] } | null>;
}

export default IWalletRepository;
