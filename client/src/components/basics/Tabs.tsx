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
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(16),
  marginRight: theme.spacing(1),
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
  boxShadow: 'none',
  borderBottom: '1px solid #e0e4e8',
  '& .MuiTabs-indicator': {
    backgroundColor: 'teal',
  },
});

export const CustomTabs: React.FC<CustomTabsProps> = ({ value, onChange, tabContent }) => {
  return (
    <StyledTabs
      value={value}
      onChange={onChange}
      aria-label="tabs"
      variant="scrollable"
      scrollButtons="auto"
      indicatorColor="primary"
      textColor="primary"
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
        <Box sx={{ p: 3, boxShadow: 'none' }}>
          {children}
        </Box>
      )}
    </div>
  );
};