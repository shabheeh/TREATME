import {
    AppBar,
    Box,
    Typography,
    Toolbar,
    Button,
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  import { TiPlus } from "react-icons/ti";
  import { RootState } from '../../redux/app/store';
  import { IoIosNotificationsOutline } from "react-icons/io";
  import { MdAccountCircle } from "react-icons/md";
  
  
  const Navbar = () => {

    const user = useSelector((state: RootState) => state.authUser.user)

    return (
      <AppBar 
  position="fixed" 
  sx={{ 
    bgcolor: 'teal',
    width: '100%'
  }}
>
  <Toolbar sx={{ padding: '0.5rem 1rem' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TiPlus size={27} />
      <Typography 
        variant="h5" 
        component="div" 
        sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}
      >
        treatme
      </Typography>
    </Box>
    {user && (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          ml: 'auto'  
        }}
      >
        <Button >
          <IoIosNotificationsOutline size={30} style={{ marginRight: '10px' }} />
        </Button>
        <MdAccountCircle size={30} />
      </Box>
    )}
  </Toolbar>
</AppBar>

    );
  };
  
  export default Navbar;