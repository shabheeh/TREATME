import Navbar from "../../components/basics/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const LayoutAppointment = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, lg: "0" },
          marginTop: "64px",
          backgroundColor: "#fffff",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: { xs: "100%", lg: `calc(100% - 240px)` }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutAppointment;
