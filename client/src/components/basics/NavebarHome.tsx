import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import logoNavbar from '../../assets/logo.navbar.svg'

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
        width: '100%',
        boxShadow: 0

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
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={logoNavbar} 
            alt="Logo" 
            style={{ height: '25px', cursor: 'pointer' }} 
          />
        </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default NavbarHome;