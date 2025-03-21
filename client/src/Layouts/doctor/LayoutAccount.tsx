import { useState } from "react";
import SidebarAccount from "../../components/doctor/SidebarAccount";
import Navbar from "../../components/doctor/Navbar";
import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ProfileModal from "../../components/patient/profile/ProfileModal";

const LayoutAccount = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar
        onMenuClick={handleDrawerToggle}
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <SidebarAccount mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, lg: "0" },
          marginTop: "64px",
          backgroundColor: "#ffffff",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: { xs: "100%", lg: `calc(100% - 240px)` },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px solid lightgray",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              alignSelf: "center",
            }}
          >
            Manage Account
          </Typography>
        </Box>

        <Outlet />
      </Box>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </Box>
  );
};

export default LayoutAccount;
