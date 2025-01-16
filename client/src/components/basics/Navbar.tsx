import {
  AppBar,
  Box,
  Typography,
  Toolbar,
} from '@mui/material';
import { TiPlus } from "react-icons/ti";

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'teal',
        zIndex: 1200,
        width: '100%'
      }}
    >
      <Toolbar sx={{ padding: '0.5rem 1rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TiPlus size={27} />
          <Typography variant="h5" component="div" sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}>
            treatme
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;