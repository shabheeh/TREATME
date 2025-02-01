
import { Stack, Divider } from '@mui/material';

import Medications from './Medications';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/app/store';
import { useEffect, useState } from 'react';
import { IHealthHistory } from '../../../types/patient/health.types';
import healthProfileService from '../../../services/healthProfile/healthProfileServices';


const HealthHistory = () => {

  const currentPatient = useSelector((state: RootState) => state.user.currentUser);
  const [healthHistory, setHealthHistory] = useState<IHealthHistory | null>;

  useEffect(() => {
    if(!currentPatient?._id) return
    try {
      const fetchHealthHistory = async () => {
        const result = await healthProfileService.getHealthHistory(currentPatient?._id)
        setHealthHistory(result)
      }
    } catch (error) {
      
    }
  }, [])


  return (
    <Stack spacing={4} alignItems="center">
      <Medications medications={medications} />
      <Divider />
    </Stack>
  );
};

export default HealthHistory;