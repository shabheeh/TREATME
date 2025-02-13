import { Box } from '@mui/material'
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types'
import React from 'react'
import AppointmentCard from '../AppointmentCard'

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
            date={appointment.date.toString()}
            time={appointment.date.toString()}
            reason={appointment.reason}
            />
        ))}
        
    </Box>
  )
}

export default Upcoming