import { Box, Typography, Button, IconButton, Divider } from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import ProgressBar from "../../../components/basics/PrgressBar";
import HealthHistory from "../../../components/patient/healthHistory/HealthHistory";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { resetAppointment } from "../../../redux/features/appointment/appointmentSlice";

const ReviewHealthHistory = () => {
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointmentData = useSelector(
    (state: RootState) => state.appointment.appointmentData
  );

  useEffect(() => {
    if (!appointmentData) {
      navigate("/visitnow");
      return;
    }
  }, [appointmentData, navigate]);

  const handleContinue = async () => {
    navigate("/review-behavioural-health");
  };

  const handleExitBooking = () => {
    setExitModalOpen(false);
    navigate("/visitnow");
    dispatch(resetAppointment());
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Schedule Appointment
          </Typography>
          <IconButton onClick={() => setExitModalOpen(true)}>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={40} />
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
          ":hover": { textDecoration: "underline" }
        }}
      >
        <ArrowBack fontSize="small" sx={{ mr: 1 }} />
        Back
      </Button>

      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Let's Review your Health Profile
        </Typography>
      </Box>
      <HealthHistory />
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          onClick={handleContinue}
          variant="contained"
          sx={{ py: 1.5, px: 5, borderRadius: 8 }}
        >
          Continue
        </Button>
      </Box>
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

export default ReviewHealthHistory;
