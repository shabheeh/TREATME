
import DoctorCard from '../../basics/DoctorCard'

import { 
    Box, 
    Typography, 
    Button, 
    IconButton, 
    Divider, 
    Link, 
  
  } from "@mui/material";
  import { ArrowBack, Close } from "@mui/icons-material";
  import ProgressBar from "../../basics/PrgressBar";
  
  
  
  
  
  const ListDoctors = () => {
    
  
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
  
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">Schedule Appointment</Typography>
            <IconButton>
              <Close />
            </IconButton>
          </Box>
          <ProgressBar value={20} />
        </Box>
  
        <Divider sx={{ my: 4 }} />
        <Link 
              href="/review-health-history"  
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                color: "primary.main", 
                mb: 3, 
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
                ":hover": { textDecoration: "underline" }
              }}
            >
              <ArrowBack fontSize="small" sx={{ mr: 1 }} />
              Back
            </Link>
        <Box sx={{ my: 2}}>
              <Typography variant="h5" fontWeight='bold' color="grayText">
                  Select Doctor for your Appointment
              </Typography>
          </Box>
          <DoctorCard
            name="Alyson Brooke Schroeder, SW"
            role="Social Worker"
            imageUrl="/path-to-image.jpg"
            experience={3}
            availability={[
            {
                dayName: "Tomorrow",
                date: "February 10",
                slots: ["10:00 AM"]
            },
            {
                dayName: "Tuesday",
                date: "February 18",
                slots: ["10:00 AM", "11:45 AM", "11:45 AM", "11:45 AM"]
            }
            ]}
            />
        <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button 
                variant="contained" 
                sx={{ py: 1.5, px: 5, borderRadius: 8 }}
              >
                Continue
              </Button>
            </Box>
      </Box>
    );
  };
  
  export default ListDoctors;
  