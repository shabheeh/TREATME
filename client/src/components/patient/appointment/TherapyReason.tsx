import { useState } from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Divider, 
  Link, 
  Autocomplete, 
  TextField 
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import ProgressBar from "../../basics/PrgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useLocation, useNavigate } from "react-router-dom";
import appointmentService from "../../../services/appointment/appointmentService";
import { toast } from "sonner";

const concerns = [
  "I have been feeling down",
  "I have been feeling worried",
  "I've been experiencing mood swings",
  "I am grieving, I lost a loved one",
  "I have been dealing with stress at work or school",
  "I have relationship issues",
  "I have experienced trauma",
  "I recently had major life changes",
  "I have not been happy for a long time",
  "I am not sure"
];

const TherapyReason = () => {

  const [selectedConcern, setSelectedConcern] = useState<string>("");

  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state
  const currentPatient = useSelector((state: RootState) => state.user.currentUser)


  if (!state) {
    navigate('/visitnow')
    return null
  }


  const startAppointment = async() => {
    if (!currentPatient) return
    const appointmentData = {
      patientId: currentPatient._id,
      specialization: state.specializationId,
      fee: state.fee,
      status: 'pending',
      reason: selectedConcern,
    }
      try {
        const result = await appointmentService.createAppointment(appointmentData)
        navigate('/review-health-history', { state :{ appointmentId: result._id }})
      } catch (error) {
        if(error instanceof Error) {
          toast.error(error.message)
        }else {
          toast.error('Unknown error')
        }
      }
  }

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

      <Card elevation={0} sx={{ borderRadius: 3, p: 2 }}>
        <CardContent sx={{ p: 3 }}>

          <Link 
            href="#"  
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

          {/* Autocomplete for Concerns */}
          <Typography variant="h6" fontWeight="bold" mb={1}>
            How can our Therapists help?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Choose or type a primary concern
          </Typography>

          <Autocomplete
            freeSolo
            fullWidth
            options={concerns}
            value={selectedConcern}
            onInputChange={(_event, newValue) => setSelectedConcern(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Enter or select concern" variant="outlined" />
            )}
          />

          <Box mt={4} color="text.secondary">
            <Typography variant="body2" mb={2}>
              Our therapists <strong>do not</strong> provide crisis intervention or emergency services.  
              If you are experiencing a crisis, please seek immediate assistance. 
            </Typography>

            <Typography variant="body2" mb={2}>
              Therapy may not be appropriate for individuals experiencing severe mental health crises or conditions requiring urgent care. Please reach out to emergency services for immediate support.
            </Typography>

            <Typography variant="body2" mb={2}>
              If you or someone you know is in distress, call the <strong>Suicide & Crisis Lifeline: 91-9820466726</strong>.  
              Support is available <strong>24/7</strong>, free of charge.  
            </Typography>

          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button 
              onClick={startAppointment}
              variant="contained" 
              sx={{ py: 1.5, px: 5, borderRadius: 8 }}
              disabled={!selectedConcern} 
            >
              
              Continue
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default TherapyReason;
