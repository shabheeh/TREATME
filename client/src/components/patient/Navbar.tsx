import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import logoNavbar from "../../assets/logo.navbar.svg";
import { RootState } from "../../redux/app/store";
import { IoIosNotificationsOutline } from "react-icons/io";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onProfileClick: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onMenuClick }) => {
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/visitnow");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "teal",
        width: "100%",
        boxShadow: 0,
      }}
    >
      <Toolbar sx={{ padding: "0.5rem 1rem" }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: "flex", lg: "none" },
            mr: 2,
            color: "white",
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={logoNavbar}
            alt="Logo"
            style={{ height: "25px", cursor: "pointer" }}
            onClick={handleLogoClick}
          />
        </Box>
        {currentPatient && (
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
              <Avatar
                src={currentPatient?.profilePicture}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                }}
              >
                {currentPatient?.firstName?.[0]}
              </Avatar>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
