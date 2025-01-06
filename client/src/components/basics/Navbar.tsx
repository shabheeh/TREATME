
import {
  AppBar,
  Box,
  Button,
  Container,
  Typography,
  Toolbar,
} from '@mui/material';

import { Link } from 'react-router-dom';

import { TiPlus } from "react-icons/ti";
// import { IoIosNotificationsOutline } from "react-icons/io";
// import { MdAccountCircle } from "react-icons/md";


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
            <Link to={'/signup'}>
            <Button variant="contained" sx={{ borderRadius: 28, bgcolor: 'white', color: 'teal', '&:hover': { bgcolor: 'grey.100' } }}>
              Get Started
            </Button>
            </Link>
            {/* <IoIosNotificationsOutline size={30} style={{marginRight: '10px'}} />
            <MdAccountCircle size={30} /> */}
          </Toolbar>
        </Container>
      </AppBar>
  )
}

export default Navbar