import Stripe from "stripe";
import logger from "../configs/logger";
import { AppError } from "./errors";
import IAppointment from "src/interfaces/IAppointment";
import { ITransaction } from "src/interfaces/IWallet";
import { HttpStatusCode } from "../constants/httpStatusCodes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

type PaymentMetadata = Record<string, string | number>;

const generateMetadata = (
  userId: string,
  data: IAppointment | ITransaction,
  paymentType: "appointment_fee" | "wallet_topup",
  amount: number
): Record<string, string | number> => {
  const metadata: PaymentMetadata = { paymentType, userId, amount };

  Object.entries(data).forEach(([key, value]) => {
    metadata[key] =
      typeof value === "object" ? JSON.stringify(value) : value.toString();
  });

  return metadata;
};

export const createPaymentIntent = async (
  userId: string,
  amount: number,
  currency = "inr",
  paymentData: IAppointment | ITransaction,
  paymentType: "appointment_fee" | "wallet_topup"
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: generateMetadata(userId, paymentData, paymentType, amount),
    });
    return paymentIntent;
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    throw new Error("Stripe: Failed to create payment intent");
  }
};

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    throw new Error("Stripe: Failed to confirm payment intent");
  }
};

export const constructWebhookEvent = (
  payload: Buffer,
  sig: string,
  webhookSecret: string
) => {
  try {
    return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    if (err instanceof stripe.errors.StripeSignatureVerificationError) {
      throw new AppError(
        "Webhook signature verification failed",
        HttpStatusCode.BAD_REQUEST
      );
    }
    throw new AppError("Invalid webhook payload", HttpStatusCode.BAD_REQUEST);
  }
};
