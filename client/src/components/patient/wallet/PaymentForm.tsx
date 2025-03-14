import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";

interface PaymentFormProps {
  handleBack: () => void;
  onSuccess: () => void;
  closeModal: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  handleBack,
  onSuccess,
  closeModal,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaymentLoading, setPaymentLoading] = useState<boolean>(false);

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not initialized. Please try again.");
      return;
    }

    try {
      setPaymentLoading(true);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        toast.error(submitError.message || "Failed to submit payment details");
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess();
        } else {
          closeModal();
          toast.error("Failed to add funds to wallet");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      closeModal();
      setPaymentLoading(false);
    }
  };

  return (
    <Box>
      <PaymentElement
        options={{
          paymentMethodOrder: ["card", "upi", "netbanking"],
          layout: "tabs",
        }}
      />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button
          onClick={handleConfirmPayment}
          variant="contained"
          disabled={isPaymentLoading || !stripe || !elements}
        >
          {isPaymentLoading ? "Processing..." : "Confirm Payment"}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentForm;
