import { ITransaction, IWallet } from "../../types/wallet/wallet.types";
import { api } from "../../utils/axiosInterceptor";

class WalletService {
  async accessWallet(): Promise<{
    wallet: IWallet;
    transactions: ITransaction[];
  }> {
    try {
      const response = await api.get("/wallet");
      const { wallet, transactions } = response.data;
      return { wallet, transactions };
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
