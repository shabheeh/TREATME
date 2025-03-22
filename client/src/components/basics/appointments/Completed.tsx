import { Box, Typography } from "@mui/material";
import { IAppointmentPopulated } from "../../../types/appointment/appointment.types";
import React from "react";
import AppointmentCardPatient from "../../patient/appointments/AppointmentCardPatient";
import AppointmentCardDoctor from "../../doctor/appointments/AppointmetCardDoctor";

import Loading from "../Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

interface CompletedProps {
  appointments: IAppointmentPopulated[] | [];
  // onReschedule: () => void;
}

const Completed: React.FC<CompletedProps> = ({
  appointments,
  // onReschedule,
}) => {
  const doctor = useSelector((state: RootState) => state.user.doctor);

  if (!appointments) {
    return <Loading />;
  }

  return (
    <Box>
      {appointments.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography>No upcoming appointments</Typography>
        </Box>
      ) : doctor ? (
        appointments.map((appointment) => (
          <AppointmentCardDoctor
            key={appointment._id}
            doctor={appointment.doctor}
            specialization={appointment.specialization.name}
            date={appointment.date}
            reason={appointment.reason}
            id={appointment._id}
            fee={appointment.fee}
            status={appointment.status}
            patient={appointment.patient}
            onReschedule={onReschedule}
          />
        ))
      ) : (
        appointments.map((appointment) => (
          <AppointmentCardPatient
            key={appointment._id}
            doctor={appointment.doctor}
            specialization={appointment.specialization.name}
            date={appointment.date}
            reason={appointment.reason}
            id={appointment._id}
            fee={appointment.fee}
            status={appointment.status}
            patient={appointment.patient}
            onReschedule={onReschedule}
          />
        ))
      )}
    </Box>
  );
};

export default Completed;
