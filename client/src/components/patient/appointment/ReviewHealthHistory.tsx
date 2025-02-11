
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
import HealthHistory from "../healthHistory/HealthHistory";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";



const ReviewHealthHistory = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state

  useEffect(() => {
    if (!state) {
      navigate('/visitnow')
      return
    }
  }, [state, navigate])

  const handleContinue = async () => {
    navigate('/review-behavioural-health', { state : state })
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>

      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">Schedule Appointment</Typography>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={40} />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Link 
            href="/therapy/reason"  
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
            <Typography variant="h5" fontWeight='bold' color="primary">
                Let's Review your Health Profile
            </Typography>
        </Box>
      <HealthHistory />
      <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button 
              onClick={handleContinue}
              variant="contained" 
              sx={{ py: 1.5, px: 5, borderRadius: 8 }}
            >
              Continue
            </Button>
          </Box>
    </Box>
  );
};

export default ReviewHealthHistory;
