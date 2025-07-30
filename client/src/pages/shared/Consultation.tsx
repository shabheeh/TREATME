import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
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
  MenuItem,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  CheckCircleOutline as CheckIcon,
  Notes as NotesIcon,
  // Print as PrintIcon,
  // Share as ShareIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import {
  IConsultation,
  IConsultationPopulated,
  IPrescription,
} from "../../types/consultations/consultation.types";
import { calculateAge } from "../../helpers/ageCalculator";
import { useLocation, useNavigate } from "react-router-dom";
import consultationService from "../../services/consultations/consultationService";
import { toast } from "sonner";
import { formatMonthDay, formatTime, getDayName } from "../../utils/dateUtils";
import SecureAvatar from "../../components/basics/SecureAvatar";
import healthProfileService from "../../services/healthProfile/healthProfileServices";

type EditableConsultationFields = {
  symptoms: string[];
  prescriptions: IPrescription[];
  diagnosis: string;
  notes: string;
  followUp: {
    required: boolean;
    timeFrame?: string;
  };
};

const frequencyOptions = ["Once a day", "Twice a day", "Three times a day"];

const Consultation: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.role);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [consultation, setConsultation] =
    useState<IConsultationPopulated | null>(null);

  const [editData, setEditData] = useState<EditableConsultationFields>({
    symptoms: consultation?.symptoms || [""],
    prescriptions: consultation?.prescriptions || [],
    diagnosis: consultation?.diagnosis || "",
    notes: consultation?.notes || "",
    followUp: consultation?.followUp || { required: false },
  });

  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state.appointmentId;
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!appointmentId) {
      return;
    }
    const fetchConsultation = async () => {
      try {
        const consultation =
          await consultationService.getConsultationByAppointmentId(
            appointmentId
          );
        setConsultation(consultation);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    };
    fetchConsultation();
  }, [appointmentId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: boolean } = {};

    const hasValidSymptom = editData.symptoms.some(
      (symptom) => symptom.trim() !== ""
    );
    if (!hasValidSymptom) {
      newErrors.symptoms = true;
    }

    if (!editData.diagnosis.trim()) {
      newErrors.diagnosis = true;
    }

    editData.prescriptions.forEach((prescription, index) => {
      if (prescription.name.trim() || prescription.frequency.trim()) {
        if (!prescription.name.trim()) {
          newErrors[`prescription_name_${index}`] = true;
        }
      }
    });

    // Check follow-up timeframe if required
    // if (
    //   consultationData.followUp.required &&
    //   !consultationData.followUp.timeFrame.trim()
    // ) {
    //   newErrors.followUpTimeFrame = true;
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (): void => {
    if (!consultation) return;

    const editableFields: EditableConsultationFields = {
      symptoms: consultation.symptoms || [],
      prescriptions: consultation.prescriptions || [],
      diagnosis: consultation.diagnosis || "",
      followUp: consultation.followUp || { required: false },
      notes: consultation.notes || "",
    };

    setEditData(editableFields);
    setIsEditing(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!consultation || !editData) return;

      let payload: Partial<IConsultation> = {
        ...editData,
      };

      if (validateForm()) {
        payload = {
          ...editData,
          symptoms: editData.symptoms.filter(
            (symptom) => symptom.trim() !== ""
          ),
          prescriptions: editData.prescriptions.filter(
            (prescription) =>
              prescription.name.trim() && prescription.frequency.trim()
          ),
        };
      }

      const updated = await consultationService.updateConsultation(
        consultation.id,
        payload
      );

      setConsultation(updated);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = (): void => {
    if (!consultation) return;

    const editableFields: EditableConsultationFields = {
      symptoms: consultation.symptoms || [],
      prescriptions: consultation.prescriptions || [],
      diagnosis: consultation.diagnosis || "",
      followUp: consultation.followUp || { required: false },
      notes: consultation.notes || "",
    };

    setEditData(editableFields);
    setIsEditing(true);
    setIsEditing(false);
  };

  const addPrescription = (): void => {
    if (!editData || !consultation) return;
    setEditData({
      ...editData,
      prescriptions: [
        ...(editData.prescriptions ?? []),
        {
          name: "",
          frequency: "",
          reportedBy: `Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
        },
      ],
    });
  };

  const removePrescription = (index: number): void => {
    if (!editData?.prescriptions) return;
    const newPrescriptions = editData.prescriptions.filter(
      (_, i) => i !== index
    );
    setEditData({ ...editData, prescriptions: newPrescriptions });
  };

  const updatePrescription = (
    index: number,
    field: keyof IPrescription,
    value: string
  ): void => {
    if (!editData?.prescriptions) return;
    const newPrescriptions = [...editData.prescriptions];
    newPrescriptions[index][field] = value;
    setEditData({ ...editData, prescriptions: newPrescriptions });
  };

  const addSymptom = (): void => {
    if (!editData) return;
    setEditData({
      ...editData,
      symptoms: [...(editData.symptoms ?? []), ""],
    });
  };

  const removeSymptom = (index: number): void => {
    if (!editData?.symptoms) return;
    const newSymptoms = editData.symptoms.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      symptoms: newSymptoms,
    });
  };

  const updateSymptom = (index: number, value: string): void => {
    if (!editData?.symptoms) return;
    const newSymptoms = [...editData.symptoms];
    newSymptoms[index] = value;
    setEditData({
      ...editData,
      symptoms: newSymptoms,
    });
    if (errors.symptoms && value.trim()) {
      const newErrors = { ...errors };
      delete newErrors.symptoms;
      setErrors(newErrors);
    }
  };

  const handleAddMedication = async (data: IPrescription) => {
    if (!consultation) return;
    try {
      await healthProfileService.addMedication(consultation.patient.id, data);
      toast.success("Medication added to current medications");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const sectionStyle = {
    border: "1px solid #e0f2f1",
    borderRadius: 2,
    overflow: "hidden",
    height: "100%",
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

  const tealColor = "#009688";

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header with back button and role toggle */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          onClick={handleBack}
          startIcon={<BackIcon />}
          variant="outlined"
          sx={{ mr: 2, borderColor: tealColor, color: tealColor }}
        >
          Back to Appointments
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: tealColor }}>
          Consultation Details
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        {userRole === "doctor" && (
          <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
            {!isEditing ? (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEdit}
                variant="outlined"
                sx={{ borderColor: tealColor, color: tealColor }}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  variant="contained"
                  sx={{ bgcolor: tealColor }}
                >
                  Save
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        )}

        {/* <Button
          startIcon={<PrintIcon />}
          variant="outlined"
          sx={{ mr: 1, borderColor: tealColor, color: tealColor }}
        >
          Print
        </Button>
        <Button
          startIcon={<ShareIcon />}
          variant="outlined"
          sx={{ borderColor: tealColor, color: tealColor }}
        >
          Share
        </Button> */}
      </Box>

      {/* Appointment Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${tealColor}20`,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon sx={{ color: tealColor, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {formatMonthDay(consultation?.appointment.date || new Date())}{" "}
                  {getDayName(consultation?.appointment.date || new Date())}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ color: tealColor, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Time
                </Typography>
                <Typography variant="body1">
                  {formatTime(consultation?.appointment.date || new Date())}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AssignmentIcon sx={{ color: tealColor, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Appointment ID
                </Typography>
                <Typography variant="body1">
                  {consultation?.appointment.appointmentId}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Chip
                label={consultation?.appointment.status}
                sx={{
                  bgcolor: `${tealColor}20`,
                  color: tealColor,
                  fontWeight: "medium",
                }}
                icon={<CheckIcon sx={{ color: `${tealColor} !important` }} />}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Patient and Doctor Info */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Patient & Provider Information
                </Typography>
              </Box>
            </Box>
            <Box sx={sectionContentStyle}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <SecureAvatar
                      publicId={consultation?.patient.imagePublicId}
                      sx={{ width: 56, height: 56, mr: 2, bgcolor: tealColor }}
                    >
                      {consultation?.patient.firstName.charAt(0)}
                    </SecureAvatar>
                    <Box>
                      <Typography variant="h6">
                        {consultation?.patient.firstName}{" "}
                        {consultation?.patient.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {/* {consultation?.patient.gender},{" "} */}
                        {calculateAge(
                          consultation?.patient.dateOfBirth ||
                            new Date().toString()
                        )}{" "}
                        years
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gender: {consultation?.patient.gender}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <SecureAvatar
                      publicId={consultation?.doctor.imagePublicId}
                      sx={{ width: 56, height: 56, mr: 2, bgcolor: tealColor }}
                    >
                      {consultation?.doctor.firstName.charAt(0)}
                    </SecureAvatar>
                    <Box>
                      <Typography variant="h6">
                        {consultation?.doctor.firstName}{" "}
                        {consultation?.doctor.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {consultation?.doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Symptoms */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HospitalIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Symptoms
                </Typography>
              </Box>
              {userRole === "doctor" && (
                <Box>
                  {isEditing ? (
                    <IconButton
                      size="small"
                      onClick={addSymptom}
                      sx={{ color: tealColor }}
                    >
                      <AddIcon />
                    </IconButton>
                  ) : null}
                </Box>
              )}
            </Box>
            <Box sx={sectionContentStyle}>
              {isEditing && userRole === "doctor" ? (
                <Box>
                  {editData?.symptoms.map((symptom, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        value={symptom}
                        onChange={(e) => updateSymptom(index, e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeSymptom(index)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {consultation?.symptoms.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      size="small"
                      sx={{
                        bgcolor: `${tealColor}10`,
                        color: tealColor,
                        border: `1px solid ${tealColor}30`,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Diagnosis */}
        <Grid item xs={12}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AssignmentIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Diagnosis
                </Typography>
              </Box>
            </Box>
            <Box sx={sectionContentStyle}>
              {isEditing && userRole === "doctor" ? (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editData?.diagnosis}
                  onChange={(e) =>
                    setEditData({ ...editData, diagnosis: e.target.value })
                  }
                  placeholder="Enter diagnosis..."
                />
              ) : (
                <Typography variant="body1">
                  {consultation?.diagnosis || "No diagnosis recorded"}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Prescriptions */}
        <Grid item xs={12}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MedicationIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Prescriptions
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {userRole === "doctor" && isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addPrescription}
                    size="small"
                    sx={{ color: tealColor }}
                  >
                    Add
                  </Button>
                )}
              </Box>
            </Box>
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: `${tealColor}08` }}>
                    <TableCell sx={{ fontWeight: 600 }}>Medication</TableCell>
                    {/* <TableCell sx={{ fontWeight: 600 }}>Dosage</TableCell> */}
                    <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reported By</TableCell>
                    {userRole === "patient" && (
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    )}
                    {isEditing && userRole === "doctor" && (
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(isEditing
                    ? (editData?.prescriptions ?? [])
                    : (consultation?.prescriptions ?? [])
                  ).map((prescription, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {isEditing && userRole === "doctor" ? (
                          <TextField
                            size="small"
                            value={prescription.name}
                            onChange={(e) =>
                              updatePrescription(index, "name", e.target.value)
                            }
                            placeholder="Medication name"
                          />
                        ) : (
                          prescription.name
                        )}
                      </TableCell>
                      {/* <TableCell>
                        {isEditing && userRole === "doctor" ? (
                          <TextField
                            size="small"
                            value={prescription.Dosage}
                            onChange={(e) =>
                              updatePrescription(
                                index,
                                "Dosage",
                                e.target.value
                              )
                            }
                            placeholder="Dosage"
                          />
                        ) : (
                          prescription.Dosage
                        )}
                      </TableCell> */}
                      <TableCell>
                        {isEditing && userRole === "doctor" ? (
                          <TextField
                            select
                            label="Frequency"
                            sx={{ width: "100%" }}
                            value={prescription.frequency}
                            onChange={(e) =>
                              updatePrescription(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            placeholder="Frequency"
                          >
                            {frequencyOptions.map((option, idx) => (
                              <MenuItem key={idx} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          prescription.frequency
                        )}
                      </TableCell>
                      <TableCell>{prescription.reportedBy}</TableCell>
                      {userRole === "patient" && (
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ bgcolor: tealColor }}
                            onClick={() => handleAddMedication(prescription)}
                          >
                            Add to My Medication
                          </Button>
                        </TableCell>
                      )}
                      {isEditing && userRole === "doctor" && (
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => removePrescription(index)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Follow-up */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Follow-up
                </Typography>
              </Box>
            </Box>
            <Box sx={sectionContentStyle}>
              {isEditing && userRole === "doctor" ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData?.followUp.required}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              followUp: {
                                ...editData.followUp,
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
                  {editData?.followUp.required && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Timeframe"
                        value={editData.followUp.timeFrame}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            followUp: {
                              ...editData.followUp,
                              timeFrame: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., 2 weeks, 1 month"
                      />
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Required
                    </Typography>
                    <Typography variant="body1">
                      {consultation?.followUp.required ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  {consultation?.followUp.required && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Timeframe
                      </Typography>
                      <Typography variant="body1">
                        {consultation?.followUp.timeFrame}
                      </Typography>
                    </Grid>
                  )}
                  {/* {consultation?.followUp.required && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button variant="contained" sx={{ bgcolor: tealColor }}>
                        Schedule Follow-up Appointment
                      </Button>
                    </Grid>
                  )} */}
                </Grid>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Clinical Notes */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <NotesIcon sx={{ mr: 1, color: tealColor }} />
                <Typography variant="h6" sx={{ color: tealColor }}>
                  Clinical Notes
                </Typography>
              </Box>
            </Box>
            <Box sx={sectionContentStyle}>
              {isEditing && userRole === "doctor" ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editData?.notes}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                  placeholder="Enter clinical notes..."
                />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {consultation?.notes || "No notes recorded"}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Consultation;
