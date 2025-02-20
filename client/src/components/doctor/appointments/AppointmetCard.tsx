import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Divider,
  Grid
} from "@mui/material";

import { IDependent, IPatient } from "../../../types/patient/patient.types";
import { IDoctor } from "../../../types/doctor/doctor.types";
import {
  formatMonthDay,
  formatTime,
  getDayName
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
  onReschedule: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  patient,
  doctor,
  date,
  specialization,
  onReschedule
}) => {
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const navigate = useNavigate();

  const doctorName = doctor.firstName + " " + doctor.lastName;
  const patientName = patient.firstName + " " + patient.lastName;

  const viewHealthProfile = () => {
    navigate("/doctor/patients/health", { state: { patient } });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: { xs: "100%", sm: "90%" },
        borderRadius: 2,
        borderColor: "teal",
        overflow: "visible",
        mx: "auto",
        my: 2,
        p: { xs: 1, sm: 2 }
      }}
    >
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={patient.profilePicture}
              alt={patient.firstName}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #eaeaea"
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {patient.firstName} {patient.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {calculateAge(patient.dateOfBirth)}
              </Typography>
              <Typography
                variant="body1"
                onClick={viewHealthProfile}
                sx={{
                  fontSize: 12,
                  color: "teal",
                  cursor: "pointer",
                  ":hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                View Health Profile
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 } }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRescheduleModalOpen(true)}
              sx={{
                borderRadius: 4,
                backgroundColor: "#ffffdd",
                borderColor: "#e6e6b8",
                color: "#7a7a52",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#ffffe0",
                  borderColor: "#d6d6a8"
                }
              }}
            >
              RESCHEDULE
            </Button>
            <Button
              onClick={() => setCancelModalOpen(true)}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 4,
                backgroundColor: "#ffe0e0",
                borderColor: "#ffb3b3",
                color: "#d83939",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#ffe6e6",
                  borderColor: "#ffacac"
                }
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ pt: 1 }}>
          <Grid container spacing={1} sx={{ textAlign: "center" }}>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                DATE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatMonthDay(date)} {getDayName(date)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                TIME
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatTime(date)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                TYPE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {specialization}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                MODE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Video Call
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
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

export default AppointmentCard;
