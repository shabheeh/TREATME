import { IWallet } from "../../types/wallet/wallet.types";
import { api } from "../../utils/axiosInterceptor";

class WalletService {
  async accessWallet(): Promise<IWallet> {
    try {
      const response = await api.get("/wallet");
      const { wallet } = response.data;
      return wallet;
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
