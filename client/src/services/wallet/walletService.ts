import {
  ITransaction,
  IWallet,
  TransactionsPagination,
} from "../../types/wallet/wallet.types";
import { api } from "../../utils/axiosInterceptor";

class WalletService {
  async accessWallet(page: number = 1): Promise<{
    wallet: IWallet;
    transactions: ITransaction[];
    pagination: TransactionsPagination;
  }> {
    try {
      const response = await api.get(`/wallet?page=${page}`);
      const { wallet, transactions, pagination } = response.data;
      return { wallet, transactions, pagination };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error accessing wallet: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const walletService = new WalletService();
export default walletService;
