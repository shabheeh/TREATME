import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import logoNavbar from "../../assets/logo.navbar.svg";
import { RootState } from "../../redux/app/store";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notification/notificationService";
import { setUnreadCount } from "../../redux/features/notification/notificationSlice";

interface NavbarProps {
  onProfileClick: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onMenuClick }) => {
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const unreadCount = useSelector(
    (state: RootState) => state.notfication.unreadCount
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotificationsUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCounts();
        console.log(count, "countt");
        dispatch(setUnreadCount(count));
      } catch (error) {
        console.log("error fetching notification count", error);
      }
    };
    fetchNotificationsUnreadCount();
  }, [dispatch]);

  const handleLogoClick = () => {
    navigate("/visitnow");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
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
