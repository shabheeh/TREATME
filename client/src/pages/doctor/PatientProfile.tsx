import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Psychology as PsychologyIcon,
  Healing as HealingIcon,
  FitnessCenter as FitnessCenterIcon,
  People as PeopleIcon,
  FamilyRestroom as FamilyIcon,
} from "@mui/icons-material";

import { calculateAge } from "../../helpers/ageCalculator";

import accountService from "../../services/patient/accountService";
import { useLocation } from "react-router-dom";
import { IDependent, IPatient } from "../../types/patient/patient.types";
import {
  IBehaviouralHealth,
  IHealthHistory,
  ILifestyle,
} from "../../types/patient/health.types";
import { formatMonthDay } from "../../utils/dateUtils";

const PatientProfile: React.FC = () => {
  const location = useLocation();
  const patient = location.state.patient as IPatient | IDependent;
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

  return (
    <Box sx={{ maxWidth: "90%", margin: "0 auto", p: 2 }}>
      <Box
        sx={{
          mb: 3,
          p: 2,
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Avatar
          src={patient.profilePicture}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            {patient.firstName} {patient.lastName}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {calculateAge(patient.dateOfBirth)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* {patient.phone ? patient.phone : 'null'} */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Current Medications</Typography>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Box>
            <List>
              {healthHistory?.medications.map((medication, idx) => (
                <>
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <MedicationIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={medication.name}
                      secondary={medication.frequency}
                    />
                  </ListItem>
                  {idx !== healthHistory.medications.length - 1 && <Divider />}
                </>
              ))}
              {healthHistory?.medications.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No Medications recorded
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>

        {/* Recent Visits */}
        {/* <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Recent Visits</Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={appointment.specialization.name}
                  secondary={appointment.doctor.firsName}
                />
                <Typography variant="caption" color="text.secondary">
                  {appointment.date}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Grid> */}

        {/* Allergies */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Allergic to</Typography>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Box>
            <List>
              {healthHistory?.allergies.map((allergy, idx) => (
                <>
                  <ListItem
                    key={idx}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", width: "100%", mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <WarningIcon color="error" />
                      </ListItemIcon>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {allergy.allergicTo}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Reaction: {allergy.reaction}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            allergy.severity === "Severe"
                              ? "error.main"
                              : allergy.severity === "Moderate"
                                ? "warning.main"
                                : "info.main",
                        }}
                      >
                        Severity: {allergy.severity}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx !== healthHistory.allergies.length - 1 && <Divider />}
                </>
              ))}
              {healthHistory?.allergies.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No allergies recorded
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>

        {/* Family History */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Family History</Typography>
            </Box>
            <List>
              {healthHistory?.familyHistory.map((history, idx) => (
                <>
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <FamilyIcon />
                    </ListItemIcon>
                    <ListItemText primary={history.condition} />
                    <Typography variant="body2" color="text.secondary">
                      {history.relationship}
                    </Typography>
                  </ListItem>
                  {idx !== healthHistory.familyHistory.length - 1 && (
                    <Divider />
                  )}
                </>
              ))}
              {healthHistory?.familyHistory.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No Family History
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>

        {/* Medical Conditions */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Medical conditions</Typography>
            </Box>
            <List>
              {healthHistory?.healthConditions.map((condition, idx) => (
                <>
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <FamilyIcon />
                    </ListItemIcon>
                    <ListItemText primary={condition.condition} />
                    {/* <Typography variant="body2" color="text.secondary">
                  {condition.reportedBy}
                </Typography> */}
                  </ListItem>
                  {idx !== healthHistory.healthConditions.length - 1 && (
                    <Divider />
                  )}
                </>
              ))}
              {healthHistory?.familyHistory.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No medical conditions recorded
                  </Typography>
                </ListItem>
              )}
            </List>
            {/* <Box sx={{ p: 3, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No medical conditions recorded
              </Typography>
            </Box> */}
          </Box>
        </Grid>

        {/* Lifestyle */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Lifestyle</Typography>
            </Box>
            <List>
              {lifestyleQuestions.map((question, idx) => (
                <>
                  <ListItem key={idx}>
                    <ListItemText primary={question.question} />
                    <Typography variant="body1" color="gray">
                      {question.answer !== null
                        ? question.answer
                          ? "Yes"
                          : "No"
                        : "nill"}
                    </Typography>
                  </ListItem>
                  {idx !== lifestyleQuestions.length - 1 && <Divider />}
                </>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Behavioural Health */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Behavioral Health</Typography>
            </Box>
            {behaviouralHealth ? (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PsychologyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mental Health Conditions"
                    secondary={
                      behaviouralHealth.conditions.length > 0
                        ? behaviouralHealth.conditions.join(", ")
                        : "None recorded"
                    }
                  />
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
                        {behaviouralHealth.supportSystem.map((support, idx) => (
                          <Chip
                            key={idx}
                            label={support}
                            size="small"
                            variant="outlined"
                            color="success"
                          />
                        ))}
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientProfile;
