import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BookingConfirmation from "./BookingConfirmation";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingWrapper: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <BookingConfirmation />
    </Elements>
  );
};

export default BookingWrapper;
