import React, { useState } from 'react';
import { Card } from '@mui/material';
import { CustomTabs, TabPanel } from '../../basics/Tabs'; 
import HealthHistory from '../../patient/healthHistory/HealthHistory';
import Lifestyle from '../../patient/lifestyle/Lifestyle';
import FamilyHistory from '../../patient/familyHistory/FamilyHistory';
import BehavioralHealth from '../../patient/behaviouralHealth/BehaviouralHealth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/app/store';


 

const tabContentPatient = [
    {
        title: 'Health History',
        component: <HealthHistory />,
    },
    {
        title: 'Lifestyle',
        component: <Lifestyle />,
    },
    {
        title: 'Family History',
        component: <FamilyHistory />,
    },
    {
        title: 'Behavioural History',
        component: <BehavioralHealth />,
    },
  ];

  const tabContentDoctor = [
    {
        title: 'Health History',
        component: <HealthHistory />,
    },
    {
        title: 'Lifestyle',
        component: <Lifestyle />,
    },
    {
        title: 'Family History',
        component: <FamilyHistory />,
    },
    {
        title: 'Behavioural History',
        component: <BehavioralHealth />,
    },
  ];

const HealthProfile = () => {
  const [value, setValue] = useState(0);
  const patient = useSelector((state: RootState) => state.user.patient)

  const healthTabs = patient !== null ? tabContentPatient : tabContentDoctor

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CustomTabs value={value} onChange={handleChange} tabContent={healthTabs} />
      {healthTabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Card>
  );
};

export default HealthProfile;