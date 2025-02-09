import React from 'react';
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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';



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
  role: string;
  imageUrl: string;
  experience: number;
  availability: {
    dayName: string;
    date: string;
    slots: string[];
  }[];
//   onViewFullAvailability?: () => void;
}

const DoctorCard: React.FC<ProviderCardProps> = ({
  name,
  role,
  imageUrl,
  availability,
  experience,
//   onViewFullAvailability
}) => {
  return (
    <Card 
      sx={{ 
        maxWidth: '100%',
        border: '1px solid',
        borderColor: 'teal',
        boxShadow: 'none',
        // borderRadius: 2,

      }}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={imageUrl}
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
              {name}
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* <LocalHospitalIcon sx={{ color: 'text.secondary', fontSize: 20 }} /> */}
              <Typography color="text.secondary">
                {role}
              </Typography>
              <Typography color="text.secondary">
                {experience}
              </Typography>
            </Box>
          </Box>
        </Box>

        
        <Box sx={{ textAlign: 'right', maxWidth: 330 }}>
        <Grid container spacing={2}>
            {availability.map((day, index) => (
            <Grid item xs={12} key={index} sx={{ display: 'flex', flexDirection: 'column', }}>
                
                {/* Day and Date Row */}
                <Grid container direction="row" spacing={1}>
                <Grid item>
                    <Typography
                    component="span"
                    color="text.secondary"
                    sx={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }}
                    >
                    {day.dayName}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography component="span" color="text.secondary" sx={{ fontSize: '12px' }}>
                    {day.date}
                    </Typography>
                </Grid>
                </Grid>

                {/* Time Slots */}
                <Grid container direction="row" spacing={1}>
  {day.slots.slice(0, 3).map((slot, slotIndex) => (
    <Grid item key={slotIndex} xs={3}> 
      <TimeChip label={slot} size="small" />
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

        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <Link
            href="#"
            underline="hover"
            // onClick={onViewFullAvailability}
            sx={{
            color: 'primary.main',
            fontSize: '0.875rem',
            mt: 1,
            display: 'inline-block'
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