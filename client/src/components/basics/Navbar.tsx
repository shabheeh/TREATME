import {
  AppBar,
  Box,
  Container,
  Typography,
  Toolbar,
} from '@mui/material';

import { TiPlus } from "react-icons/ti";

const Navbar = () => {

  return (
    <AppBar position="static" sx={{ bgcolor: 'teal' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ padding: '0.5rem 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <TiPlus size={35} />
            <Typography variant="h5" component="div" sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}>
              treatme
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
