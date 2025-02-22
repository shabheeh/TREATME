import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
  Avatar,
  Button,
  Skeleton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ProgressBar from "../../../components/basics/PrgressBar";
import { useNavigate } from "react-router-dom";
// import appointmentService from "../../../services/appointment/appointmentService";
import { toast } from "sonner";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";
import { useDispatch, useSelector } from "react-redux";
import { resetAppointment } from "../../../redux/features/appointment/appointmentSlice";
import { RootState } from "../../../redux/app/store";
import { IDoctor } from "../../../types/doctor/doctor.types";
import { ISpecialization } from "../../../types/specialization/specialization.types";
import specializationService from "../../../services/specialization/specializationService";
import doctorService from "../../../services/doctor/doctorService";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  // confirmPaymentIntent,
  createPaymentIntent,
} from "../../../services/stripe/stripeService";

const Payment: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [specialization, setSpecialization] = useState<ISpecialization | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  // const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<
  //   string | null
  // >(null);

  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const appointmentData = useSelector(
    (state: RootState) => state.appointment.appointmentData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (
        !appointmentData ||
        !appointmentData.doctor ||
        !appointmentData.specialization
      ) {
        navigate("/visitnow");
        return;
      }

      try {
        const specialization =
          await specializationService.getSpecializationById(
            appointmentData.specialization
          );
        const doctor = await doctorService.getDoctor(appointmentData.doctor);

        setDoctor(doctor);
        setSpecialization(specialization);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Someting went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const createPayment = async () => {
  //     if (!appointmentData || !appointmentData.fee) {
  //       return;
  //     }
  //     try {
  //       const result = await createPaymentIntent(appointmentData.fee);

  //       setPaymentIntentClientSecret(result.clientSecret);
  //     } catch (error) {
  //       console.error("Error creating payment intent:", error);
  //       toast.error("Failed to create payment gatway");
  //     }
  //   };

  //   createPayment();
  // }, []);

  useEffect(() => {
    const initializePayment = async () => {
      if (!appointmentData) return;

      try {
        const response = await createPaymentIntent(appointmentData);
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.log(error);
        toast.error("Failed to initialize payment");
      }
    };

    initializePayment();
  }, [appointmentData]);

  const handlePaymentClick = async () => {
    if (!appointmentData) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    try {
      setPaymentLoading(true);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        return;
      }

      // const response = await createPaymentIntent(appointmentData);

      // const { clientSecret } = response;

      if (!clientSecret) return;

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/confirmed`,
        },
      });

      if (result.error) {
        toast.success("Payment success");
      } else {
        toast.error("Someting went wrong");
      }
      // const paymentIntent = await confirmPaymentIntent({
      //   paymentMethodId: paymentMethod.id,
      //   clientSecret: paymentIntentClientSecret!
      // });
      // if (!paymentIntent || paymentIntent.status !== "succeeded") {
      //   throw new Error("Payment confirmation failed");
      // }

      // const updatedAppointment = {
      //   ...appointmentData,
      //   status: "confirmed",
      //   paymentStatus: "paid"
      // };

      // const result =
      //   await appointmentService.createAppointment(updatedAppointment);
      // navigate("/confirmed", { state: { appointmentId: result._id } });
      // dispatch(resetAppointment());
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleExitBooking = () => {
    setExitModalOpen(false);
    navigate("/visitnow");
    dispatch(resetAppointment());
  };

  const handleBack = () => {
    navigate(-1);
  };

  // const CARD_ELEMENT_OPTIONS = {
  //   style: {
  //     base: {
  //       color: "#32325d",
  //       fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  //       fontSmoothing: "antialiased",
  //       fontSize: "16px",
  //       "::placeholder": {
  //         color: "#aab7c4",
  //       },
  //     },
  //     invalid: {
  //       color: "#fa755a",
  //       iconColor: "#fa755a",
  //     },
  //   },
  // };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Schedule Appointment
            </Typography>
            <IconButton onClick={() => setExitModalOpen(true)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ProgressBar value={100} />
        </Box>
        <Divider sx={{ my: 4 }} />
        <Button
          onClick={handleBack}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            mb: 3,
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            ":hover": { textDecoration: "underline" },
          }}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
          Back
        </Button>
        <Box sx={{ my: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="grayText">
            Review and Book Appointment
          </Typography>
        </Box>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">Appointment Summary</Typography>
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={3}>
                  <Skeleton
                    variant="circular"
                    width={50}
                    height={50}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="start"
                  flexDirection="column"
                  sx={{
                    border: 1,
                    gap: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: 13 }}>
                    Patient
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ mr: 2 }}
                    />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column" gap={1}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Details
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                  <Skeleton variant="text" width="80%" sx={{ mt: 1.5 }} />
                </CardContent>
              </Card>
              <Box>
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Schedule Appointment
          </Typography>
          <IconButton onClick={() => setExitModalOpen(true)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ProgressBar value={100} />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Button
        onClick={handleBack}
        sx={{
          display: "flex",
          alignItems: "center",
          color: "primary.main",
          mb: 3,
          fontSize: "16px",
          fontWeight: "bold",
          textDecoration: "none",
          ":hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
        Back
      </Button>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="grayText">
          Review and Book Appointment
        </Typography>
      </Box>

      {appointmentData && doctor && specialization ? (
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2, border: "1px solid teal" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">Appointment Summary</Typography>
                    <Typography variant="body1">
                      {appointmentData.date &&
                        formatMonthDay(appointmentData?.date)}{" "}
                      {appointmentData.date &&
                        formatTime(appointmentData?.date)}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    src={doctor.profilePicture}
                    alt={`${doctor.firstName}`}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {specialization?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointmentData?.reason}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="start"
                  flexDirection="column"
                  sx={{
                    border: 1,
                    gap: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: 13 }}>
                    Patient
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={currentPatient?.profilePicture}
                      alt={`${currentPatient?.firstName}`}
                      sx={{ mr: 2 }}
                    />
                    <Typography>
                      {currentPatient?.firstName} {currentPatient?.lastName}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column" gap={1}>
              <Card variant="outlined" sx={{ border: "1px solid teal" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Details
                  </Typography>

                  {/* Stripe Payment Element - handles all payment methods */}
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <PaymentElement
                      options={{
                        paymentMethodOrder: ["card", "upi", "netbanking"],
                        layout: "tabs",
                      }}
                    />
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Typography>Amount Due</Typography>
                    <Typography>
                      ₹{appointmentData.fee && appointmentData.fee.toFixed(2)}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
                    You will not be charged any additional fee after your
                    consultation.
                  </Typography>
                </CardContent>
              </Card>

              <Box>
                <Button
                  disabled={isPaymentLoading || !stripe}
                  fullWidth
                  onClick={handlePaymentClick}
                  variant="contained"
                  sx={{ p: 2 }}
                >
                  {isPaymentLoading ? "Processing..." : "Book Appointment"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
          No appointment found. Please try again.
        </Typography>
      )}
      {/* <CardElement /> */}
      <ConfirmActionModal
        open={exitModalOpen}
        title="Exit Booking"
        confirmColor="error"
        description="Are you sure you want to exit this appointment booking?"
        handleClose={() => setExitModalOpen(false)}
        handleConfirm={handleExitBooking}
        cancelText="Continue Booking"
        confirmText="Exit Booking"
      />
    </Box>
  );
};

export default Payment;
