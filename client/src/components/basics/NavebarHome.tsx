import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  IconButton,
} from '@mui/material';
import { TiPlus } from "react-icons/ti";
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';


interface NavbarHomeProps {
  onMenuClick: () => void;
}


const NavbarHome: React.FC<NavbarHomeProps> = ({ onMenuClick }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'teal',
        // zIndex: (theme) => theme.zIndex.drawer + 1, 
        // zIndex: 10,
        width: '100%'
      }}
    >
      <Box sx={{ px: 2 }}> 
        <Toolbar disableGutters>
          <IconButton
            onClick={onMenuClick}
            sx={{ 
              display: { xs: 'flex', lg: 'none' }, 
              mr: 2,
              color: 'white'
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TiPlus size={28} />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}
            >
              treatme
            </Typography>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default NavbarHome;