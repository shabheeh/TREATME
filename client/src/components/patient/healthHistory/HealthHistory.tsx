import { Stack, Divider } from "@mui/material";

import Medications from "./Medications";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useEffect, useState } from "react";
import { IHealthHistory } from "../../../types/patient/health.types";
import healthProfileService from "../../../services/healthProfile/healthProfileServices";
import { toast } from "sonner";
import Loading from "../../basics/Loading";
import Allergies from "./Allergies";
import HealthConditions from "./HealthConditions";
import Surgeries from "./Surgeries";

const HealthHistory = () => {
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const [healthHistory, setHealthHistory] = useState<IHealthHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentPatient?._id) return;
    const fetchHealthHistory = async () => {
      try {
        setLoading(true);
        const result = await healthProfileService.getHealthHistory(
          currentPatient?._id
        );
        setHealthHistory(result);
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
    fetchHealthHistory();
  }, [currentPatient]);

  const updateHealthHistory = (healthData: IHealthHistory) => {
    setHealthHistory(healthData);
  };

  if (loading) return <Loading />;

  return (
    <Stack spacing={4} alignItems="center">
      <Medications
        medications={
          healthHistory?.medications ? healthHistory.medications : []
        }
        onUpdate={updateHealthHistory}
      />
      <Divider sx={{ width: "100%", borderColor: "grey.400" }} />
      <HealthConditions
        healthConditions={
          healthHistory?.healthConditions ? healthHistory.healthConditions : []
        }
        onUpdate={updateHealthHistory}
      />
      <Divider sx={{ width: "100%", borderColor: "grey.400" }} />
      <Allergies
        allergies={healthHistory?.allergies ? healthHistory.allergies : []}
        onUpdate={updateHealthHistory}
      />
      <Divider sx={{ width: "100%", borderColor: "grey.400" }} />
      <Surgeries
        surgeries={healthHistory?.surgeries ? healthHistory.surgeries : []}
        onUpdate={updateHealthHistory}
      />
      <Divider sx={{ width: "100%", borderColor: "grey.400" }} />
    </Stack>
  );
};

export default HealthHistory;
