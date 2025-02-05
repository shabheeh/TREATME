import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, Grid, IconButton } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";
import { IHealthCondition, IHealthHistory } from "../../../types/patient/health.types";
import { useForm } from "react-hook-form";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from 'sonner';
import ConfirmActionModal from "../../basics/ConfirmActionModal";

interface HealthConditionsProps {
  healthConditions: IHealthCondition[];
  onUpdate: (healthHistory: IHealthHistory) => void
}



const HealthConditions: React.FC<HealthConditionsProps> = ({ healthConditions, onUpdate  }) => {
  const [showConditionInputs, setShowConditionInputs] = useState(healthConditions.length > 0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [conditionToRemove, setConditionToRemove] = useState<IHealthCondition | null>(null)
  
  const currentPatient = useSelector((state: RootState) => state.user.currentUser);

  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IHealthCondition>({
    defaultValues: {
        condition: '',
        reportedBy: 'Self Reported'
    }
  });

  const updateCoditions = async (updatedConditions: IHealthCondition[]) => {
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

  const onSubmit = (data: IHealthCondition) => {
    const updatedMedications = [...healthConditions, data];
    updateCoditions(updatedMedications);
    reset();
  };

  

  const handleRemoveCondition = () => {
    if(!conditionToRemove) return
    const updatedConditions = healthConditions.filter(
      (condition) => condition._id !== conditionToRemove._id 
    );
    updateCoditions(updatedConditions);
  };


  return (
    <Box sx={{ width: "90%", mb: 2 }}
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    >
      
      { healthConditions.length === 0 && 
      <Typography variant="body1" sx={{ mb: 2, }}>
      Do you have any health conditions?
      </Typography>
      }

      {healthConditions.length === 0 && (
        <Stack direction="row" spacing={2}>
          <Button
            variant={showConditionInputs ? "contained" : "outlined"}
            startIcon={showConditionInputs ? <CheckCircle /> : <RadioButtonUnchecked />}
            onClick={() => setShowConditionInputs(true)}
          >
            Yes
          </Button>

          <Button
            variant={showConditionInputs ? "outlined" : "contained"}
            startIcon={showConditionInputs ? <RadioButtonUnchecked /> : <CheckCircle />}
            onClick={() => setShowConditionInputs(false)}
          >
            No
          </Button>
        </Stack>
      )}

      {showConditionInputs && (
        <Box sx={{ width: "100%", my: 2 }}>
          {healthConditions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '18px',  mb: 4 }}>
                My Health Conditions
              </Typography>
              <Grid container spacing={2} sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, pt:0,  backgroundColor: "#F5F5F5",  }}>
                <Grid item xs={7}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Conditions
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Source
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center'}}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Remove
                  </Typography>
                </Grid>
              </Grid>
              {healthConditions.map((condition) => (
                <Grid container spacing={2} key={ condition._id} sx={{ borderBottom: "1px solid #e0e0e0",  py: 1,  }}>
                  <Grid item xs={7}>
                    <Typography variant="body1">{ condition.condition }</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{ condition.reportedBy }</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center'}}>
                    <IconButton onClick={() => {
                      setConditionToRemove(condition); 
                      setModalOpen(true)
                      }}>
                      <Delete sx={{ color: "#ff4444" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

            </Box>
          )}

          { healthConditions.length > 0 && 
          <Typography sx={{ fontWeight: 600}}>
            Add other health condition
          </Typography>
          }

          <Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          
          <TextField
            {...register("condition", {
              required: "Required",
            })}
            placeholder="E.g. Blood Pressure, Cholesterol"
            fullWidth
            label="Condition"
            variant="outlined"
            sx={{ width: "80%" }}
            error={!!errors.condition}
            helperText={errors.condition?.message}
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
      title="Remove Condition"
      confirmColor="error"
      handleClose={() => setModalOpen(false)}
      handleConfirm={handleRemoveCondition}
      />
    </Box>
  );
};

export default HealthConditions;