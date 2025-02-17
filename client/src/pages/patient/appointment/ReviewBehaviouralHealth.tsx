
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Divider, 

} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Close } from "@mui/icons-material";
import ProgressBar from "../../../components/basics/PrgressBar";
import BehavioralHealth from "../../../components/patient/behaviouralHealth/BehaviouralHealth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";




const ReviewBehaviouralHealth = () => {
    
  const [exitModalOpen, setExitModalOpen] = useState(false)

  const location = useLocation();
  const navigate = useNavigate()

  const state = location.state

  useEffect(() => {
    if (!state) {
      navigate('/visitnow')
      return
    }
  }, [state, navigate])

  const handleContinue = async () => {
    navigate('/doctors', { state: state })
  }

  const handleExitBooking = () => {
    setExitModalOpen(false)
    navigate('/visitnow', { state: {} })
    return null
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>

      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">Schedule Appointment</Typography>
          <IconButton onClick={() => setExitModalOpen(true)}>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={60} />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Button
      onClick={handleBack}
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'primary.main',
        mb: 3,
        fontSize: '16px',
        fontWeight: 'bold',
        textDecoration: 'none',
        ':hover': { textDecoration: 'underline' },
      }}
    >
      <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
      Back
    </Button>
      <Box sx={{ my: 2}}>
            <Typography variant="h5" fontWeight='bold' color="grayText">
                Let's Review your Health Profile
            </Typography>
        </Box>
      <BehavioralHealth />
      <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button 
            onClick={handleContinue}
              variant="contained" 
              sx={{ py: 1.5, px: 5, borderRadius: 8 }}
            >
              Continue
            </Button>
          </Box>
          <ConfirmActionModal 
            open={exitModalOpen}
            title="Exit Booking"
            confirmColor="error"
            description="Are you sure you want to exit this appointment booking?"
            handleClose={() => setExitModalOpen(false)}
            handleConfirm={handleExitBooking}
            cancelText="Continue Booking"
            confirmText="Exit Booking"
            />
    </Box>
  );
};

export default ReviewBehaviouralHealth;
