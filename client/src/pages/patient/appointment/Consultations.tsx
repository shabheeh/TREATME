import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  LocationOn as LocationIcon,
  CheckCircleOutline as CheckIcon,
  Notes as NotesIcon,
  KeyboardArrowRight as ArrowIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ConsultationDetailsPage = () => {
  // Mock user role - change this to test different views
  const [userRole, setUserRole] = useState("doctor"); // 'doctor' or 'patient'
  const [isEditing, setIsEditing] = useState(false);

  // Sample consultation data based on your schema
  const [consultationData, setConsultationData] = useState({
    _id: "64f8a9b12345678901234567",
    AppoinmentId: "64f8a9b12345678901234568",
    PatientId: "64f8a9b12345678901234569",
    DoctorId: "64f8a9b1234567890123456a",
    Symptoms: ["Severe headache", "Dizziness", "Nausea", "Visual disturbances"],
    Prescriptions: [
      {
        Name: "Sumatriptan",
        Dosage: "50mg",
        Frequency: "As needed for migraine, max 2 tablets/24hrs",
        ReportedBy: "Dr. Sarah Johnson",
      },
      {
        Name: "Propranolol",
        Dosage: "40mg",
        Frequency: "Once daily in the morning",
        ReportedBy: "Dr. Sarah Johnson",
      },
    ],
    FollowUp: {
      Required: true,
      TimeFrame: "4 weeks",
    },
    Diagnosed: "Migraine with aura (G43.1), Mild dehydration (E86.0)",
    Notes:
      "Patient reports migraine frequency decreased since last visit. Current episode began yesterday evening, preceded by visual aura. Patient believes trigger may be work-related stress and skipped meals. Recommended maintaining migraine diary to identify patterns.",
  });

  // Mock patient and doctor data
  const patientInfo = {
    name: "Jacob Elordi",
    id: "PT-78965",
    age: 42,
    gender: "Male",
    avatar: "/patient-avatar.jpg",
  };

  const doctorInfo = {
    name: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    avatar: "/doctor-avatar.jpg",
  };

  const appointmentInfo = {
    date: "February 15, 2025",
    time: "10:30 AM - 11:15 AM",
    status: "Completed",
    location: "Memorial Health Center, Room 305",
    visitType: "Follow-up",
  };

  const [editData, setEditData] = useState({ ...consultationData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...consultationData });
  };

  const handleSave = () => {
    setConsultationData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...consultationData });
    setIsEditing(false);
  };

  const addPrescription = () => {
    setEditData({
      ...editData,
      Prescriptions: [
        ...editData.Prescriptions,
        { Name: "", Dosage: "", Frequency: "", ReportedBy: doctorInfo.name },
      ],
    });
  };

  const removePrescription = (index) => {
    const newPrescriptions = editData.Prescriptions.filter(
      (_, i) => i !== index
    );
    setEditData({ ...editData, Prescriptions: newPrescriptions });
  };

  const updatePrescription = (index, field, value) => {
    const newPrescriptions = [...editData.Prescriptions];
    newPrescriptions[index][field] = value;
    setEditData({ ...editData, Prescriptions: newPrescriptions });
  };

  const addSymptom = () => {
    setEditData({
      ...editData,
      Symptoms: [...editData.Symptoms, ""],
    });
  };

  const removeSymptom = (index) => {
    const newSymptoms = editData.Symptoms.filter((_, i) => i !== index);
    setEditData({ ...editData, Symptoms: newSymptoms });
  };

  const updateSymptom = (index, value) => {
    const newSymptoms = [...editData.Symptoms];
    newSymptoms[index] = value;
    setEditData({ ...editData, Symptoms: newSymptoms });
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

        {/* Role toggle for demo */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            View as:
          </Typography>
          <Button
            variant={userRole === "patient" ? "contained" : "outlined"}
            size="small"
            onClick={() => setUserRole("patient")}
            sx={{
              mr: 1,
              bgcolor: userRole === "patient" ? tealColor : "transparent",
              color: userRole === "patient" ? "white" : tealColor,
            }}
          >
            Patient
          </Button>
          <Button
            variant={userRole === "doctor" ? "contained" : "outlined"}
            size="small"
            onClick={() => setUserRole("doctor")}
            sx={{
              bgcolor: userRole === "doctor" ? tealColor : "transparent",
              color: userRole === "doctor" ? "white" : tealColor,
            }}
          >
            Doctor
          </Button>
        </Box>

        <Button
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
        </Button>
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
                <Typography variant="body1">{appointmentInfo.date}</Typography>
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
                <Typography variant="body1">{appointmentInfo.time}</Typography>
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
                  {consultationData.AppoinmentId}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Chip
                label={appointmentInfo.status}
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
                    <Avatar
                      src={patientInfo.avatar}
                      sx={{ width: 56, height: 56, mr: 2, bgcolor: tealColor }}
                    >
                      {patientInfo.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{patientInfo.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patientInfo.gender}, {patientInfo.age} years
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {patientInfo.id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Avatar
                      src={doctorInfo.avatar}
                      sx={{ width: 56, height: 56, mr: 2, bgcolor: tealColor }}
                    >
                      {doctorInfo.name.charAt(3)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{doctorInfo.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctorInfo.specialty}
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
                  {editData.Symptoms.map((symptom, index) => (
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
                  {consultationData.Symptoms.map((symptom, index) => (
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
                  value={editData.Diagnosed}
                  onChange={(e) =>
                    setEditData({ ...editData, Diagnosed: e.target.value })
                  }
                  placeholder="Enter diagnosis..."
                />
              ) : (
                <Typography variant="body1">
                  {consultationData.Diagnosed || "No diagnosis recorded"}
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
                {userRole === "doctor" && !isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    size="small"
                    sx={{ color: tealColor }}
                  >
                    Edit
                  </Button>
                )}
                {userRole === "doctor" && isEditing && (
                  <>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addPrescription}
                      size="small"
                      sx={{ color: tealColor }}
                    >
                      Add
                    </Button>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: tealColor }}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: `${tealColor}08` }}>
                    <TableCell sx={{ fontWeight: 600 }}>Medication</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dosage</TableCell>
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
                    ? editData.Prescriptions
                    : consultationData.Prescriptions
                  ).map((prescription, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {isEditing && userRole === "doctor" ? (
                          <TextField
                            size="small"
                            value={prescription.Name}
                            onChange={(e) =>
                              updatePrescription(index, "Name", e.target.value)
                            }
                            placeholder="Medication name"
                          />
                        ) : (
                          prescription.Name
                        )}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        {isEditing && userRole === "doctor" ? (
                          <TextField
                            size="small"
                            value={prescription.Frequency}
                            onChange={(e) =>
                              updatePrescription(
                                index,
                                "Frequency",
                                e.target.value
                              )
                            }
                            placeholder="Frequency"
                          />
                        ) : (
                          prescription.Frequency
                        )}
                      </TableCell>
                      <TableCell>{prescription.ReportedBy}</TableCell>
                      {userRole === "patient" && (
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ bgcolor: tealColor }}
                            onClick={() =>
                              alert(
                                `Added ${prescription.Name} to your medications`
                              )
                            }
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
                          checked={editData.FollowUp.Required}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              FollowUp: {
                                ...editData.FollowUp,
                                Required: e.target.checked,
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
                  {editData.FollowUp.Required && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Timeframe"
                        value={editData.FollowUp.TimeFrame}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            FollowUp: {
                              ...editData.FollowUp,
                              TimeFrame: e.target.value,
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
                      {consultationData.FollowUp.Required ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  {consultationData.FollowUp.Required && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Timeframe
                      </Typography>
                      <Typography variant="body1">
                        {consultationData.FollowUp.TimeFrame}
                      </Typography>
                    </Grid>
                  )}
                  {consultationData.FollowUp.Required && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button variant="contained" sx={{ bgcolor: tealColor }}>
                        Schedule Follow-up Appointment
                      </Button>
                    </Grid>
                  )}
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
                  value={editData.Notes}
                  onChange={(e) =>
                    setEditData({ ...editData, Notes: e.target.value })
                  }
                  placeholder="Enter clinical notes..."
                />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {consultationData.Notes || "No notes recorded"}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsultationDetailsPage;
