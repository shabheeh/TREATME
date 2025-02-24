import IAppointment from "src/interfaces/IAppointment";
import logger from "../configs/logger";
import Stripe from "stripe";
import { AppError } from "./errors";

const appointmentToMetadata = (
  appointment: IAppointment
): Record<string, string | number> => {
  return {
    doctor: appointment.doctor.toString(),
    patientType: appointment.patientType,
    patient: appointment.patient.toString(),
    specialization: appointment.specialization.toString(),
    date: appointment.date.toString(),
    duration: appointment.duration,
    reason: appointment.reason,
    fee: appointment.fee,
    slotId: appointment.slotId,
    dayId: appointment.dayId,
    status: appointment.status,
    paymentStatus: appointment.paymentStatus,
  };
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const createPaymentIntent = async (
  amount: number,
  currency = "inr",
  appointmentData: IAppointment
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: appointmentToMetadata(appointmentData),
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
      throw new AppError("Webhook signature verification failed", 400);
    }
    throw new AppError("Invalid webhook payload", 400);
  }
};
