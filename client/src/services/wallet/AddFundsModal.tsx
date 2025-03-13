import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../stripe/stripeService";
import { IWallet } from "../../types/wallet/wallet.types";
import Loading from "../../components/basics/Loading";
import { toast } from "sonner";



interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  wallet: IWallet | null;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({
  open,
  onClose,
  wallet,
}) => {
  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!open) {
      setAmount("");
      setClientSecret(null);
      setShowPayment(false);
    }
  }, [open]);

  const stripe = useStripe();
  const elements = useElements();

  const handleProceedToPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    try {
      const response = await createPaymentIntent(
        { description: "Added fund to the wallet" },
        "wallet_topup",
        parseFloat(amount)
      );

      setClientSecret(response.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error("Payment Intent Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!amount || !stripe || !elements) {
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
        toast.success(`Payment confirmed successfully`);
        if (result.paymentIntent.status === "succeeded") {
          onClose();
        } else {
          toast.error("failed to add fund to wallet");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancel = () => {
    if (showPayment) {
      setShowPayment(false);
      setClientSecret(null);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Funds to Wallet</DialogTitle>
      <DialogContent>
        {isProcessing ? (
          <Loading />
        ) : showPayment && clientSecret ? (
          <Box mt={2}>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                },
              }}
            >
              <PaymentElement
                options={{
                  paymentMethodOrder: ["card", "upi", "netbanking"],
                  layout: "tabs",
                }}
              />
            </Elements>
          </Box>
        ) : (
          <Box mt={1}>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1 }}>
                    Current Balance: ${wallet?.balance}
                  </Typography>
                ),
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          {showPayment ? "Back" : "Cancel"}
        </Button>
        <Button onClick={handleConfirmPayment}>
          {showPayment && "Confirm"}
        </Button>
        {!showPayment && (
          <Button
            onClick={handleProceedToPayment}
            variant="contained"
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
          >
            Proceed to Payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddFundsModal;
