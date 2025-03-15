import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
  Button,
} from "@mui/material";
import {
  Medication as MedicationIcon,
  WarningAmber as AllergiesIcon,
  People as FamilyIcon,
  LocalHospital as MedicalIcon,
  SelfImprovement as LifestyleIcon,
  Edit as EditIcon,
  MoodBad as MentalHealthIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  FitnessCenter as FitnessCenterIcon,
  Healing as HealingIcon,
  Psychology as PsychologyIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { IDependent, IPatient } from "../../types/patient/patient.types";
import {
  IBehaviouralHealth,
  IHealthHistory,
  ILifestyle,
} from "../../types/patient/health.types";
import accountService from "../../services/patient/accountService";
import { calculateAge } from "../../helpers/ageCalculator";
import { formatMonthDay } from "../../utils/dateUtils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

const PatientProfile = () => {
  const location = useLocation();
  const patient = location.state.patient as IPatient | IDependent;
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [healthHistory, setHealtHistory] = useState<IHealthHistory | null>(
    null
  );
  const [behaviouralHealth, setBehaviouralHealth] =
    useState<IBehaviouralHealth | null>(null);
  const [lifestyle, setLifestyle] = useState<ILifestyle | null>(null);

  useEffect(() => {
    if (!patient._id) {
      return;
    }

    const fetchHealtProfile = async () => {
      const result = await accountService.getHealthProfile(patient._id);
      setHealtHistory(result.healthHistory);
      setBehaviouralHealth(result.behaviouralHealth);
      setLifestyle(result.lifestyle);
    };

    fetchHealtProfile();
  }, [patient]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const lifestyleQuestions = [
    {
      id: "doExercise",
      question: "Do you exercise regularly (at least 3 times a week)?",
      answer:
        lifestyle && lifestyle.doExercise !== undefined
          ? lifestyle.doExercise
          : null,
    },
    {
      id: "sleepSevenPlusHrs",
      question: "Do you get at least 7 hours of sleep most nights?",
      answer:
        lifestyle && lifestyle.sleepSevenPlusHrs !== undefined
          ? lifestyle.sleepSevenPlusHrs
          : null,
    },
    {
      id: "doSmoke",
      question: "Do you smoke or use tobacco products?",
      answer:
        lifestyle && lifestyle.doSmoke !== undefined ? lifestyle.doSmoke : null,
    },
    {
      id: "doAlcohol",
      question: "Do you consume alcohol more than twice a week?",
      answer:
        lifestyle && lifestyle.doAlcohol !== undefined
          ? lifestyle.doAlcohol
          : null,
    },
    {
      id: "followDietPlan",
      question: "Do you follow a balanced diet with fruits and vegetables?",
      answer:
        lifestyle && lifestyle.followDietPlan !== undefined
          ? lifestyle.followDietPlan
          : null,
    },
    {
      id: "highStress",
      question: "Do you regularly experience high levels of stress?",
      answer:
        lifestyle && lifestyle.highStress !== undefined
          ? lifestyle.highStress
          : null,
    },
    {
      id: "doMeditate",
      question: "Do you practice meditation or mindfulness?",
      answer:
        lifestyle && lifestyle.doMeditate !== undefined
          ? lifestyle.doMeditate
          : null,
    },
    {
      id: "vaccinatedCovid19",
      question: "Have you been vaccinated against COVID-19?",
      answer:
        lifestyle && lifestyle.vaccinatedCovid19 !== undefined
          ? lifestyle.vaccinatedCovid19
          : null,
    },
  ];

  const renderAnswer = (answer: boolean | null) => {
    if (answer === null)
      return <Chip size="small" label="No data" color="default" />;
    return answer ? (
      <Chip size="small" label="Yes" color="success" />
    ) : (
      <Chip size="small" label="No" color="error" />
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ mb: 2, flexGrow: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Paper
          elevation={3}
          sx={{ mb: 4, overflow: "hidden", borderRadius: 2 }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Avatar
              src={patient.profilePicture}
              sx={{
                width: 100,
                height: 100,
                border: "3px solid white",
                mb: { xs: 2, sm: 0 },
                mr: { sm: 3 },
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mr: 2 }}
                >
                  {patient.firstName} {patient.lastName}
                </Typography>
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                {calculateAge(patient.dateOfBirth)} years • {patient.gender}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Chip
                  label={`DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
                {/* <Chip
                  label={`Insurance: ${patient.phone ? patient.phone : 'null'}`}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                /> */}
                <Chip
                  label={`PCP: ${patient.email}`}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="patient profile tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  minHeight: "64px",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            >
              <Tab
                icon={<MedicationIcon />}
                label="Medications"
                {...a11yProps(0)}
              />
              <Tab
                icon={<AllergiesIcon />}
                label="Allergies"
                {...a11yProps(1)}
              />
              <Tab
                icon={<FamilyIcon />}
                label="Family History"
                {...a11yProps(2)}
              />
              <Tab
                icon={<MedicalIcon />}
                label="Medical Conditions"
                {...a11yProps(3)}
              />
              <Tab
                icon={<LifestyleIcon />}
                label="Lifestyle"
                {...a11yProps(4)}
              />
              <Tab
                icon={<MentalHealthIcon />}
                label="Behavioral Health"
                {...a11yProps(5)}
              />
            </Tabs>

            {/* Tab Content Panels */}
            <Box sx={{ px: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Current Medications
                </Typography>
                <Grid container spacing={3}>
                  {healthHistory?.medications.map((medication, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            gutterBottom
                          >
                            {medication.name}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {/* <strong>Dosage:</strong> {medication.dosage} */}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            <strong>Frequency:</strong> {medication.frequency}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {/* <strong>Purpose:</strong> {medication.purpose} */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Allergies
                </Typography>
                <Grid container spacing={3}>
                  {healthHistory?.allergies.map((allergy, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary.main">
                              {allergy.allergicTo}
                            </Typography>
                            <Chip
                              label={allergy.severity}
                              size="small"
                              color={
                                allergy.severity === "Severe"
                                  ? "error"
                                  : allergy.severity === "Moderate"
                                    ? "warning"
                                    : "success"
                              }
                            />
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Reaction:</strong> {allergy.reaction}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Family History
                </Typography>
                <List>
                  {healthHistory?.familyHistory.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <FamilyIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.condition}
                          secondary={`Relation: ${item.relationship}`}
                        />
                      </ListItem>
                      {index < healthHistory?.familyHistory.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Medical Conditions
                </Typography>
                <Grid container spacing={3}>
                  {healthHistory?.healthConditions.map((condition, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            gutterBottom
                          >
                            {condition.condition}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          {/* <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            <strong>Diagnosis Date:</strong>{" "}
                            {new Date(
                              condition.diagnosisDate
                            ).toLocaleDateString()}
                          </Typography> */}
                          {/* <Typography variant="body2" color="text.secondary">
                            <strong>Status:</strong> {condition.status}
                          </Typography> */}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={4}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Lifestyle Assessment
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          sx={{ mb: 2 }}
                        >
                          Health Questionnaire
                        </Typography>
                        <Grid container spacing={2}>
                          {lifestyleQuestions.map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  {item.question}
                                </Typography>
                                {renderAnswer(item.answer as boolean | null)}
                              </Box>
                              {index < lifestyleQuestions.length - 1 && (
                                <Divider sx={{ my: 1 }} />
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          gutterBottom
                        >
                          Diet & Exercise
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          <strong>Diet:</strong> {patient.lifestyle.diet}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Exercise:</strong>{" "}
                          {patient.lifestyle.exercise}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid> */}

                  {/* <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          gutterBottom
                        >
                          Habits & Risk Factors
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          <strong>Smoking:</strong> {patient.lifestyle.smoking}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          <strong>Alcohol:</strong> {patient.lifestyle.alcohol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Sleep:</strong> {patient.lifestyle.sleep}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid> */}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={5}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Behavioral Health Assessment
                </Typography>

                {behaviouralHealth ? (
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PsychologyIcon />
                      </ListItemIcon>
                      {/* <ListItemText
                    primary="Mental Health Conditions"
                    secondary={
                      behaviouralHealth?.conditions?.length > 0
                        ? behaviouralHealth.conditions.join(", ")
                        : "None recorded"
                    }
                  /> */}
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                              Anxiety
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 1,
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((level) => (
                                <Box
                                  key={level}
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    mx: 0.5,
                                    bgcolor:
                                      level <= behaviouralHealth.anxietyLevel
                                        ? "warning.main"
                                        : "grey.300",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                              Depression
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 1,
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((level) => (
                                <Box
                                  key={level}
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    mx: 0.5,
                                    bgcolor:
                                      level <= behaviouralHealth.depressionLevel
                                        ? "error.main"
                                        : "grey.300",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                              Stress
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 1,
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((level) => (
                                <Box
                                  key={level}
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    mx: 0.5,
                                    bgcolor:
                                      level <= behaviouralHealth.stressLevel
                                        ? "info.main"
                                        : "grey.300",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Episode Date"
                        secondary={
                          behaviouralHealth.lastEpisodeDate &&
                          formatMonthDay(behaviouralHealth.lastEpisodeDate)
                        }
                      />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <HealingIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Therapy Status"
                        secondary={behaviouralHealth.therapyStatus}
                      />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <FitnessCenterIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Coping Mechanisms"
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {behaviouralHealth.copingMechanisms.map(
                              (mechanism, idx) => (
                                <Chip
                                  key={idx}
                                  label={mechanism}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              )
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Support System"
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {behaviouralHealth.supportSystem.map(
                              (support, idx) => (
                                <Chip
                                  key={idx}
                                  label={support}
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                />
                              )
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No behavioral health information recorded
                    </Typography>
                  </Box>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          gutterBottom
                        >
                          Mental Health Status
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Conditions:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {behaviouralHealth?.conditions}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Anxiety Level:</strong>
                            </Typography>
                            {/* <Chip
                              label={behaviouralHealth?.anxietyLevel}
                              color={
                                behaviouralHealth?.anxietyLevel > 3 
                                  ? "error"
                                  : behaviouralHealth?.anxietyLevel ===
                                      "Moderate"
                                    ? "warning"
                                    : "success"
                              }
                              size="small"
                            /> */}
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Depression Level:</strong>
                            </Typography>
                            {/* <Chip
                              label={behaviouralHealth?.depressionLevel}
                              color={
                                behaviouralHealth?.depressionLevel ===
                                "High"
                                  ? "error"
                                  : behaviouralHealth?.depressionLevel ===
                                      "Moderate"
                                    ? "warning"
                                    : "success"
                              }
                              size="small"
                            /> */}
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Stress Level:</strong>
                            </Typography>
                            {/* <Chip
                              label={behaviouralHealth?.stressLevel}
                              color={
                                behaviouralHealth?.stressLevel === "High"
                                  ? "error"
                                  : behaviouralHealth?.stressLevel ===
                                      "Moderate"
                                    ? "warning"
                                    : "success"
                              }
                              size="small"
                            /> */}
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Last Episode Date:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {behaviouralHealth?.lastEpisodeDate
                                ? new Date(
                                    behaviouralHealth?.lastEpisodeDate
                                  ).toLocaleDateString()
                                : "No recent episodes"}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          gutterBottom
                        >
                          Treatment & Support
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={3}>
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Therapy Status:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {behaviouralHealth?.therapyStatus}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Coping Mechanisms:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {behaviouralHealth?.copingMechanisms}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Support System:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {behaviouralHealth?.supportSystem}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Box>
        </Paper>
        {/* </motion.div> */}
      </Container>
    </Box>
  );
};

export default PatientProfile;
