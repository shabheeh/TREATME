import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DoctorsList from "../../components/admin/DoctorsList"

const Doctors = () => {
  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" color="text.primary">
        Doctors
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        component="a" // Makes the Button behave like an anchor tag
        href="/admin/add-doctor" // URL for navigation
        sx={{
          textTransform: "none", // Optional: Keeps the text in normal case
          textDecoration: "none", // Ensures the link has no underline
        }}
      >
        Add Doctor
      </Button>
    </Box>

    <DoctorsList />
    </>
  )
}

export default Doctors