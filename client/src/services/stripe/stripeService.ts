import IAppointment from "../../types/appointment/appointment.types";
import { ITransaction } from "../../types/wallet/wallet.types";
import { api } from "../../utils/axiosInterceptor";
import { PaymentIntent } from "@stripe/stripe-js";

export const createPaymentIntent = async (
  paymentData: Partial<IAppointment | ITransaction>,
  paymentType: string,
  amount: number,
  timeZone: string
) => {
  try {
    const response = await api.post("/create-payment-intent", {
      paymentData,
      paymentType,
      amount,
      timeZone,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error creating payment intent: ${error.message}`, error);
      throw new Error(error.message);
    }

    console.error(`Unknown error`, error);
    throw new Error(`Something went error`);
  }
};

export const confirmPaymentIntent = async ({
  paymentMethodId,
  clientSecret,
}: {
  paymentMethodId: string;
  clientSecret: string;
}): Promise<PaymentIntent> => {
  try {
    const response = await api.post("/confirm-payment-intent", {
      paymentMethodId,
      clientSecret,
    });
    return response.data.paymentIntent;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error confirm payment intent: ${error.message}`, error);
      throw new Error(error.message);
    }

    console.error(`Unknown error`, error);
    throw new Error(`Something went error`);
  }
};
