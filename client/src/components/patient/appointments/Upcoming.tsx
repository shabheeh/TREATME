import { Box } from '@mui/material'
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types'
import React from 'react'
import AppointmentCard from './AppointmentCard'

interface UpcomingProps {
    appointments: IAppointmentPopulated[] | []
}

const Upcoming: React.FC<UpcomingProps> = ({ appointments }) => {

    
    
  return (
    <Box>
        {appointments.map(appointment => (
            <AppointmentCard 
            doctor={appointment.doctor}
            specialization={appointment.specialization.name}
            date={appointment.date}
            reason={appointment.reason}
            id={appointment._id}
            fee={appointment.fee}
            patient={appointment.patient}
            />
        ))}
        
    </Box>
  )
}

export default Upcoming