import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, Grid, IconButton, MenuItem } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";
import { IHealthHistory, IMedication } from "../../../types/patient/health.types";
import { useForm, Controller } from "react-hook-form";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from 'sonner';
import ConfirmActionModal from "../../basics/ConfirmActionModal";

interface HealthConditionsProps {
  healthConditions: string[];
  onUpdate: (healthHistory: IHealthHistory) => void
}



const HealthConditions: React.FC<HealthConditionsProps> = ({ healthConditions, onUpdate  }) => {
  const [showMedicationInputs, setShowMedicationInputs] = useState(healthConditions.length > 0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [conditionToRemove, setConditionToRemove] = useState<number | null>(null)
  
  const currentPatient = useSelector((state: RootState) => state.user.currentUser);

  const { 
    register, 
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<{ condtion: string}>({
    defaultValues: {
        condtion: '',

    }
  });

  const updateCoditions = async (updatedConditions: string[]) => {
    if (!currentPatient?._id) {
      toast.error('No patient selected');
      return;
    }

    setLoading(true);
    try {
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        'healthConditions',
        updatedConditions
      );
      onUpdate(result)

      toast.success('Health Condions updated successfully');

    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message)
        } else {
            toast.error('Something went wrong');
        }

    } finally {
      setLoading(false);
      setModalOpen(false)
    }
  };

  const onSubmit = (data: string) => {
    const updatedMedications = [...healthConditions, data];
    updateCoditions(updatedMedications);
    reset();
  };

  

  const handleRemoveCondition = () => {
    if(!conditionToRemove) return
    const updatedConditions = healthConditions.filter(
      (_condition, idx) => idx !== conditionToRemove 
    );
    updateCoditions(updatedConditions);
  };


  return (
    <Box sx={{ width: "90%", mb: 2 }}
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    >
      
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
                    <Typography variant="body1">{medication.reportedBy}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => {
                      setMedicationToRemove(medication); 
                      setModalOpen(true)
                      }}>
                      <Delete sx={{ color: "#ff4444" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

            </Box>
          )}

          { medications.length > 0 && 
          <Typography sx={{ fontWeight: 600}}>
          Add new Medication
        </Typography>
          }

          <Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          
          <TextField
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="E.g. Aspirin, Paracetamol"
            fullWidth
            label="Medication"
            variant="outlined"
            sx={{ width: "50%" }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Controller
            name="frequency"
            control={control}
            defaultValue=""
            rules={{
              required: "Frequency is required",
            }}
            render={({ field }) => (
              <TextField
                select
                label="Frequency"
                variant="outlined"
                value={field.value}
                onChange={field.onChange}
                sx={{ width: "30%" }}
                error={!!errors.frequency}
                helperText={errors.frequency?.message}
              >
                {frequencyOptions.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Button
            type="submit"
            variant="contained"
            loading={loading}
            disabled={loading}
            sx={{
              borderRadius: "50px",
              width: "20%",
              height: '50px',
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
        </Box>
      )}

      <ConfirmActionModal 
      open={modalOpen}
      title="Remove Medication"
      confirmColor="error"
      handleClose={() => setModalOpen(false)}
      handleConfirm={handleRemoveMedication}
      />
    </Box>
  );
};

export default HealthConditions;