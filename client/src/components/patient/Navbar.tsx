import { AppBar, Box, Typography, Toolbar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { TiPlus } from "react-icons/ti";
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TiPlus size={27} />
          <Typography
            variant="h5"
            component="div"
            sx={{ ml: 1, fontWeight: "bold", color: "white" }}
          >
            treatme
          </Typography>
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
