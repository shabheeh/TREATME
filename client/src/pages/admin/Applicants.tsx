import { Box, Typography } from "@mui/material";
import ApplicantsList from "../../components/admin/ApplicantsList"


const Applicants = () => {
  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" color="text.primary">
        Applicants
      </Typography>
    </Box>

    <ApplicantsList />
    </>
  )
}

export default Applicants