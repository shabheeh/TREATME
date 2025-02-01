import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, MenuItem, Grid, IconButton } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";

interface Medication {
  name: string;
  frequency: string;
  source: string;
}

interface MedicationsProps {
  medications: Medication[];
  // onMedicationsChange: (medications: Medication[]) => void;
}

const Medications: React.FC<MedicationsProps> = ({ medications }) => {
  const [showMedicationInputs, setShowMedicationInputs] = useState(medications.length > 0);
  const [newMedication, setNewMedication] = useState<Medication>({ name: "", frequency: "", source: "" });

  // const handleAddMedication = () => {
  //   if (newMedication.name && newMedication.frequency) {
  //     const updatedMedications = [...medications, newMedication];
  //     onMedicationsChange(updatedMedications);
  //     setNewMedication({ name: "", frequency: "", source: "Self Reported", status: "Yes" });
  //   }
  // };

  // const handleRemoveMedication = (index: number) => {
  //   const updatedMedications = medications.filter((_, i) => i !== index);
  //   onMedicationsChange(updatedMedications);
  // };

  return (
    <Box sx={{ width: "90%", mb: 2 }}>
      
      { medications.length === 0 && 
      <Typography variant="body1" sx={{ mb: 2, }}>
      Are you currently taking any medication?
      </Typography>
      }

      {medications.length === 0 && (
        <Stack direction="row" spacing={2}>
          <Button
            variant={showMedicationInputs ? "contained" : "outlined"}
            startIcon={showMedicationInputs ? <CheckCircle /> : <RadioButtonUnchecked />}
            onClick={() => setShowMedicationInputs(true)}
          >
            Yes
          </Button>

          <Button
            variant={showMedicationInputs ? "outlined" : "contained"}
            startIcon={showMedicationInputs ? <RadioButtonUnchecked /> : <CheckCircle />}
            onClick={() => setShowMedicationInputs(false)}
          >
            No
          </Button>
        </Stack>
      )}

      {showMedicationInputs && (
        <Box sx={{ width: "100%", my: 2 }}>
          {medications.length > 0 && (
            <Box sx={{ mb: 3 }}>
        
              <Grid container spacing={2} sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, pt:0,  backgroundColor: "#F5F5F5", textAlign: 'center' }}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Medication
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Frequency
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Source
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Remove
                  </Typography>
                </Grid>
              </Grid>
              {medications.map((medication, index) => (
                <Grid container spacing={2} key={index} sx={{ borderBottom: "1px solid #e0e0e0",  py: 1, textAlign: 'center' }}>
                  <Grid item xs={4}>
                    <Typography variant="body1">{medication.name}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{medication.frequency}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{medication.source}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => handleRemoveMedication(index)}>
                      <Delete sx={{ color: "#ff4444" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <TextField
              placeholder="E.g. Aspirin, Paracetamol"
              label="Medication"
              variant="outlined"
              value={newMedication.name}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              sx={{ width: "50%" }}
            />
            <TextField
              select
              placeholder="E.g. Once a day"
              label="Frequency"
              variant="outlined"
              value={newMedication.frequency}
              onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
              sx={{ width: "30%" }}
            >
              <MenuItem value="Once a day">Once a day</MenuItem>
              <MenuItem value="Twice a day">Twice a day</MenuItem>
              <MenuItem value="Thrice a day">Thrice a day</MenuItem>
            </TextField>
            <Button
              variant="contained"
              // onClick={handleAddMedication}
              sx={{
                borderRadius: "50px",
                width: "20%",
                backgroundColor: "#05998c",
                "&:hover": {
                  backgroundColor: "#008080",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Medications;