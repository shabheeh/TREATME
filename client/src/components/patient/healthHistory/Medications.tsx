import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, MenuItem } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";


const Medications = () => {

      const [showMedicationInputs, setShowMedicationInputs] = useState(false);


    return (
        <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.87)' }}>
          Are you currently taking any medication?
        </Typography>
        
        
          <Stack direction="row" spacing={2}>
            <Button 
              variant={showMedicationInputs ? "contained" : 'outlined'}
              startIcon={ showMedicationInputs ? <CheckCircle /> : <RadioButtonUnchecked />}
              onClick={() => setShowMedicationInputs(true)}
              
            >
              Yes
            </Button>
  
            <Button
              variant={showMedicationInputs ? "outlined" : 'contained'}
              startIcon={ showMedicationInputs ? <RadioButtonUnchecked /> : <CheckCircle />}
              onClick={() => setShowMedicationInputs(false)}
              
            >
              No
            </Button>
          </Stack>
  
        { showMedicationInputs && 
            <Stack spacing={2} sx={{ width: '100%', my: 5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                 
                    placeholder="E.g. Asprin, Paracetamol"
                    label="Medication"
                    variant="outlined"
                    sx={{
                        width: '50%'
                    }}
                />
                <TextField
                    select
                    placeholder="E.g. Once a day"
                    label="Frequency"
                    variant="outlined"
                    sx={{
                        width: '30%'
                    }}
                >
                  <MenuItem value='Once a day'>Once a day</MenuItem>
                  <MenuItem value='Twice a day'>Twice a day</MenuItem>
                  <MenuItem value='Thrice a day'>Thrice a day</MenuItem>

                </TextField>
                <Button
                    
                    variant="contained"
                    sx={{
                        borderRadius: '50px',
                        width: '20%',
                        backgroundColor: '#05998c',
                        '&:hover': {
                            backgroundColor: '#008080'
                        }
                    }}
                >
                    Save
                </Button>
                </Box>
            </Stack>
        }
  
      </Box>
    )
}

export default Medications


