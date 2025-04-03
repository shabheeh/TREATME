import { IStripeService } from "src/services/stripe/interface/IStripeService";
import { IStripeController } from "./interface/IStripeController";
import { Request, Response, NextFunction } from "express";
import { AppError, BadRequestError } from "../../utils/errors";
import logger from "../../configs/logger";
import { ITokenPayload } from "../../utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class StripeController implements IStripeController {
  private stripeService: IStripeService;

  constructor(@inject(TYPES.IStripeService) stripeService: IStripeService) {
    this.stripeService = stripeService;
  }

  createPaymentIntent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { paymentData, paymentType, amount } = req.body;

      const userId = (req.user as ITokenPayload).id;

      if (!paymentData) {
        throw new BadRequestError("Bad Request: Missing appointment data");
      }

      const clientSecret = await this.stripeService.handleStripePayment(
        userId,
        amount,
        paymentData,
        paymentType
      );
      res.status(200).json(clientSecret);
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller Error: stripePayement"
      );
      next(error);
    }
  };

  handleWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    try {
      if (!sig || Array.isArray(sig)) {
        throw new AppError("Invalid Stripe signature", 400);
      }

      await this.stripeService.handleWebhook(req.body, sig);
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Controller Error: webhook"
      );
      next(error);
    }
  };
}

export default StripeController;
