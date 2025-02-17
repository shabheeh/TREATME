import { Box, Typography } from '@mui/material'
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types'
import React from 'react'
import AppointmentCard from './AppointmentCard'
import Loading from '../../basics/Loading'

interface UpcomingProps {
    appointments: IAppointmentPopulated[] | [];
    onReschedule: () => void
}

const Upcoming: React.FC<UpcomingProps> = ({ appointments, onReschedule }) => {

  if (!appointments) {
    return <Loading />
  }
 
  return (
    <Box>
      {appointments.length === 0 ? (
        <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography>
          No upcoming appointments
        </Typography>
      </Box>
      ) : (
        appointments.map(appointment => (
          <AppointmentCard
            key={appointment._id}
            doctor={appointment.doctor}
            specialization={appointment.specialization.name}
            date={appointment.date}
            reason={appointment.reason}
            id={appointment._id}
            fee={appointment.fee}
            patient={appointment.patient}
            onReschedule={onReschedule}
          />
        ))
      )}
    </Box>
  );
}

export default Upcoming