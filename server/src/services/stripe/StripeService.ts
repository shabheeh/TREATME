import { IStripeService } from "./interface/IStripeService";
import { IWalletService } from "../wallet/interface/IWalletService";
import IAppointment, { IAppointmentService } from "src/interfaces/IAppointment";
import { ITransaction, TransactionData } from "src/interfaces/IWallet";
import { constructWebhookEvent, createPaymentIntent } from "../../utils/stripe";
import { AppError } from "../../utils/errors";
import logger from "../../configs/logger";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class StripeService implements IStripeService {
  private appointmentService: IAppointmentService;
  private walletService: IWalletService;

  constructor(
    @inject(TYPES.IAppointmentService)
    appointmentService: IAppointmentService,
    @inject(TYPES.IWalletService) walletService: IWalletService
  ) {
    this.appointmentService = appointmentService;
    this.walletService = walletService;
  }

  async handleStripePayment(
    userId: string,
    amount: number,
    paymentMetadata: IAppointment | ITransaction,
    paymentType: "appointment_fee" | "wallet_topup"
  ): Promise<{ clientSecret: string }> {
    try {
      const paymentIntent = await createPaymentIntent(
        userId,
        amount,
        "inr",
        paymentMetadata,
        paymentType
      );
      if (!paymentIntent || !paymentIntent.client_secret) {
        throw new AppError("Failed to create stripe payment gateway");
      }
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      logger.error(`Error stripe payment`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async handleWebhook(payload: Buffer, sig: string): Promise<void> {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new AppError("Something went wrong");
      }

      const event = constructWebhookEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          if (event.data.object.metadata.paymentType === "appointment_fee") {
            await this.handlePaymentIntentSucceededAppointment(
              event.data.object
            );
          } else if (
            event.data.object.metadata.paymentType === "wallet_topup"
          ) {
            await this.handlePaymentIntentSucceededWalletTopup(
              event.data.object
            );
          }

          break;

        case "payment_intent.payment_failed":
          if (event.data.object.metadata.paymentType === "appointment_fee") {
            await this.handlePaymentIntentFailedAppointment(event.data.object);
          } else if (
            event.data.object.metadata.paymentType === "wallet_topup"
          ) {
            await this.handlePaymentIntentFailedWalletTopup(event.data.object);
          }

          break;

        case "payment_intent.canceled":
          if (event.data.object.metadata.paymentType === "appointment_fee") {
            await this.handlePaymentIntentCanceledAppointment(
              event.data.object
            );
          }
          //   } else if (
          //     event.data.object.metadata.paymentType === "wallet_topup"
          //   ) {
          //     console.log("");
          //   }

          break;

        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Error stripe payment`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  private async handlePaymentIntentSucceededAppointment(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "confirmed",
      paymentStatus: "completed",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.appointmentService.createAppointment(appointment);
  }

  private async handlePaymentIntentFailedAppointment(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "pending",
      paymentStatus: "failed",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.appointmentService.createAppointment(appointment);
  }

  private async handlePaymentIntentCanceledAppointment(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const appointment = {
      ...this.createAppointmentObject(paymentIntent.metadata),
      status: "cancelled",
      paymentStatus: "cancelled",
      paymentIntentId: paymentIntent.id,
    } as unknown as IAppointment;

    await this.appointmentService.createAppointment(appointment);
  }

  private createAppointmentObject(metadata: Stripe.Metadata) {
    return {
      doctor: metadata.doctor,
      patientType: metadata.patientType,
      patient: metadata.patient,
      specialization: metadata.specialization,
      date: metadata.date,
      duration: Number(metadata.duration),
      reason: metadata.reason,
      fee: Number(metadata.fee),
      slotId: metadata.slotId,
      dayId: metadata.dayId,
    };
  }

  private async handlePaymentIntentFailedWalletTopup(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const userId = paymentIntent.metadata.userId;

    if (!userId) {
      throw new AppError("userId not found in paymentIntent.metadata", 404);
    }

    console.log(paymentIntent.metadata.amount, "payment aoutsaf");

    const transaction: TransactionData = {
      amount: Number(paymentIntent.metadata.amount),
      status: "failed",
      type: "credit",
      description: paymentIntent.metadata.description,
      date: new Date(),
    };

    await this.walletService.addTransaction(userId, transaction);
  }

  private async handlePaymentIntentSucceededWalletTopup(
    paymentIntent: Stripe.PaymentIntent
  ) {
    if (!paymentIntent.metadata) {
      throw new AppError("Payment intent metadata is missing", 400);
    }

    const userId = paymentIntent.metadata.userId;

    if (!userId) {
      throw new AppError("userId not found in paymentIntent.metadata", 404);
    }

    const transaction: TransactionData = {
      amount: Number(paymentIntent.metadata.amount),
      status: "success",
      type: "credit",
      description: paymentIntent.metadata.description,
      date: new Date(),
    };

    await this.walletService.addTransaction(userId, transaction);
  }
}

export default StripeService;
