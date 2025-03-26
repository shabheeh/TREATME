import React, { useState } from "react";
import { Card } from "@mui/material";
import { CustomTabs, TabPanel } from "../../components/basics/ui/Tabs";
import HealthHistory from "../../components/patient/healthHistory/HealthHistory";
import Lifestyle from "../../components/patient/lifestyle/Lifestyle";
import FamilyHistory from "../../components/patient/familyHistory/FamilyHistory";
import BehavioralHealth from "../../components/patient/behaviouralHealth/BehaviouralHealth";

const tabContent = [
  {
    title: "Health History",
    component: <HealthHistory />,
  },
  {
    title: "Lifestyle",
    component: <Lifestyle />,
  },
  {
    title: "Family History",
    component: <FamilyHistory />,
  },
  {
    title: "Behavioural History",
    component: <BehavioralHealth />,
  },
];

const HealthProfile = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CustomTabs
        value={value}
        onChange={handleChange}
        tabContent={tabContent}
      />
      {tabContent.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Card>
  );
};

export default HealthProfile;
