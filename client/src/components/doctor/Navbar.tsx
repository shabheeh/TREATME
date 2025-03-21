import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";
import { useSelector } from "react-redux";
import logoNavbar from "../../assets/logo.navbar.svg";
import { RootState } from "../../redux/app/store";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

interface NavbarProps {
  onProfileClick: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onMenuClick }) => {
  const doctor = useSelector((state: RootState) => state.user.doctor);
  const navigate = useNavigate();
  const unreadCount = useUnreadNotifications();

  const handleLogoClick = () => {
    navigate("/doctor/dashboard");
  };

  const handleNotificationClick = () => {
    navigate("/doctor/notifications");
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
        {doctor && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: "auto",
            }}
          >
            <IconButton
              aria-label="show new notifications"
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Button
              variant="text"
              sx={{ minWidth: "auto", padding: 1 }}
              onClick={onProfileClick}
            >
              <Avatar
                src={doctor?.profilePicture}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                }}
              >
                {doctor?.firstName?.[0]}
              </Avatar>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
