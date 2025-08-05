import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  Notes as NotesIcon,
  Event as EventIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  IConsultation,
  IConsultationPopulated,
  IPrescription,
} from "../../../types/consultations/consultation.types";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";
import { calculateAge } from "../../../helpers/ageCalculator";

interface CreateConsultationModalProps {
  consultation: IConsultationPopulated;
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: (consultationData: Partial<IConsultation>) => void;
}

type ConsultationDataType = {
  symptoms: string[];
  prescriptions: IPrescription[];
  diagnosis: string;
  notes: string;
  followUp: {
    required: boolean;
    timeFrame?: string;
  };
};

const ConsultationModal: React.FC<CreateConsultationModalProps> = ({
  open,
  onClose,
  onSave,
  onCancel,
  consultation,
}) => {
  const [consultationData, setConsultationData] =
    useState<ConsultationDataType>({
      symptoms: consultation?.symptoms || [""],
      prescriptions: consultation?.prescriptions || [],
      diagnosis: consultation?.diagnosis || "",
      notes: consultation?.notes || "",
      followUp: consultation?.followUp || { required: false },
    });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const tealColor = "#009688";

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: boolean } = {};

    const hasValidSymptom = consultationData.symptoms.some(
      (symptom) => symptom.trim() !== ""
    );
    if (!hasValidSymptom) {
      newErrors.symptoms = true;
    }

    if (!consultationData.diagnosis.trim()) {
      newErrors.diagnosis = true;
    }

    consultationData.prescriptions.forEach((prescription, index) => {
      if (prescription.name.trim() || prescription.frequency.trim()) {
        if (!prescription.name.trim()) {
          newErrors[`prescription_name_${index}`] = true;
        }
      }
    });

    // if (
    //   consultationData.followUp.required &&
    //   !consultationData.followUp.timeFrame.trim()
    // ) {
    //   newErrors.followUpTimeFrame = true;
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (): void => {
    if (validateForm()) {
      const cleanedData = {
        ...consultationData,
        symptoms: consultationData.symptoms.filter(
          (symptom) => symptom.trim() !== ""
        ),
        prescriptions: consultationData.prescriptions.filter(
          (prescription) =>
            prescription.name.trim() || prescription.frequency.trim()
        ),
      };
      onSave(cleanedData);
      handleCancel();
    }
  };

  const handleCancel = (): void => {
    setConsultationData({
      symptoms: [""],
      prescriptions: [
        { name: "", frequency: "", reportedBy: consultation.doctor.firstName },
      ],
      followUp: {
        required: false,
        timeFrame: "",
      },
      diagnosis: "",
      notes: "",
    });
    setErrors({});
    onCancel();
  };

  const addSymptom = (): void => {
    setConsultationData({
      ...consultationData,
      symptoms: [...consultationData.symptoms, ""],
    });
  };

  const removeSymptom = (index: number): void => {
    if (consultationData.symptoms.length > 1) {
      const newSymptoms = consultationData.symptoms.filter(
        (_, i) => i !== index
      );
      setConsultationData({ ...consultationData, symptoms: newSymptoms });
    }
  };

  const updateSymptom = (index: number, value: string): void => {
    const newSymptoms = [...consultationData.symptoms];
    newSymptoms[index] = value;
    setConsultationData({ ...consultationData, symptoms: newSymptoms });

    if (errors.symptoms && value.trim()) {
      const newErrors = { ...errors };
      delete newErrors.symptoms;
      setErrors(newErrors);
    }
  };

  const addPrescription = (): void => {
    setConsultationData({
      ...consultationData,
      prescriptions: [
        ...consultationData.prescriptions,
        {
          name: "",
          frequency: "",
          reportedBy: `Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
        },
      ],
    });
  };

  const removePrescription = (index: number): void => {
    if (consultationData.prescriptions.length > 1) {
      const newPrescriptions = consultationData.prescriptions.filter(
        (_, i) => i !== index
      );
      setConsultationData({
        ...consultationData,
        prescriptions: newPrescriptions,
      });
    }
  };

  const updatePrescription = (
    index: number,
    field: keyof IPrescription,
    value: string
  ): void => {
    const newPrescriptions = [...consultationData.prescriptions];
    newPrescriptions[index][field] = value;
    setConsultationData({
      ...consultationData,
      prescriptions: newPrescriptions,
    });

    if (
      errors[`prescription_${field.toLowerCase()}_${index}`] &&
      value.trim()
    ) {
      const newErrors = { ...errors };
      delete newErrors[`prescription_${field.toLowerCase()}_${index}`];
      setErrors(newErrors);
    }
  };

  const sectionStyle = {
    border: "1px solid #e0f2f1",
    borderRadius: 2,
    overflow: "hidden",
    mb: 3,
  };

  const sectionHeaderStyle = {
    backgroundColor: "#e0f2f1",
    p: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const sectionContentStyle = {
    p: 2,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: "80vh", maxHeight: "90vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: tealColor,
          color: "white",
          py: 2,
        }}
      >
        <Typography variant="h5" component="div">
          Create Consultation Record
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${tealColor}20`,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Appointment Date
              </Typography>
              <Typography variant="body1">
                {formatMonthDay(consultation.appointment.date)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Time
              </Typography>
              <Typography variant="body1">
                {formatTime(consultation.appointment.date)}
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Visit Type
              </Typography>
              <Typography variant="body1">
                {appointmentInfo.visitType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {appointmentInfo.location}
              </Typography>
            </Grid> */}
          </Grid>
        </Paper>

        {/* Patient and Doctor Info */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="h6" sx={{ color: tealColor }}>
              Patient & Provider Information
            </Typography>
          </Box>
          <Box sx={sectionContentStyle}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={consultation.patient.imagePublicId}
                    sx={{ width: 48, height: 48, mr: 2, bgcolor: tealColor }}
                  >
                    {consultation.patient.firstName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {consultation.patient.firstName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {consultation.patient.gender},{" "}
                      {calculateAge(consultation.patient.dateOfBirth)} years |
                      Gender: {consultation.patient.gender}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={consultation.doctor.imagePublicId}
                    sx={{ width: 48, height: 48, mr: 2, bgcolor: tealColor }}
                  >
                    {consultation.doctor.firstName.charAt(3)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {consultation.doctor.firstName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {consultation.doctor.specialization}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Symptoms */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HospitalIcon sx={{ mr: 1, color: tealColor }} />
              <Typography variant="h6" sx={{ color: tealColor }}>
                Symptoms *
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={addSymptom}
              sx={{ color: tealColor }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={sectionContentStyle}>
            {consultationData.symptoms.map((symptom, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  value={symptom}
                  onChange={(e) => updateSymptom(index, e.target.value)}
                  placeholder="Enter symptom..."
                  error={errors.symptoms && !symptom.trim()}
                  sx={{ mr: 1 }}
                />
                {consultationData.symptoms.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeSymptom(index)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {errors.symptoms && (
              <Typography variant="caption" color="error">
                At least one symptom is required
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Diagnosis */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AssignmentIcon sx={{ mr: 1, color: tealColor }} />
              <Typography variant="h6" sx={{ color: tealColor }}>
                Diagnosis *
              </Typography>
            </Box>
          </Box>
          <Box sx={sectionContentStyle}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={consultationData.diagnosis}
              onChange={(e) => {
                setConsultationData({
                  ...consultationData,
                  diagnosis: e.target.value,
                });
                if (errors.diagnosis && e.target.value.trim()) {
                  const newErrors = { ...errors };
                  delete newErrors.diagnosis;
                  setErrors(newErrors);
                }
              }}
              placeholder="Enter diagnosis with ICD codes if applicable..."
              error={errors.diagnosis}
              helperText={errors.diagnosis ? "Diagnosis is required" : ""}
            />
          </Box>
        </Paper>

        {/* Prescriptions */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MedicationIcon sx={{ mr: 1, color: tealColor }} />
              <Typography variant="h6" sx={{ color: tealColor }}>
                Prescriptions
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              onClick={addPrescription}
              size="small"
              sx={{ color: tealColor }}
            >
              Add Prescription
            </Button>
          </Box>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: `${tealColor}08` }}>
                  <TableCell sx={{ fontWeight: 600 }}>Medication *</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dosage *</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultationData.prescriptions.map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={prescription.name}
                        onChange={(e) =>
                          updatePrescription(index, "name", e.target.value)
                        }
                        placeholder="Medication name"
                        error={errors[`prescription_name_${index}`]}
                      />
                    </TableCell>
                    {/* <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={prescription.Dosage}
                        onChange={(e) =>
                          updatePrescription(index, "Dosage", e.target.value)
                        }
                        placeholder="Dosage"
                        error={errors[`prescription_dosage_${index}`]}
                      />
                    </TableCell> */}
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={prescription.frequency}
                        onChange={(e) =>
                          updatePrescription(index, "frequency", e.target.value)
                        }
                        placeholder="Frequency"
                      />
                    </TableCell>
                    <TableCell>
                      {consultationData.prescriptions.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removePrescription(index)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Follow-up */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon sx={{ mr: 1, color: tealColor }} />
              <Typography variant="h6" sx={{ color: tealColor }}>
                Follow-up
              </Typography>
            </Box>
          </Box>
          <Box sx={sectionContentStyle}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={consultationData.followUp.required}
                      onChange={(e) =>
                        setConsultationData({
                          ...consultationData,
                          followUp: {
                            ...consultationData.followUp,
                            required: e.target.checked,
                          },
                        })
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: tealColor,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: tealColor,
                          },
                      }}
                    />
                  }
                  label="Follow-up Required"
                />
              </Grid>
              {consultationData.followUp.required && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Timeframe *"
                    value={consultationData.followUp.timeFrame}
                    onChange={(e) => {
                      setConsultationData({
                        ...consultationData,
                        followUp: {
                          ...consultationData.followUp,
                          timeFrame: e.target.value,
                        },
                      });
                      if (errors.followUpTimeFrame && e.target.value.trim()) {
                        const newErrors = { ...errors };
                        delete newErrors.followUpTimeFrame;
                        setErrors(newErrors);
                      }
                    }}
                    placeholder="e.g., 2 weeks, 1 month"
                    error={errors.followUpTimeFrame}
                    helperText={
                      errors.followUpTimeFrame
                        ? "Timeframe is required when follow-up is enabled"
                        : ""
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>

        {/* Clinical Notes */}
        <Paper elevation={0} sx={sectionStyle}>
          <Box sx={sectionHeaderStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NotesIcon sx={{ mr: 1, color: tealColor }} />
              <Typography variant="h6" sx={{ color: tealColor }}>
                Clinical Notes
              </Typography>
            </Box>
          </Box>
          <Box sx={sectionContentStyle}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={consultationData.notes}
              onChange={(e) =>
                setConsultationData({
                  ...consultationData,
                  notes: e.target.value,
                })
              }
              placeholder="Enter detailed clinical observations, patient history, recommendations, etc..."
            />
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Button
          onClick={handleCancel}
          startIcon={<CancelIcon />}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          startIcon={<SaveIcon />}
          variant="contained"
          sx={{ bgcolor: tealColor }}
        >
          Save Consultation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultationModal;
