
import { Stack, Divider } from '@mui/material';

import Medications from './Medications';

const HealthHistory = () => {


  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Medications />
      <Divider />
    </Stack>
  );
};

export default HealthHistory;