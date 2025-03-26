import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { toast } from "sonner";
import Loading from "../../basics/ui/Loading";

interface LifestyleQuestion {
  id: string;
  question: string;
  answer: boolean | null;
}

const Lifestyle: React.FC = () => {
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<LifestyleQuestion[]>([]);

  useEffect(() => {
    if (!currentPatient) return;
    const fetchLifestyle = async () => {
      try {
        setLoading(true);
        const result = await healthProfileService.getLifestyle(
          currentPatient._id
        );
        setQuestions([
          {
            id: "doExercise",
            question: "Do you exercise regularly (at least 3 times a week)?",
            answer:
              result && result.doExercise !== undefined
                ? result.doExercise
                : null,
          },
          {
            id: "sleepSevenPlusHrs",
            question: "Do you get at least 7 hours of sleep most nights?",
            answer:
              result && result.sleepSevenPlusHrs !== undefined
                ? result.sleepSevenPlusHrs
                : null,
          },
          {
            id: "doSmoke",
            question: "Do you smoke or use tobacco products?",
            answer:
              result && result.doSmoke !== undefined ? result.doSmoke : null,
          },
          {
            id: "doAlcohol",
            question: "Do you consume alcohol more than twice a week?",
            answer:
              result && result.doAlcohol !== undefined
                ? result.doAlcohol
                : null,
          },
          {
            id: "followDietPlan",
            question:
              "Do you follow a balanced diet with fruits and vegetables?",
            answer:
              result && result.followDietPlan !== undefined
                ? result.followDietPlan
                : null,
          },
          {
            id: "highStress",
            question: "Do you regularly experience high levels of stress?",
            answer:
              result && result.highStress !== undefined
                ? result.highStress
                : null,
          },
          {
            id: "doMeditate",
            question: "Do you practice meditation or mindfulness?",
            answer:
              result && result.doMeditate !== undefined
                ? result.doMeditate
                : null,
          },
          {
            id: "vaccinatedCovid19",
            question: "Have you been vaccinated against COVID-19?",
            answer:
              result && result.vaccinatedCovid19 !== undefined
                ? result.vaccinatedCovid19
                : null,
          },
        ]);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLifestyle();
  }, [currentPatient]);

  const handleAnswer = async (questionId: string, newAnswer: boolean) => {
    try {
      if (!currentPatient) return;
      await healthProfileService.updateLifestyle(currentPatient._id, {
        [questionId]: newAnswer,
      });
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, answer: newAnswer } : q))
      );
    } catch (error) {
      console.error("Failed to update lifestyle answer:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: "background.default",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: "primary.main",
          fontWeight: 600,
        }}
      >
        Lifestyle Assessment
      </Typography>

      <Grid container spacing={3}>
        {questions.map((q) => (
          <Grid item xs={12} key={q.id}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "background.paper",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  transition: "border-color 0.3s ease",
                },
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {q.question}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <ToggleButtonGroup
                    exclusive
                    value={q.answer}
                    onChange={(_, value) => handleAnswer(q.id, value)}
                    sx={{ width: "100%" }}
                  >
                    <ToggleButton
                      value={true}
                      sx={{
                        flex: 1,
                        "&.Mui-selected": {
                          backgroundColor: "teal",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#006B6C",
                          },
                        },
                      }}
                    >
                      <CheckCircle sx={{ mr: 1 }} />
                      Yes
                    </ToggleButton>
                    <ToggleButton
                      value={false}
                      sx={{
                        flex: 1,
                        "&.Mui-selected": {
                          backgroundColor: "teal",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#006B6C",
                          },
                        },
                      }}
                    >
                      <Cancel sx={{ mr: 1 }} />
                      No
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Lifestyle;
