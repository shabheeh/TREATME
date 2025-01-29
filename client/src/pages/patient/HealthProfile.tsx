import React, { useState } from 'react';
import { Card } from '@mui/material';
import { CustomTabs, TabPanel } from '../../components/basics/Tabs'; 
import HealthHistory from '../../components/patient/healthHistory/HealthHistory';




const tabContent = [
    {
        title: 'Health History',
        component: <HealthHistory />,
    },
    {
        title: 'Lifestyle',
        component: <div>Content for Tab 2</div>,
    },
    {
        title: 'Family History',
        component: <div>Content for Tab 3</div>,
    },
    {
        title: 'Behavioural History',
        component: <div>Content for Tab 3</div>,
    },
  ];


const HealthProfile = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CustomTabs value={value} onChange={handleChange} tabContent={tabContent} />
      {tabContent.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Card>
  );
};

export default HealthProfile;