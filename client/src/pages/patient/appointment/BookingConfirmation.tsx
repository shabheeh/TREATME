import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { IAppointmentPopulated } from "../../../types/appointment/appointment.types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import appointmentService from "../../../services/appointment/appointmentService";
import BookingConfirmedSkeleton from "../../../components/patient/BookingConfirmationSkelton";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";
import { FaHouseMedical } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { resetAppointment } from "../../../redux/features/appointment/appointmentSlice";

const BookingConfirmation = () => {
  const [appointment, setAppointment] = useState<IAppointmentPopulated | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const searchParams = new URLSearchParams(location.search);
  // const clientSecret = searchParams.get("payment_intent_client_secret");
  // const paymentId = searchParams.get("payment_intent");
  const paymentIntentId = location.state.paymentIntentId;
  const appointmentId = location.state.appointmentId;

  useEffect(() => {
    if (!paymentIntentId && !appointmentId) {
      throw new Error("Payment verification failed");
    }
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        if (paymentIntentId) {
          const appointment =
            await appointmentService.getAppointmentByPaymentId(paymentIntentId);
          setAppointment(appointment);
        } else if (appointmentId) {
          const appointment =
            await appointmentService.getAppointment(appointmentId);
          setAppointment(appointment);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    setTimeout(fetchAppointment, 2000);
  }, [navigate, paymentIntentId, appointmentId]);

  useEffect(() => {
    const handlePopState = () => {
      console.log("Popstate triggered at:", new Date().toISOString());
      dispatch(resetAppointment());
      navigate("/visitnow");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (loading) {
    return <BookingConfirmedSkeleton />;
  }

  if (!appointment) {
    navigate("/visitnow", { state: {} });
    return;
  }

  const handleBackToHome = () => {
    dispatch(resetAppointment());
    navigate("/visitnow", { state: {} });
  };

  const handleBackToAppointments = () => {
    dispatch(resetAppointment());
    navigate("/appointments", { state: {} });
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", p: 3, pt: 1 }}>
      {appointment.paymentStatus === "failed" ? (
        <Box color="secondary" sx={{ textAlign: "center", mb: 4 }}>
          <ErrorIcon color="secondary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography color="secondary" variant="h4" gutterBottom>
            Booking Failed!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mb: 4, color: "teal" }}>
          <CheckCircleIcon sx={{ fontSize: 64, mb: 2, color: "teal" }} />
          <Typography variant="h4" gutterBottom>
            Booking Confirmed!
          </Typography>
        </Box>
      )}

      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 3, mb: 1, border: "1px solid teal" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={appointment?.doctor?.profilePicture}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {appointment?.doctor?.firstName}{" "}
                  {appointment?.doctor?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.specialization.name}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography>
                  {appointment?.date && formatMonthDay(appointment?.date)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TimeIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography>
                  {appointment?.date && formatTime(appointment?.date)} (
                  {appointment.duration || "45 mins"})
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 3, mb: 1, border: "1px solid teal" }}
          >
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Amount Paid</Typography>
              <Typography>₹{appointment.fee}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Payment Method</Typography>
              <Typography>Card</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Status</Typography>
              <Typography color="success.main">
                {appointment.paymentStatus}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid teal",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body2" paragraph>
          You will receive a confirmation email with appointment details and
          instructions for joining the video consultation.
        </Typography>
        <Typography variant="body2">
          Please join the video consultation 5 minutes before the scheduled time
          to ensure a smooth start.
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        {appointment.paymentStatus === "failed" ? (
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="warning"
            startIcon={<PaymentIcon />}
          >
            Retry Payment
          </Button>
        ) : (
          <Button
            onClick={handleBackToAppointments}
            variant="contained"
            startIcon={<CalendarIcon />}
          >
            Upcoming Appointments
          </Button>
        )}

        <Button
          onClick={handleBackToHome}
          variant="outlined"
          startIcon={<FaHouseMedical />}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
