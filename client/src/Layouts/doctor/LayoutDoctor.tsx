import { useState } from "react";
import Sidebar from "../../components/doctor/Sidebar";
import Navbar from "../../components/doctor/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ProfileModal from "../../components/doctor/ProfileModal";

const LayoutDoctor = () => {
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
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, lg: "0px" },
          marginTop: "64px",
          backgroundColor: "#ffffff",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: { xs: "100%", lg: `calc(100% - 240px)` },
        }}
      >
        <Outlet />
      </Box>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </Box>
  );
};

export default LayoutDoctor;
