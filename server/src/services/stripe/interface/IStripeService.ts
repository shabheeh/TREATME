import IAppointment from "src/interfaces/IAppointment";
import { ITransaction } from "src/interfaces/IWallet";

export interface IStripeService {
  handleStripePayment(
    userId: string,
    amount: number,
    paymentMetadata: IAppointment | ITransaction,
    paymentType: "appointment_fee" | "wallet_topup",
    timeZone: string
  ): Promise<{ clientSecret: string }>;
  handleWebhook(payload: Buffer, sig: string): Promise<void>;
}
