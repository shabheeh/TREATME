import React, { useState } from 'react';
import { 
  Button, 
  Stack, 
  Typography, 
  TextField,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import { 
  RadioButtonUnchecked, 
  CheckCircle,
  Close as CloseIcon 
} from '@mui/icons-material';
import Medications from './Medications';

const HealthHistory = () => {
  const [showAllergyInputs, setShowAllergyInputs] = useState(false);
  
  
  const AllergySection = () => (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.87)' }}>
        Do you have any allergies or drug sensitivities?
      </Typography>
      
      <Stack direction="row" spacing={2}>
        <Button 
          variant="outlined"
          startIcon={<RadioButtonUnchecked />}
          sx={{
            color: 'grey',
            borderColor: 'grey',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'grey'
            }
          }}
        >
          Yes
        </Button>

        <Button
          variant="contained"
          startIcon={<CloseIcon />}
          sx={{
            backgroundColor: '#0078d4',
            '&:hover': {
              backgroundColor: '#106ebe'
            }
          }}
        >
          No
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Medications />
      <Divider />
      <AllergySection />
    </Stack>
  );
};

export default HealthHistory;