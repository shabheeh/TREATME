
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Message,
  Medication,
  EventNote,
  ContactSupport
} from '@mui/icons-material';

import { FaHouseMedical } from "react-icons/fa6";


import { RiHealthBookFill } from "react-icons/ri";

const drawerWidth = 250;

const menuItems = [
  { text: 'Visit Now', icon: <FaHouseMedical size={23} />, path: '/visitnow' },
  { text: 'Appointments', icon: <EventNote />, path: '/appointments' },
  { text: 'Messages', icon: <Message />, path: '/messages' },
  { text: 'Health Profile', icon: <RiHealthBookFill size={23} />, path: '/health-profile' },
  { text: 'Medications', icon: <Medication />, path: '/Medications' },
  { text: 'Help & Support', icon: <ContactSupport />, path: '/help' },
];

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void;
}


const SidebarAccount: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isLargeScreen) {
      onClose();
    }
  };

  const drawerContent = (
    <List sx={{ pt: 2 }}>
      {menuItems.map((item) => (
        <ListItem 
          key={item.text} 
          disablePadding 
          sx={{ 
            px: 2,
            py: 0.5
          }}
        >
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: '8px',
              justifyContent: 'center',
              minHeight: '48px',
              position: 'relative',
              '&.Mui-selected': {
                backgroundColor: '#e6fffa',
                border: '1px solid #00897b',
                '&:hover': {
                  backgroundColor: '#e6fffa',
                }
              },
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '80%'
            }}>
              <ListItemIcon
                sx={{
                  minWidth: '40px',
                  color: location.pathname === item.path ? '#00897b' : 'rgba(0, 0, 0, 0.54)'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? '#00897b' : 'inherit',
                  }
                }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            top: '64px',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#fff',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default SidebarAccount;