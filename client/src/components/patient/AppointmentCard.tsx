import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material'
import React from 'react'
import { IDoctor } from '../../types/doctor/doctor.types';

interface AppointmentCardProps {
    doctor: IDoctor;
    specialization: string;
    date: string;
    time: string;
    reason: string;
}


const AppointmentCard: React.FC<AppointmentCardProps> = ({ doctor, specialization, date, time, reason }) => {
  return (
        <Card
        sx={{
            maxWidth: '100%',
            border: '1px solid',
            borderColor: 'teal',
            boxShadow: 'none',
            minHeight: 200, 
        }}
        >
            <CardContent sx={{ display: 'flex', p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                    <Avatar 
                        src={doctor.profilePicture}
                        alt={doctor.firstName}
                        sx={{
                            width: 60,
                            height: 60,
                        }}
                    />
                    <Box>
                    <Typography sx={{ fontSize: '14px', color: 'GrayText' }}>
                        {doctor.firstName} || 'dasdfsd'
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: 'GrayText' }}>
                        {specialization} || dsfdsf
                    </Typography>
                    </Box>
                    
                </Box>
                <Divider  sx={{ my: 2}}/>
            </CardContent>

    </Card>
  )
}

export default AppointmentCard