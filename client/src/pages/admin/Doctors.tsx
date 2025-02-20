import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DoctorsList from "../../components/admin/DoctorsList";

const Doctors = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Doctors
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component="a"
          href="/admin/add-doctor"
          sx={{
            textTransform: "none",
            textDecoration: "none"
          }}
        >
          Add Doctor
        </Button>
      </Box>

      <DoctorsList />
    </>
  );
};

export default Doctors;
