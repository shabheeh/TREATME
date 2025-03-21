import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "../Loading";
import { toast } from "sonner";
import { createPaymentIntent } from "../../../services/stripe/stripeService";
import PaymentForm from "./PaymentForm";
import { useForm } from "react-hook-form";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  fetchWallet: () => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({
  open,
  onClose,
  fetchWallet,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const amount = watch("amount");

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setShowPayment(false);
      reset({ amount: "" });
    }
  }, [open, reset]);

  const handleProceedToPayment = async () => {
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
      toast.error("Failed to create payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (showPayment) {
      setShowPayment(false);
      setClientSecret(null);
    } else {
      reset({ amount: "" });
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
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <PaymentForm
              handleBack={handleCancel}
              onSuccess={fetchWallet}
              closeModal={onClose}
            />
          </Elements>
        ) : (
          <Box mt={1}>
            <TextField
              {...register("amount", {
                required: "Amount is required",
                validate: {
                  numeric: (value) => {
                    const numericValue = parseFloat(value);
                    return !isNaN(numericValue) || "Enter only numbers";
                  },
                  minAmount: (value) => {
                    const numericValue = parseFloat(value);
                    return numericValue >= 50 || "Minimum amount is 50";
                  },
                },
              })}
              autoFocus
              margin="dense"
              type="number"
              inputProps={{
                shrink: true,
              }}
              fullWidth
              label="Amount"
              variant="outlined"
              error={!!errors.amount}
              helperText={errors.amount ? errors.amount.message : ""}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {!showPayment && (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              onClick={handleSubmit(handleProceedToPayment)}
              variant="contained"
            >
              Proceed to Payment
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddFundsModal;
