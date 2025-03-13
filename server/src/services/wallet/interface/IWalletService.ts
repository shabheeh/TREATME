import { ITransaction, IWallet, WalletData } from "src/interfaces/IWallet";

export interface IWalletService {
  accessOrCreateWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<IWallet>;
  updateWallet(
    walletId: string,
    walletData: Partial<WalletData>
  ): Promise<IWallet>;
  addTransaction(
    userId: string,
    transactionData: ITransaction
  ): Promise<IWallet>;
}
