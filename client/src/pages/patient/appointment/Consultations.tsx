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
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  MonetizationOn as PaymentIcon,
  LocationOn as LocationIcon,
  CheckCircleOutline as CheckIcon,
  Notes as NotesIcon,
  BarChart as VitalsIcon,
  KeyboardArrowRight as ArrowIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

const ConsultationDetailsPage = () => {
  // Sample consultation data
  const consultation = {
    id: "APPT-2024-0568",
    date: "February 15, 2025",
    time: "10:30 AM - 11:15 AM",
    status: "Completed",
    patient: {
      name: "Jacob Elordi",
      id: "PT-78965",
      age: 42,
      gender: "Male",
      avatar: "/patient-avatar.jpg",
    },
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Neurologist",
      avatar: "/doctor-avatar.jpg",
    },
    location: "Memorial Health Center, Room 305",
    visitType: "Follow-up",
    chiefComplaint: "Severe headache and dizziness",
    diagnosis: ["Migraine with aura (G43.1)", "Mild dehydration (E86.0)"],
    symptoms: [
      "Throbbing headache",
      "Visual disturbances",
      "Nausea",
      "Sensitivity to light and sound",
    ],
    vitals: {
      bloodPressure: "128/85 mmHg",
      heartRate: "82 bpm",
      temperature: "98.6°F",
      respiration: "16/min",
      oxygenSaturation: "98%",
      weight: "185 lbs",
      height: "6'1\"",
    },
    treatmentPlan: [
      "Continue Sumatriptan 50mg for acute migraine attacks",
      "Start Propranolol 40mg daily for prevention",
      "Increase water intake to at least 2L daily",
      "Maintain regular sleep schedule",
    ],
    prescriptions: [
      {
        name: "Sumatriptan",
        dose: "50mg",
        instructions:
          "Take 1 tablet at onset of migraine, may repeat after 2 hours if needed. Max 2 tablets/24 hrs",
        quantity: "9 tablets",
        refills: 3,
      },
      {
        name: "Propranolol",
        dose: "40mg",
        instructions: "Take 1 tablet daily in the morning",
        quantity: "30 tablets",
        refills: 2,
      },
    ],
    labTests: [
      {
        name: "Complete Blood Count",
        status: "Ordered",
        dueDate: "Feb 22, 2025",
      },
      {
        name: "Comprehensive Metabolic Panel",
        status: "Ordered",
        dueDate: "Feb 22, 2025",
      },
    ],
    followUp: {
      type: "In-person",
      timeframe: "4 weeks",
      date: "March 15, 2025",
      time: "11:00 AM",
    },
    billingInfo: {
      visitCode: "99214",
      copay: "$25.00",
      insuranceBilled: "$175.00",
      paymentStatus: "Paid",
    },
    notes:
      "Patient reports migraine frequency decreased from 3-4 times weekly to 1-2 times weekly since last visit. Current episode began yesterday evening, preceded by visual aura. Patient believes trigger may be work-related stress and skipped meals. Recommended maintaining migraine diary to identify patterns.",
  };

  const sectionStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    height: "100%",
  };

  const sectionHeaderStyle = {
    backgroundColor: "#f5f5f5",
    p: 2,
    display: "flex",
    alignItems: "center",
  };

  const sectionContentStyle = {
    p: 2,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header with back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button startIcon={<BackIcon />} variant="outlined" sx={{ mr: 2 }}>
          Back to Appointments
        </Button>
        <Typography variant="h4" component="h1">
          Consultation Details
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<PrintIcon />} variant="outlined" sx={{ mr: 1 }}>
          Print
        </Button>
        <Button startIcon={<ShareIcon />} variant="outlined">
          Share
        </Button>
      </Box>

      {/* Appointment Summary */}
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid #e0e0e0", mb: 4, borderRadius: 2 }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">{consultation.date}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Time
                </Typography>
                <Typography variant="body1">{consultation.time}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Appointment ID
                </Typography>
                <Typography variant="body1">{consultation.id}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Chip
                label={consultation.status}
                color="success"
                icon={<CheckIcon />}
                sx={{ fontWeight: "medium" }}
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
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Patient & Provider Information
              </Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Avatar
                      src={consultation.patient.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {consultation.patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {consultation.patient.gender},{" "}
                        {consultation.patient.age} years
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {consultation.patient.id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Avatar
                      src={consultation.doctor.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {consultation.doctor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {consultation.doctor.specialty}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <LocationIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {consultation.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <AssignmentIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Visit Type: {consultation.visitType}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Vitals */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <VitalsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Vital Signs</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Blood Pressure
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.bloodPressure}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Heart Rate
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.heartRate}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Temperature
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.temperature}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Respiration
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.respiration}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    O2 Saturation
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.oxygenSaturation}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.weight}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Height
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consultation.vitals.height}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Chief Complaint and Symptoms */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <HospitalIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Chief Complaint & Symptoms</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Typography variant="subtitle2" color="text.secondary">
                Chief Complaint
              </Typography>
              <Typography variant="body1" paragraph>
                {consultation.chiefComplaint}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Symptoms
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {consultation.symptoms.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" color="text.secondary" mt={2}>
                Diagnosis
              </Typography>
              <List disablePadding>
                {consultation.diagnosis.map((diagnosis, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <ArrowIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={diagnosis} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Grid>

        {/* Treatment Plan */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Treatment Plan</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <List>
                {consultation.treatmentPlan.map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Grid>

        {/* Prescriptions */}
        <Grid item xs={12}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <MedicationIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Prescriptions</Typography>
            </Box>
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Instructions</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Refills</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultation.prescriptions.map((prescription, index) => (
                    <TableRow key={index}>
                      <TableCell>{prescription.name}</TableCell>
                      <TableCell>{prescription.dose}</TableCell>
                      <TableCell>{prescription.instructions}</TableCell>
                      <TableCell>{prescription.quantity}</TableCell>
                      <TableCell>{prescription.refills}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Lab Tests */}
        <Grid item xs={12} md={6}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Ordered Tests</Typography>
            </Box>
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultation.labTests.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={test.status}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{test.dueDate}</TableCell>
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
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Follow-up Appointment</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Follow-up Type
                  </Typography>
                  <Typography variant="body1">
                    {consultation.followUp.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Timeframe
                  </Typography>
                  <Typography variant="body1">
                    {consultation.followUp.timeframe}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {consultation.followUp.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {consultation.followUp.time}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button variant="contained" color="primary">
                    Confirm Follow-up Appointment
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Clinical Notes */}
        <Grid item xs={12}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <NotesIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Clinical Notes</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {consultation.notes}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Billing Information */}
        <Grid item xs={12}>
          <Box sx={sectionStyle}>
            <Box sx={sectionHeaderStyle}>
              <PaymentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Billing Information</Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Visit Code
                  </Typography>
                  <Typography variant="body1">
                    {consultation.billingInfo.visitCode}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Co-pay
                  </Typography>
                  <Typography variant="body1">
                    {consultation.billingInfo.copay}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Insurance Billed
                  </Typography>
                  <Typography variant="body1">
                    {consultation.billingInfo.insuranceBilled}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={consultation.billingInfo.paymentStatus}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsultationDetailsPage;
