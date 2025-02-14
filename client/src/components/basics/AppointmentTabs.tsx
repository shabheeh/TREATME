import React from 'react';
import { Tabs, Tab, styled, Box } from '@mui/material';

interface TabContent {
  title: string;
}

interface CustomTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabContent: TabContent[];
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(20),
  flex: 1,
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  boxShadow: 'none',
  border: 'none',
}));

const StyledTabs = styled(Tabs)({
  display: 'flex',
  justifyContent: 'space-between', 
  borderBottom: '1px solid #e0e4e8',
  '& .MuiTabs-indicator': {
    backgroundColor: 'teal',
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export const CustomTabs: React.FC<CustomTabsProps> = ({ value, onChange, tabContent }) => {
  return (
    <StyledTabs
      value={value}
      onChange={onChange}
      aria-label="tabs"
      variant="fullWidth"
      indicatorColor="primary"
      textColor="primary"
      sx={{ mx: 6 }}
    >
      {tabContent.map((tab, index) => (
        <StyledTab
          key={index}
          label={tab.title}
          id={`tab-${index}`}
          aria-controls={`tabpanel-${index}`}
        />
      ))}
    </StyledTabs>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ mx: 10, p: 3, boxShadow: 'none' }}>
          {children}
        </Box>
      )}
    </div>
  );
};