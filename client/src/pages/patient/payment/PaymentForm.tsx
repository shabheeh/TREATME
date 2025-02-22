import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import IAppointment from "../../../types/appointment/appointment.types";
import { createPaymentIntent } from "../../../services/stripe/stripeService";

interface PaymentFormProps {
  appointmentData: Partial<IAppointment>;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  appointmentData,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const response = await createPaymentIntent(appointmentData);

      const { clientSecret } = response;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        onError(result.error.message!);
      } else {
        onSuccess();
      }
    } catch (error) {
      onError("Payment failed. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="pay-button"
      >
        {loading ? "Processing..." : `Pay $${appointmentData.fee}`}
      </button>
    </form>
  );
};

export default PaymentForm;
