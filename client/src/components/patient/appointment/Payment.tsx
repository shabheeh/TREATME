import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  IconButton,
  Button
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  LocationOn as LocationIcon, 
  Add as AddIcon,
  CreditCard as CardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const AppointmentDetailsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState('Care Team');

  const appointmentDetails = {
    date: 'Tuesday, February 11, 01:00 PM EST',
    therapist: {
      name: 'Marla Grafton',
      role: 'Social Worker',
      issue: 'I Have Relationship Issues'
    },
    location: 'New Jersey',
    paymentMethod: {
      type: 'VISA',
      lastFourDigits: '4242'
    },
    cost: {
      estimated: 179.00,
      authorized: 179.00
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', p: 2 }}>
      {/* Therapist Appointment Section */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">Therapist Appointment</Typography>
              <Typography variant="body1">{appointmentDetails.date}</Typography>
            </Box>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ width: 50, height: 50, bgcolor: 'grey.300', borderRadius: '50%', mr: 2 }} />
            <Box>
              <Typography variant="subtitle1">
                {appointmentDetails.therapist.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointmentDetails.therapist.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointmentDetails.therapist.issue}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body2">By Phone</Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body2">{appointmentDetails.location}</Typography>
          </Box>

          

          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ mt: 2, cursor: 'pointer' }}
          >
            Not the right location?
          </Typography>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Payment ✓ Completed</Typography>

          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ 
              border: 1, 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              p: 2, 
              mb: 2 
            }}
          >
            <Box display="flex" alignItems="center">
              <CardIcon sx={{ mr: 2 }} />
              <Typography>VISA **** {appointmentDetails.paymentMethod.lastFourDigits}</Typography>
            </Box>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ 
              border: 1, 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              p: 2, 
              mb: 2 
            }}
          >
            <Typography>Add Coupon</Typography>
            <IconButton>
              <AddIcon color="primary" />
            </IconButton>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography>Estimated Cost</Typography>
            <Typography>${appointmentDetails.cost.estimated.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography>Authorized Amount</Typography>
            <Typography>${appointmentDetails.cost.authorized.toFixed(2)}</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            By scheduling this appointment, you give us consent to charge your card once your visit is complete.
          </Typography>

          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ 
              border: 1, 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              p: 2 
            }}
          >
            <Typography>{selectedTeam}</Typography>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentDetailsPage;