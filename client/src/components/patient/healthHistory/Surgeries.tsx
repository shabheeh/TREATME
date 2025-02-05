import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, Grid, IconButton, MenuItem } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";
import { IHealthHistory, ISurgery } from "../../../types/patient/health.types";
import { useForm, Controller } from "react-hook-form";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from 'sonner';
import ConfirmActionModal from "../../basics/ConfirmActionModal";

interface SurgeriesProps {
  surgeries: ISurgery[];
  onUpdate: (healthHistory: IHealthHistory) => void
}

const generateYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearsOptions = [];
  
    for (let i = 0; i <= 20; i++) {
      yearsOptions.push((currentYear - i).toString());
    }
  
    return yearsOptions;
  };
  
const yearsOptions = generateYearsOptions();


const Surgeries: React.FC<SurgeriesProps> = ({ surgeries, onUpdate  }) => {
  const [showSurgeryInputs, setShowSurgeryInputs] = useState(surgeries.length > 0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [surgeryToRemove, setSurgeryToRemove] = useState<ISurgery | null>(null)
  
  const currentPatient = useSelector((state: RootState) => state.user.currentUser);

  const { 
    register, 
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ISurgery>({
    defaultValues: {
      procedure: '',
      year: '',
      reportedBy: 'Self Reported'
    }
  });

  const updateSurgeries = async (updatedSurgeries: ISurgery[]) => {
    if (!currentPatient?._id) {
      toast.error('No patient selected');
      return;
    }

    setLoading(true);
    try {
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        'surgeries',
        updatedSurgeries
      );
      onUpdate(result)

      toast.success('Medications updated successfully');

    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message)
      }else {
        toast.error('Something went wrong')
      }
    } finally {
      setLoading(false);
      setModalOpen(false)
    }
  };

  const onSubmit = (data: ISurgery) => {
    const updatedSurgeries = [...surgeries, data];
    updateSurgeries(updatedSurgeries);
    reset();
  };

  

  const handleRemoveMedication = () => {
    if(!surgeryToRemove) return
    const updatedSurgeries = surgeries.filter(
      surgery => surgery._id !== surgeryToRemove._id 
    );
    updateSurgeries(updatedSurgeries);
  };


  return (
    <Box sx={{ width: "90%", mb: 2 }}
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    >
      
      { surgeries.length === 0 && 
      <Typography variant="body1" sx={{ mb: 2, }}>
        Have you ever had any surgeries or medical procedures?
      </Typography>
      }

      {surgeries.length === 0 && (
        <Stack direction="row" spacing={2}>
          <Button
            variant={showSurgeryInputs ? "contained" : "outlined"}
            startIcon={showSurgeryInputs ? <CheckCircle /> : <RadioButtonUnchecked />}
            onClick={() => setShowSurgeryInputs(true)}
          >
            Yes
          </Button>

          <Button
            variant={showSurgeryInputs ? "outlined" : "contained"}
            startIcon={showSurgeryInputs ? <RadioButtonUnchecked /> : <CheckCircle />}
            onClick={() => setShowSurgeryInputs(false)}
          >
            No
          </Button>
        </Stack>
      )}

      {showSurgeryInputs && (
        <Box sx={{ width: "100%", my: 2 }}>
          {surgeries.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '18px',  mb: 4 }}>
                    My Surgeries and Procedures
                </Typography>
              <Grid container spacing={2} sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, pt:0,  backgroundColor: "#F5F5F5", }}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Procedures
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    year
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
              {surgeries.map((surgery, index) => (
                <Grid container spacing={2} key={index} sx={{ borderBottom: "1px solid #e0e0e0",  py: 1,  }}>
                  <Grid item xs={4}>
                    <Typography variant="body1">{surgery.procedure}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{surgery.year}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{surgery.reportedBy}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center'}}>
                    <IconButton onClick={() => {
                      setSurgeryToRemove(surgery); 
                      setModalOpen(true)
                      }}>
                      <Delete sx={{ color: "#ff4444" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

            </Box>
          )}

          { surgeries.length > 0 && 
          <Typography sx={{ fontWeight: 600}}>
            Add new Prodedure
          </Typography>
          }

          <Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          
          <TextField
            {...register("procedure", {
              required: "Required",
            })}
            placeholder="E.g. Appendectomy, Cholecystectomy"
            fullWidth
            label="Procedure"
            variant="outlined"
            sx={{ width: "60%" }}
            error={!!errors.procedure}
            helperText={errors.procedure?.message}
          />
          <Controller
            name="year"
            control={control}
            defaultValue=""
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <TextField
                select
                label="Year"
                variant="outlined"
                value={field.value}
                onChange={field.onChange}
                sx={{ width: "20%" }}
                error={!!errors.year}
                helperText={errors.year?.message}
              >
                <MenuItem  value='Not Sure'>
                    Not Sure
                  </MenuItem>
                {yearsOptions.map((option, idx) => (
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
      title="Remove Procedure"
      confirmColor="error"
      handleClose={() => setModalOpen(false)}
      handleConfirm={handleRemoveMedication}
      />
    </Box>
  );
};

export default Surgeries;