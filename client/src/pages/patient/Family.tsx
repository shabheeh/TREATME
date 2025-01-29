import {
  Box,
  Typography,

} from '@mui/material';
import { useState } from 'react';
import FamilyMembers from '../../components/patient/profile/FamilyMembers';
import AddDependent from '../../components/patient/profile/AddDependent';





const Family = () => {

  const [isAddingDependent, setIsAddingDependent] = useState(false)



  const handleCurrentStateChange = () => {
    setIsAddingDependent(state => !state)
  }

  



  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isAddingDependent ? 'Add Dependent' : 'Family Members'}
      </Typography>
      { isAddingDependent ?
      <AddDependent changeCurrentState={handleCurrentStateChange} /> : <FamilyMembers  changeCurrentState={handleCurrentStateChange} />}

    </Box>
  );
};

export default Family;