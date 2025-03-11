import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Divider,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  VideoCameraFront as VideoIcon,
  MedicalServices as MedicalIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";

import { IDependent, IPatient } from "../../../types/patient/patient.types";
import { IDoctor } from "../../../types/doctor/doctor.types";
import {
  formatMonthDay,
  formatTime,
  getDayName,
  getDaysDifference,
} from "../../../utils/dateUtils";
import RescheduleModal from "../../basics/appointments/RescheduleModal";
import CancelAppointmentModal from "../../basics/appointments/CancelAppointmentModal ";

interface AppointmentCardProps {
  id: string;
  patient: IPatient | IDependent;
  doctor: IDoctor;
  date: Date;
  specialization: string;
  fee: number;
  reason: string;
  status: string;
  onReschedule: () => void;
  onViewDetails?: () => void;
}

const AppointmentCardPatient: React.FC<AppointmentCardProps> = ({
  id,
  patient,
  doctor,
  date,
  specialization,
  fee,
  reason,
  status,
  onReschedule,
  onViewDetails,
}) => {
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const doctorName = doctor.firstName + " " + doctor.lastName;
  const patientName = patient.firstName + " " + patient.lastName;

  const days = getDaysDifference(date);
  const isToday = days === 0;
  const isTomorrow = days === 1;
  const isPast = days < 1;
  const isFuture = days > 1;

  const getStatusChip = () => {
    if (isToday) {
      return (
        <Chip
          label="Today"
          size="small"
          color="error"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (isTomorrow) {
      return (
        <Chip
          label="Tomorrow"
          size="small"
          color="warning"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (isPast) {
      return (
        <Chip
          label={`${days * -1} days Ago`}
          size="small"
          color="info"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (isFuture) {
      return (
        <Chip
          label={`In ${days} days`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: "100%",
        borderRadius: 2,
        borderColor: isToday ? "#ff5252" : isTomorrow ? "#ff9800" : "#e0e0e0",
        borderWidth: isToday || isTomorrow ? 2 : 1,
        overflow: "visible",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        my: 3,
        "&:hover": {
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Appointment status indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
        }}
      >
        {getStatusChip()}
      </Box>

      {/* Doctor info */}
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={doctor.profilePicture}
          alt={doctor.firstName}
          sx={{
            width: 56,
            height: 56,
            border: "2px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              bgcolor: "rgba(0,150,136,0.08)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            {specialization}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Appointment details */}
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  DATE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {formatMonthDay(date)} {getDayName(date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimeIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  TIME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {formatTime(date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MedicalIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  FEE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  ₹{fee?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <VideoIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  MODE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  Video Call
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {reason && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              REASON FOR VISIT
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {reason}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          pt: 1,
          bgcolor: "#f9f9f9",
          borderTop: "1px solid #eaeaea",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {status === "confirmed" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRescheduleModalOpen(true)}
              sx={{
                borderRadius: 6,
                bgcolor: "#f8f8ff",
                borderColor: "#e0e0e6",
                color: "#5c6bc0",
                textTransform: "none",
                fontWeight: 500,
                py: 0.5,
                "&:hover": {
                  bgcolor: "#efefff",
                  borderColor: "#c5cae9",
                },
              }}
            >
              Reschedule
            </Button>
            <Button
              onClick={() => setCancelModalOpen(true)}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 6,
                bgcolor: "#fff5f5",
                borderColor: "#ffcdd2",
                color: "#e53935",
                textTransform: "none",
                fontWeight: 500,
                py: 0.5,
                "&:hover": {
                  bgcolor: "#ffebee",
                  borderColor: "#ef9a9a",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        )}

        {status === "completed" && (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* <Button
                variant="text"
                size="small"
                onClick={() => setRescheduleModalOpen(true)}
                sx={{
                  textDecoration: "underline",
                  color: "#5c6bc0",
                  fontWeight: 500,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#efefff",
                    borderColor: "#c5cae9",
                    textDecoration: "underline",
                  },
                }}
              >
                Share your feedback on your recent appointment.
              </Button> */}
            </Box>
            <Tooltip title="View appointment details">
              <IconButton
                color="primary"
                onClick={onViewDetails}
                sx={{
                  bgcolor: "primary.light",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                <ArrowIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      {/* Modals */}
      <RescheduleModal
        open={isRescheduleModalOpen}
        appointmentId={id}
        doctorId={doctor._id}
        onClose={() => setRescheduleModalOpen(false)}
        onReschedule={onReschedule}
      />

      <CancelAppointmentModal
        open={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        appointment={{ id, doctor: doctorName, patient: patientName, date }}
        onReschedule={onReschedule}
      />
    </Card>
  );
};

export default AppointmentCardPatient;
