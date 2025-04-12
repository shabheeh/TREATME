import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BookingConfirmation from "./BookingConfirmation";
import { useDispatch } from "react-redux";
import { resetAppointment } from "../../../redux/features/appointment/appointmentSlice";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handlePopState = () => {
      dispatch(resetAppointment());
      navigate("/visitnow");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <Elements stripe={stripePromise}>
      <BookingConfirmation />
    </Elements>
  );
};

export default BookingWrapper;
