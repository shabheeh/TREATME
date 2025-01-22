import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import logoNavbar from '../../assets/logo.navbar.svg';
import { RootState } from "../../redux/app/store";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import React from "react";


interface NavbarProps {
  onProfileClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick }) => {
  const patient = useSelector((state: RootState) => state.user.patient);

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "teal",
        width: "100%",
      }}
    >
      <Toolbar sx={{ padding: "0.5rem 1rem" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={logoNavbar} 
            alt="Logo" 
            style={{ height: '25px', cursor: 'pointer' }} 
          />
        </Box>
        {patient && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: "auto",
            }}
          >
            <Button
              variant="text"
              sx={{ minWidth: "auto", padding: 1 }}
              // onClick={handleNotificationClick}
            >
              <IoIosNotificationsOutline size={30} />
            </Button>
            <Button
              variant="text"
              sx={{ minWidth: "auto", padding: 1 }}
              onClick={onProfileClick}
            >
              <MdAccountCircle size={30} />
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
