import express from "express";
import { container } from "../../configs/container";
import { IStripeController } from "../../controllers/stripe/interface/IStripeController";
import { TYPES } from "../../types/inversifyjs.types";
const router = express.Router();

const stripeController = container.get<IStripeController>(
  TYPES.IStripeController
);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

export default router;
