import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Avatar, 
  Button,
  Divider,
  Grid
} from '@mui/material';

import { IDependent, IPatient } from '../../../types/patient/patient.types';
import { IDoctor } from '../../../types/doctor/doctor.types';
import { formatMonthDay, formatTime, getDayName } from '../../../utils/dateUtils';


interface AppointmentCardProps {
    id: string;
    patient: IPatient | IDependent;
    doctor: IDoctor;
    date: Date;
    specialization: string;
    fee: number;
    reason: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ id,  doctor, date, specialization, fee, reason }) => {

  return (
    <Card
      variant="outlined" 
      sx={{ 
        maxWidth: "90%", 
        borderRadius: 2,
        borderColor: 'teal',
        overflow: 'visible',
        mx: 'auto',
    
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          {/* Doctor Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={doctor.profilePicture}
              alt={doctor.firstName}
              sx={{ 
                width: 48, 
                height: 48,
                border: '2px solid #eaeaea'
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {specialization}
              </Typography>
            </Box>
          </Box>


          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: 4,
                backgroundColor: '#ffffdd',
                borderColor: '#e6e6b8',
                color: '#7a7a52',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#ffffe0',
                  borderColor: '#d6d6a8'
                }
              }}
            >
              RESCHEDULE
            </Button>
            <Button 
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: 4,
                backgroundColor: '#ffe0e0',
                borderColor: '#ffb3b3',
                color: '#d83939',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#ffe6e6',
                  borderColor: '#ffacac'
                }
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ pt: 1 }}>
          <Grid container spacing={1} sx={{ textAlign: 'center' }}>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                DATE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500,  }}>
                {formatMonthDay(date)} { getDayName(date)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                TIME
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatTime(date)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                TYPE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {specialization}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                MODE
              </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    vidoe call
                </Typography>
            </Grid>
          </Grid>
        </Box>
        
      </Box>
    </Card>
  );
};

export default AppointmentCard;