import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "../appointment/Payment";
import { createPaymentIntent } from "../../../services/stripe/stripeService";
import Loading from "../../../components/basics/Loading";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const appointmentData = useSelector(
    (state: RootState) => state.appointment.appointmentData
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentData) {
      navigate("/visitnow");
      return;
    }

    const initializePayment = async () => {
      try {
        const amount = appointmentData.fee;
        if (!amount) return;
        const response = await createPaymentIntent(
          appointmentData,
          "appointment_fee",
          amount
        );
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error("Payment Intent Error:", error);
      }
    };

    initializePayment();
  }, []);

  if (!clientSecret) {
    return <Loading />;
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
