import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Autocomplete,
  TextField,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Close } from "@mui/icons-material";
import ProgressBar from "../../../components/basics/PrgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useLocation, useNavigate } from "react-router-dom";
import appointmentService from "../../../services/appointment/appointmentService";
import { toast } from "sonner";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";

const concerns = [
  "I have panic attacks",
  "I have been feeling paranoid",
  "I have been experiencing hallucinations or delusions",
  "I have been experiencing memory problems",
  "I have been struggling with substance abuse",
  "I have been experiencing sleep disturbances",
  "I have been experiencing post-traumatic stress",
  "I have been experiencing mood swings or bipolar symptoms",
  "I have obsessive-compulsive thoughts or behaviors",
  "I am not sure",
];

const PsychiatryReason = () => {
  const [selectedConcern, setSelectedConcern] = useState<string>("");
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const patient = useSelector((state: RootState) => state.user.patient);

  useEffect(() => {
    if (!state) {
      navigate("/visitnow");
      return;
    }
  }, [state, navigate]);

  const startAppointment = async () => {
    if (!currentPatient) return;
    const appointmentData = {
      patientId: currentPatient._id,
      patientType:
        currentPatient._id === patient?._id ? "Patient" : "Dependent",
      specialization: state.specializationId,
      fee: state.fee,
      status: "pending",
      reason: selectedConcern,
    };
    try {
      const result =
        await appointmentService.createAppointment(appointmentData);
      navigate("/review-health-history", {
        state: { appointmentId: result._id },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  };

  const handleExitBooking = () => {
    setExitModalOpen(false);
    navigate("/visitnow", { state: {} });
    return null;
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
          <Typography variant="h5" fontWeight="bold">
            Schedule Appointment
          </Typography>
          <IconButton onClick={() => setExitModalOpen(true)}>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={20} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Card elevation={0} sx={{ borderRadius: 3, p: 2 }}>
        <CardContent sx={{ p: 3 }}>
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

          <Typography variant="h6" fontWeight="bold" mb={1}>
            How can our Psychiatrist help?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Choose or type a primary concern
          </Typography>

          <Autocomplete
            freeSolo
            fullWidth
            options={concerns}
            value={selectedConcern}
            onInputChange={(_event, newValue) => setSelectedConcern(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter or select concern"
                variant="outlined"
              />
            )}
          />

          <Box mt={4} color="text.secondary">
            <Typography variant="body2" mb={2}>
              Our psychiatrist <strong>do not</strong> provide crisis
              intervention or emergency services. If you are experiencing a
              crisis, please seek immediate assistance.
            </Typography>

            <Typography variant="body2" mb={2}>
              Therapy may not be appropriate for individuals experiencing severe
              mental health crises or conditions requiring urgent care. Please
              reach out to emergency services for immediate support.
            </Typography>

            <Typography variant="body2" mb={2}>
              If you or someone you know is in distress, call the{" "}
              <strong>Suicide & Crisis Lifeline: 91-9820466726</strong>. Support
              is available <strong>24/7</strong>, free of charge.
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              onClick={startAppointment}
              variant="contained"
              sx={{ py: 1.5, px: 5, borderRadius: 8 }}
              disabled={!selectedConcern}
            >
              Continue
            </Button>
          </Box>
        </CardContent>
      </Card>
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

export default PsychiatryReason;
