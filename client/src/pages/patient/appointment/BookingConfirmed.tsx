
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button,
  Avatar,
  Grid
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../../../services/appointment/appointmentService';
import BookingConfirmedSkeleton from '../../../components/patient/BookingConfirmationSkelton';
import { formatMonthDay, formatTime } from '../../../utils/dateUtils';

const BookingConfirmation = () => {

    const [appointment, setAppointment] = useState<Partial<IAppointmentPopulated> | null>(null)
    const [loading, setLoading] = useState(true) 
    const location = useLocation()
    const navigate = useNavigate()

    const state = location.state;

    useEffect(() => {
        if (!state) {
          navigate('/visitnow', { state: {} });
          return;
        }
        const fetchAppointment = async () => {
          try {
            const appointment = await appointmentService.getAppointment(state.appointmentId);
            setAppointment(appointment);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong')
          } finally {
            setLoading(false); 
          }
        };
        fetchAppointment();
      }, [state, navigate]);

      useEffect(() => {
        const handlePopState = () => {
          console.log('Popstate event triggered: Clearing state');
          navigate(location.pathname, { state: {} });
        };

        window.addEventListener('popstate', handlePopState);
    
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }, [navigate, location]);
      
      if (loading) {
        return <BookingConfirmedSkeleton />
      }

  const appointmentDetails = {

    provider: {
      name: "Dr. Sarah Thompson",
      specialty: "Mental Health Counseling",
      image: "/api/placeholder/60/60"
    },
    appointment: {
      date: "Tuesday, February 11, 2024",
      time: "01:00 PM EST",
      duration: "45 minutes",
      type: "Video Consultation"
    },
    payment: {
      amount: "179.00",
      method: "VISA **** 4242",
      status: "Paid"
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', p: 3, pt: 1 }}>
      <Box sx={{ textAlign: 'center', mb: 4, color: 'teal' }}>
        <CheckCircleIcon 
          
          sx={{ fontSize: 64, mb: 2, color: "teal"  }} 
        />
        <Typography variant="h4" gutterBottom>
          Booking Confirmed!
        </Typography>
      </Box>

      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={6}> 
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 1, border: '1px solid teal' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={appointment?.doctor?.profilePicture}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">
              {appointment?.doctor?.firstName} { appointment?.doctor?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointmentDetails.provider.specialty}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>{ appointment?.date && formatMonthDay(appointment?.date)}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>
              { appointment?.date &&  formatTime(appointment?.date)} ({appointmentDetails.appointment.duration})
            </Typography>
          </Box>
          
        </Box>
      </Paper>
        </Grid>

        <Grid item xs={12} sm={6}> 
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 1, border: '1px solid teal' }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Amount Paid</Typography>
          <Typography>${appointmentDetails.payment.amount}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Payment Method</Typography>
          <Typography>{appointmentDetails.payment.method}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Status</Typography>
          <Typography color="success.main">{appointmentDetails.payment.status}</Typography>
        </Box>
      </Paper>
        </Grid>

        </Grid>
  
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 3, 
          mb: 3,
          border: '1px solid teal' 
        }}
      >
        <Typography variant="h6" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body2" paragraph>
          You will receive a confirmation email with appointment details and instructions for joining the video consultation.
        </Typography>
        <Typography variant="body2">
          Please join the video consultation 5 minutes before the scheduled time to ensure a smooth start.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          startIcon={<EmailIcon />}
        >
          View Email Confirmation
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CalendarIcon />}
        >
          Add to Calendar
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;