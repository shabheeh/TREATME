
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
import BehavioralHealth from "../behaviouralHealth/BehaviouralHealth";




const ReviewBehaviouralHealth = () => {
  

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
                Let's Review your Health Profile
            </Typography>
        </Box>
      <BehavioralHealth />
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

export default ReviewBehaviouralHealth;
