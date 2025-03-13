import { ITransaction, IWallet, WalletData } from "src/interfaces/IWallet";

interface IWalletRepository {
  create(walletData: Partial<WalletData>): Promise<IWallet>;
  update(walletId: string, walletData: Partial<WalletData>): Promise<IWallet>;
  addTransaction(
    userId: string,
    transactionData: ITransaction
  ): Promise<IWallet>;
  findById(walletId: string): Promise<IWallet | null>;
  findByUserId(userId: string): Promise<IWallet | null>;
}

export default IWalletRepository;
