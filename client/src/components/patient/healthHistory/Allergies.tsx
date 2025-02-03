import React, { useState } from "react";
import { Box, Typography, Stack, Button, TextField, Grid, IconButton, MenuItem } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";
import { IAllergy, IHealthHistory } from "../../../types/patient/health.types";
import { useForm, Controller } from "react-hook-form";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from 'sonner';
import ConfirmActionModal from "../../basics/ConfirmActionModal";


interface AllergiesProps {
  allergies: IAllergy[];
  onUpdate: (healthHistory: IHealthHistory) => void
}

const severity = [
    'Mild',
    'Moderate',
    'Severe',
    'Not Sure'
];



const Allergies: React.FC<AllergiesProps> = ({ allergies, onUpdate  }) => {
  const [showAllergyInputs, setShowAllergyInputs] = useState(allergies.length > 0);
  const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [allergyToRemove, setAllergyToRemove] = useState<IAllergy | null>(null)
  
  const currentPatient = useSelector((state: RootState) => state.user.currentUser);

  const { 
    register, 
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IAllergy>({
    defaultValues: {
      allergicTo: '',
      Severity: '',
      reaction: ''
    }
  });

  const updateAllegies = async (updatedAllergies: IAllergy[]) => {
    if (!currentPatient?._id) {
      toast.error('No patient selected');
      return;
    }

    setLoading(true);
    try {
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        'allergies',
        updatedAllergies
      );
      onUpdate(result)


      toast.success('Allergies updated successfully');

    } catch (error) {
        if(error instanceof Error) {
            toast.error(error.message)
        }else {
            toast.error('Something went wrong');
        }
    } finally {
      setLoading(false);
      setModalOpen(false)

    }
  };

  const onSubmit = (data: IAllergy) => {
    const updatedAllergies = [...allergies, data];
    updateAllegies(updatedAllergies);
    reset();
  };

  const handleRemoveMedication = () => {
    if (!allergyToRemove) return
    const updatedAllergies = allergies.filter(
      allergy => allergy._id !== allergyToRemove._id
    );
    updateAllegies(updatedAllergies);
  };


  return (
    <Box sx={{ width: "90%", mb: 2 }}
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    >
      
      { allergies.length === 0 && 
      <Typography variant="body1" sx={{ mb: 2, }}>
      Do you have any allergies or sensitivities to drugs?
      </Typography>
      }

      {allergies.length === 0 && (
        <Stack direction="row" spacing={2}>
          <Button
            variant={showAllergyInputs ? "contained" : "outlined"}
            startIcon={showAllergyInputs ? <CheckCircle /> : <RadioButtonUnchecked />}
            onClick={() => setShowAllergyInputs(true)}
          >
            Yes
          </Button>

          <Button
            variant={showAllergyInputs ? "outlined" : "contained"}
            startIcon={showAllergyInputs ? <RadioButtonUnchecked /> : <CheckCircle />}
            onClick={() => setShowAllergyInputs(false)}
          >
            No
          </Button>
        </Stack>
      )}

      {showAllergyInputs && (
        <Box sx={{ width: "100%", my: 2 }}>
          {allergies.length > 0 && (
            <Box sx={{ mb: 3 }}>
        
              <Grid container spacing={2} sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, pt:0,  backgroundColor: "#F5F5F5", textAlign: 'center' }}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Allergic To
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Severity
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Reaction
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Remove
                  </Typography>
                </Grid>
              </Grid>
              {allergies.map((allergy, index) => (
                <Grid container spacing={2} key={index} sx={{ borderBottom: "1px solid #e0e0e0",  py: 1, textAlign: 'center' }}>
                  <Grid item xs={4}>
                    <Typography variant="body1">{allergy.allergicTo}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{allergy.Severity}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">{allergy.reaction}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => {
                        setAllergyToRemove(allergy);
                        setModalOpen(true)
                    }}>
                      <Delete sx={{ color: "#ff4444" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

<Box sx={{ display: "flex", gap: 2, mt: 4 }}>
      <TextField
        {...register("allergicTo", {
          required: "Name is required",
        })}
        placeholder="E.g. Penicillin, amoxicillin"
        fullWidth
        label="Allergic To"
        variant="outlined"
        sx={{ width: "40%" }}
        error={!!errors.allergicTo}
        helperText={errors.allergicTo?.message}
      />
      <Controller
        name="Severity"
        control={control}
        defaultValue=""
        rules={{
          required: "Field is required",
        }}
        render={({ field }) => (
          <TextField
            select
            label="Severity"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            sx={{ width: "20%" }}
            error={!!errors.Severity}
            helperText={errors.Severity?.message}
          >
            {severity.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <TextField
        {...register("reaction", {
          required: "Field is required",
        })}
        placeholder="E.g. Rashes, itchy"
        fullWidth
        label="Reaction"
        variant="outlined"
        sx={{ width: "20%" }}
        error={!!errors.reaction}
        helperText={errors.reaction?.message}
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
      )}
            <ConfirmActionModal 
      open={modalOpen}
      title="Remove Allergy"
      confirmColor="error"
      handleClose={() => setModalOpen(false)}
      handleConfirm={handleRemoveMedication}
      />
    </Box>
  );
};

export default Allergies;