import React, { useState } from "react";
import { Modal, Box, Typography, Button, Stack, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { formatTime } from "../../../utils/dateUtils";
import appointmentService from "../../../services/appointment/appointmentService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onReschedule: () => void;
  appointment: {
    id: string;
    date: Date;
    doctor: string;
    patient: string;
  };
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  open,
  onClose,
  appointment,
  onReschedule,
}) => {
  const patient = useSelector((state: RootState) => state.user.patient);
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(appointment.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCancel = async () => {
    try {
      setLoading(true);
      await appointmentService.updateAppointment(appointment.id, {
        status: "cancelled",
      });
      toast.success("Appointment Cancelled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Someting went wrong"
      );
    } finally {
      setLoading(false);
      onClose();
      onReschedule();
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby="cancel-appointment-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 750 },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            id="cancel-appointment-title"
            variant="h6"
            component="h2"
            color="error"
          >
            Cancel Appointment
          </Typography>
          <Button onClick={() => onClose()} sx={{ minWidth: "auto", p: 0.5 }}>
            <CloseIcon />
          </Button>
        </Box>

        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          Are you sure you want to cancel your appointment? This action cannot
          be undone.
        </Alert>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Appointment Details:
          </Typography>
          <Typography variant="body1">Date: {formattedDate}</Typography>
          <Typography variant="body1">
            Time: {formatTime(appointment.date)}
          </Typography>
          {patient ? (
            <Typography variant="body1">
              Doctor: {appointment?.doctor || ""}
            </Typography>
          ) : (
            <Typography variant="body1">
              Patient: {appointment?.patient || ""}
            </Typography>
          )}
        </Box>

        {/* <Divider sx={{ my: 3 }} />
        
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Please tell us why you're canceling:
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Reason for cancellation (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box> */}

        <Alert severity="info" sx={{ mb: 3 }}>
          Please note that cancellations made less than 2 hours before your
          scheduled appointment may be subject to a cancellation fee of 100rs.
        </Alert>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={() => onClose()} color="inherit">
            Keep Appointment
          </Button>
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleCancel}
            variant="contained"
            color="error"
          >
            Confirm Cancellation
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CancelAppointmentModal;
