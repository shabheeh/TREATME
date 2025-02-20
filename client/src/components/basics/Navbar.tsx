import { AppBar, Box, Toolbar } from "@mui/material";
import logoNavbar from "../../assets/logo.navbar.svg";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "teal",
        width: "100%",
        boxShadow: 0
      }}
    >
      <Toolbar sx={{ padding: "0.5rem 1rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={logoNavbar}
            alt="Logo"
            style={{ height: "25px", cursor: "pointer" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
