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
  HourglassTop as HourGlassTopIcon,
  ArrowForward as ArrowIcon,
  PersonOutline as PatientIcon,
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
import { calculateAge } from "../../../helpers/ageCalculator";
import { useNavigate } from "react-router-dom";

interface AppointmentCardProps {
  id: string;
  patient: IPatient | IDependent;
  doctor: IDoctor;
  date: Date;
  specialization: string;
  fee: number;
  reason: string;
  status: string;
  duration: number;
  onReschedule: () => void;
  onViewDetails?: () => void;
}

const AppointmentCardDoctor: React.FC<AppointmentCardProps> = ({
  id,
  patient,
  doctor,
  date,
  specialization,
  reason,
  status,
  duration,
  onReschedule,
  onViewDetails,
}) => {
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const navigate = useNavigate();

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
  const viewHealthProfile = () => {
    navigate("/doctor/patients/health", { state: { patient } });
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
      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 12 },
          right: { xs: 8, sm: 12 },
          zIndex: 2,
        }}
      >
        {getStatusChip()}
      </Box>
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        <Avatar
          src={patient.profilePicture}
          alt={patient.firstName}
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            border: "2px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              mb: { xs: 0.5, sm: 0.75 },
            }}
          >
            {patient.firstName} {patient.lastName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Age: {calculateAge(patient.dateOfBirth)}
            </Typography>
            <Typography
              variant="body2"
              onClick={viewHealthProfile}
              sx={{
                color: "primary.main",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <PatientIcon fontSize="small" />
              View Health Profile
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: { xs: 1.5, sm: 2 }, my: { xs: 0.5, sm: 1 } }} />

      {/* Appointment details */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          pt: { xs: 1, sm: 1.5 },
          pb: { xs: 1.5, sm: 2 },
        }}
      >
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  DATE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {formatMonthDay(date)} {getDayName(date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimeIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  TIME
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {formatTime(date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MedicalIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  TYPE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {specialization}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <VideoIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  MODE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Video Call
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HourGlassTopIcon color="primary" fontSize="small" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                >
                  DURATION
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {duration} Minutes
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {reason && (
          <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
            >
              REASON FOR VISIT
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              {reason}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          pt: { xs: 1, sm: 1.5 },
          bgcolor: "#f9f9f9",
          borderTop: "1px solid #eaeaea",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {status === "confirmed" && (
          <Box
            sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap" }}
          >
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
                py: { xs: 0.25, sm: 0.5 },
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
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
                py: { xs: 0.25, sm: 0.5 },
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
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
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                flexWrap: "wrap",
              }}
            ></Box>
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

export default AppointmentCardDoctor;
