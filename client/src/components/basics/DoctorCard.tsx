import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Link,
  Grid,
  styled
} from '@mui/material';
import { formatMonthDay, formatTime, getDayName } from '../../utils/dateUtils';
import { IDaySchedule } from '../../types/doctor/doctor.types';




const TimeChip = styled(Chip)(({ theme }) => ({
  borderRadius: '50px',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
  }
}));


interface ProviderCardProps {
  name: string;
  specialties: string[];
  profilePicture: string;
  experience: number;
  availability: IDaySchedule[]
};


const DoctorCard: React.FC<ProviderCardProps> = ({
  name,
  specialties,
  profilePicture,
  availability,
  experience,

}) => {

  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot)
  }
  
  return (


    <Card 
      sx={{ 
        maxWidth: '100%',
        border: '1px solid',
        borderColor: 'teal',
        boxShadow: 'none',

      }}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={profilePicture}
            sx={{ 
              width: 70, 
              height: 70,
            }}
          />
          <Box>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'primary.main',
                fontSize: '1.1rem',
                fontWeight: 500,
                display: 'block',
                mb: 0.5
              }}
            >
              Dr. {name}
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            
              <Typography sx={{ fontSize: '14px', color: 'GrayText'}}>
                {specialties.join(' ')}
              </Typography>
              <Typography color="text.secondary">
                {experience}
              </Typography>
            </Box>
          </Box>
        </Box>

        
        <Box sx={{ textAlign: 'right', maxWidth: 330 }}>
  <Grid container spacing={1}>
    {availability &&
      availability.slice(0, 2).map((day, index) => (
        <Grid item xs={12} key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item>
              <Typography
                component="span"
                color="text.secondary"
                sx={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }}
              >
                {getDayName(day.date)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography component="span" color="text.secondary" sx={{ fontSize: '12px' }}>
                {formatMonthDay(day.date)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={1}>
                {day.slots.slice(0, 3).map((slot, slotIndex) => (
                  <Grid item key={slotIndex} xs={3}> 
                    <TimeChip
                     label={formatTime(slot.startTime)} size="small" 
                     onClick={() => handleSlotClick(slot)}
                    sx={{
                      backgroundColor:  slot === selectedSlot ? 'primary.main' : 'inherit',
                      color: slot === selectedSlot ? 'white' : 'primary.main',
                      ":hover": {backgroundColor: 'teal', color: 'white'}
                    }}
                  />
                  </Grid>
                ))}
  
                {day.slots.length > 3 && (
                  <Grid item xs={3}>
                    <Link
                      href="#"
                      sx={{ color: 'primary.main', fontSize: '0.875rem' }}
                      onClick={() => console.log("Show more slots")} 
                    >
                      {`+${day.slots.length - 3} more`}
                    </Link>
                  </Grid>
                )}
              </Grid>
        </Grid>
      ))}
  </Grid>

  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <Link
      href="#"
      underline="hover"
      sx={{
        color: 'primary.main',
        fontSize: '0.875rem',
        display: 'inline-block',
      }}
    >
      View Full Availability
    </Link>
  </Box>
</Box>


      </CardContent>
    </Card>
  );
};



export default DoctorCard;