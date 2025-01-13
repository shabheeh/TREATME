import {
    AppBar,
    Box,
    Container,
    Typography,
    Toolbar,
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  import { TiPlus } from "react-icons/ti";
  import { RootState } from '../../redux/app/store';
  import { IoIosNotificationsOutline } from "react-icons/io";
  import { MdAccountCircle } from "react-icons/md";
  
  const Navbar = () => {
    const user = useSelector((state: RootState) => state.authUser.user);
  
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
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IoIosNotificationsOutline size={30} style={{ marginRight: '10px' }} />
                <MdAccountCircle size={30} />
              </Box>
            ) }
          </Toolbar>
        </Container>
      </AppBar>
    );
  };
  
  export default Navbar;
  