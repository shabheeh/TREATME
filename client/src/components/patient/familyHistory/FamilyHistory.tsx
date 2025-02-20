import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Select,
  MenuItem,
  Button,
  Collapse,
  IconButton,
  FormControl
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import Loading from "../../basics/Loading";
import { IFamilyHistory } from "../../../types/patient/health.types";
import { toast } from "sonner";

const HEALTH_CONDITIONS = [
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "Cancer",
  "Asthma",
  "Mental Health Conditions",
  "Stroke",
  "Kidney Disease",
  "Thyroid Disease",
  "Arthritis",
  "Alzheimer's Disease"
];

const RELATIONSHIPS = [
  "Mother",
  "Father",
  "Sister",
  "Brother",
  "Grandmother (Maternal)",
  "Grandmother (Paternal)",
  "Grandfather (Maternal)",
  "Grandfather (Paternal)",
  "Aunt",
  "Uncle"
];

const FamilyHistory = () => {
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const [familyHistory, setFamilyHistory] = useState<IFamilyHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [relationship, setRelationship] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHealthHistory = async () => {
      if (!currentPatient) return;
      try {
        setLoading(true);
        const result = await healthProfileService.getHealthHistory(
          currentPatient._id
        );

        setFamilyHistory(result?.familyHistory || []);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch health history"
        );
        setFamilyHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthHistory();
  }, [currentPatient]);

  const isConditionSelected = (condition: string) => {
    return familyHistory.some((history) => history.condition === condition);
  };

  const handleConditionClick = (condition: string) => {
    if (!isConditionSelected(condition)) {
      setSelectedCondition(condition);
      setRelationship("");
    }
  };

  const handleSave = async () => {
    if (!selectedCondition || !relationship.trim()) return;
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      const updatedHistory: IFamilyHistory[] = [
        ...familyHistory,
        {
          condition: selectedCondition,
          relationship: relationship.trim()
        }
      ];
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        "familyHistory",
        updatedHistory
      );
      setFamilyHistory(result.familyHistory);
      setSelectedCondition(null);
      setRelationship("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update health history"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveHistory = async (conditionToRemove: string) => {
    try {
      if (!currentPatient) return;
      const updatedHistory: IFamilyHistory[] = familyHistory.filter(
        (history) => history.condition !== conditionToRemove
      );
      const result = await healthProfileService.updateHealthHistory(
        currentPatient._id,
        "familyHistory",
        updatedHistory
      );
      setFamilyHistory(result.familyHistory);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update health history"
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default" }}>
      <Typography
        variant="h5"
        sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
      >
        Family Health History
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
        Does anyone in your family have the following conditions?
      </Typography>
      {familyHistory.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Selected Conditions:
          </Typography>
          <Grid container spacing={1}>
            {familyHistory.map((history) => (
              <Grid item key={`${history.condition}-${history.relationship}`}>
                <Chip
                  label={`${history.condition} - ${history.relationship}`}
                  onDelete={() => handleRemoveHistory(history.condition)}
                  color="primary"
                  sx={{ bgcolor: "primary.light" }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {HEALTH_CONDITIONS.map((condition) => (
          <Grid item key={condition}>
            <Chip
              label={condition}
              onClick={() => handleConditionClick(condition)}
              color={isConditionSelected(condition) ? "primary" : "default"}
              sx={{
                "&:hover": {
                  bgcolor: isConditionSelected(condition)
                    ? "primary.dark"
                    : "action.hover"
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Collapse in={!!selectedCondition}>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: 1,
            borderColor: "divider"
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Who has {selectedCondition}?
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth size="small">
                <Select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Relationship
                  </MenuItem>
                  {RELATIONSHIPS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!relationship || isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setSelectedCondition(null)}
                  sx={{ flexShrink: 0 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FamilyHistory;
