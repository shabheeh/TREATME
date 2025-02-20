import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem
} from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Delete } from "@mui/icons-material";
import {
  IHealthHistory,
  IMedication
} from "../../../types/patient/health.types";
import { useForm, Controller } from "react-hook-form";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from "sonner";
import ConfirmActionModal from "../../basics/ConfirmActionModal";
import { transitionStyles } from "../../../utils/viewTransition";
import { useViewTransition } from "../../../hooks/viewTransitionHook";

interface MedicationsProps {
  medications: IMedication[];
  onUpdate: (healthHistory: IHealthHistory) => void;
}

const frequencyOptions = ["Once a day", "Twice a day", "Three times a day"];

const Medications: React.FC<MedicationsProps> = ({ medications, onUpdate }) => {
  const [showMedicationInputs, setShowMedicationInputs] = useState(
    medications.length > 0
  );
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [medicationToRemove, setMedicationToRemove] =
    useState<IMedication | null>(null);

  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const { withTransition } = useViewTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IMedication>({
    defaultValues: {
      name: "",
      frequency: "",
      reportedBy: "Self Reported"
    }
  });

  const updateMedications = async (updatedMedications: IMedication[]) => {
    if (!currentPatient?._id) {
      toast.error("Something went wrong");
      return;
    }

    setLoading(true);
    try {
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        "medications",
        updatedMedications
      );
      onUpdate(result);

      toast.success("Medications updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const toggleMedicationInputs = () => {
    withTransition(() => {
      setShowMedicationInputs(!showMedicationInputs);
    });
  };

  const onSubmit = (data: IMedication) => {
    withTransition(async () => {
      const updatedMedications = [...medications, data];
      await updateMedications(updatedMedications);
      reset();
    });
  };

  const handleRemoveMedication = () => {
    if (!medicationToRemove) return;
    withTransition(async () => {
      const updatedMedications = medications.filter(
        (med) => med._id !== medicationToRemove._id
      );
      await updateMedications(updatedMedications);
    });
  };

  return (
    <>
      <style>{transitionStyles}</style>
      <Box
        sx={{ width: "90%", mb: 2 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {medications.length === 0 && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you currently taking any medication?
          </Typography>
        )}

        {medications.length === 0 && (
          <Stack direction="row" spacing={2}>
            <Button
              variant={showMedicationInputs ? "contained" : "outlined"}
              startIcon={
                showMedicationInputs ? (
                  <CheckCircle />
                ) : (
                  <RadioButtonUnchecked />
                )
              }
              onClick={toggleMedicationInputs}
            >
              Yes
            </Button>

            <Button
              variant={showMedicationInputs ? "outlined" : "contained"}
              startIcon={
                showMedicationInputs ? (
                  <RadioButtonUnchecked />
                ) : (
                  <CheckCircle />
                )
              }
              onClick={toggleMedicationInputs}
            >
              No
            </Button>
          </Stack>
        )}

        {showMedicationInputs && (
          <Box sx={{ width: "100%", my: 2 }}>
            {medications.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "18px", mb: 4 }}>
                  My medications
                </Typography>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    pb: 1,
                    pt: 0,
                    backgroundColor: "#F5F5F5"
                  }}
                >
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Medications
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
                  <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Remove
                    </Typography>
                  </Grid>
                </Grid>
                {medications.map((medication, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      py: 1,
                      viewTransitionName: `medication-${medication._id}`
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography variant="body1">{medication.name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">
                        {medication.frequency}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">
                        {medication.reportedBy}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => {
                          setMedicationToRemove(medication);
                          setModalOpen(true);
                        }}
                      >
                        <Delete sx={{ color: "#ff4444" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}

            {medications.length > 0 && (
              <Typography sx={{ fontWeight: 600 }}>
                Add new Medication
              </Typography>
            )}

            <Box
              sx={{
                viewTransitionName: "medication-form"
              }}
            >
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  {...register("name", {
                    required: "Name is required"
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
                    required: "Frequency is required"
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
                    height: "50px",
                    backgroundColor: "#05998c",
                    "&:hover": {
                      backgroundColor: "#008080"
                    }
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
    </>
  );
};

export default Medications;
