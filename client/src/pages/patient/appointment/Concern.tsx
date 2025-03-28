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
import ProgressBar from "../../../components/basics/ui/PrgressBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";
import {
  resetAppointment,
  updateAppointment,
  updateStep,
} from "../../../redux/features/appointment/appointmentSlice";
import { ISpecialization } from "../../../types/specialization/specialization.types";
import specializationService from "../../../services/specialization/specializationService";
import { toast } from "sonner";
import Loading from "../../../components/basics/ui/Loading";

const Concern = () => {
  const [selectedConcern, setSelectedConcern] = useState<string>("");
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const patient = useSelector((state: RootState) => state.user.patient);
  const [specialization, setSpecialization] = useState<ISpecialization | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!state?.specializationId) {
      navigate("/visitnow");
      return;
    }
    fetchSpecialization();
  }, [state, navigate]);

  const fetchSpecialization = async () => {
    try {
      setLoading(true);
      const specializationData =
        await specializationService.getSpecializationById(
          state.specializationId
        );
      setSpecialization(specializationData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const startAppointment = () => {
    if (!specialization) return;

    dispatch(
      updateAppointment({
        patient: currentPatient?._id,
        reason: selectedConcern,
        specialization: specialization._id,
        status: "pending",
        fee: specialization.fee,
        patientType:
          currentPatient?._id === patient?._id ? "Patient" : "Dependent",
        duration: specialization.durationInMinutes,
      })
    );

    dispatch(updateStep(2));
    navigate("/review-health-history");
  };

  const handleExitBooking = () => {
    setExitModalOpen(false);
    navigate("/visitnow", { state: {} });
    dispatch(resetAppointment());
  };

  const handleBack = () => {
    navigate("/visitnow", { state: {} });
  };

  if (loading) {
    return <Loading />;
  }

  if (!specialization) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Typography variant="h6" color="error">
          Specialization not found.
        </Typography>
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
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={20} />
      </Box>

      <Divider sx={{ mt: 4 }} />

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
            How can our {specialization.name} specialists help?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Choose or type a primary concern
          </Typography>

          <Autocomplete
            freeSolo
            fullWidth
            options={specialization.concerns || []}
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
              Our {specialization.name} specialists <strong>do not</strong>{" "}
              provide emergency or life-threatening care. If you are
              experiencing a medical emergency, please seek immediate assistance
              at the nearest hospital or call your local emergency services.
            </Typography>

            <Typography variant="body2" mb={2}>
              This service is intended for non-emergency consultations and
              routine care. If you require urgent attention, please contact your
              primary healthcare provider or visit an urgent care facility.
            </Typography>

            <Typography variant="body2" mb={2}>
              If you or someone you know is in distress, help is available. Call
              the <strong>Suicide & Crisis Lifeline: 91-9820466726</strong>.
              Support is available <strong>24/7</strong>, free of charge.
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

export default Concern;
