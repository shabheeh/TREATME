import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "../appointment/Payment";
import { createPaymentIntent } from "../../../services/stripe/stripeService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const appointmentData = useSelector(
    (state: RootState) => state.appointment.appointmentData
  );
  useEffect(() => {
    if (!appointmentData) return;
    const initializePayment = async () => {
      try {
        const response = await createPaymentIntent(appointmentData);
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error("Payment Intent Error:", error);
      }
    };

    initializePayment();
  }, []);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <Payment />
    </Elements>
  );
};

export default PaymentWrapper;
