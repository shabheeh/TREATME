import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  IconButton,
  Grid,
  Link,
  Avatar,
  Button,
  Skeleton,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ProgressBar from '../../basics/PrgressBar';
import { useLocation, useNavigate } from 'react-router-dom';
import appointmentService from '../../../services/appointment/appointmentService';
import { toast } from 'sonner';
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types';
import { formatMonthDay } from '../../../utils/dateUtils';

const AppointmentDetailsPage = () => {
  const [appointment, setAppointment] = useState<Partial<IAppointmentPopulated> | null>(null);
  const [loading, setLoading] = useState(true); // Start loading as true
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate('/visitnow');
      return;
    }
    const fetchAppointment = async () => {
      try {
        const appointment = await appointmentService.getAppointment(state.appointmentId);
        setAppointment(appointment);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong');
        }
      } finally {
        setLoading(false); 
      }
    };
    fetchAppointment();
  }, [state, navigate]);


  const handlePaymentClick = async () => {
    try {
      const response = await appointmentService.updateAppointment(
        state.appointmentId,
        { 
          status: 'confirmed',
          dayId: state.dayId, 
          slotId: state.slotId 
        })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown Error')
    }
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Schedule Appointment
            </Typography>
            <IconButton onClick={() => navigate('/visitnow')}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ProgressBar value={100} />
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
            ":hover": { textDecoration: "underline" },
          }}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
          Back
        </Link>
        <Box sx={{ my: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="grayText">
            Review and Book Appointment
          </Typography>
        </Box>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">Appointment Summary</Typography>
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={3}>
                  <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                  <Box>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Box 
                  display="flex" 
                  alignItems="start" 
                  flexDirection="column"
                  sx={{ 
                    border: 1, 
                    gap: 1,
                    borderColor: 'grey.300', 
                    borderRadius: 1, 
                    px: 2,
                    py: 1,
                    mb: 0
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: 13 }}>Patient</Typography>
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display='flex' flexDirection='column' gap={1}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Details
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      border: 1,
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      border: 1,
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                  <Skeleton variant="text" width="80%" sx={{ mt: 1.5 }} />
                </CardContent>
              </Card>
              <Box>
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Schedule Appointment
            </Typography>
            <IconButton onClick={() => navigate('/visitnow')}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ProgressBar value={100} />
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
            ":hover": { textDecoration: "underline" },
          }}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
          Back
        </Link>
        <Box sx={{ my: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="grayText">
            Review and Book Appointment
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
          No appointment found. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Schedule Appointment
          </Typography>
          <IconButton onClick={() => navigate('/visitnow')}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ProgressBar value={100} />
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
          ":hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
        Back
      </Link>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="grayText">
          Review and Book Appointment
        </Typography>
      </Box>
      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Appointment Summary</Typography>
                  <Typography variant="body1">{formatMonthDay(appointment?.date)}</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={appointment?.doctor?.profilePicture}
                  alt={`${appointment?.doctor?.firstName} ${appointment?.doctor?.lastName}`}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    Dr. {appointment?.doctor?.firstName} {appointment?.doctor?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment?.specialization?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment?.reason}
                  </Typography>
                </Box>
              </Box>
              <Box 
                display="flex" 
                alignItems="start" 
                flexDirection="column"
                sx={{ 
                  border: 1, 
                  gap: 1,
                  borderColor: 'grey.300', 
                  borderRadius: 1, 
                  px: 2,
                  py: 1,
                  mb: 0
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: 13 }}>Patient</Typography>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={appointment?.patient?.profilePicture}
                    alt={`${appointment?.patient?.firstName} ${appointment?.patient?.lastName}`}
                    sx={{ mr: 2 }}
                  />
                  <Typography>
                    {appointment?.patient?.firstName} {appointment?.patient?.lastName}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box display='flex' flexDirection='column' gap={1}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment Details
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    mb: 1,
                  }}
                >
                  <Typography>Payment Method</Typography>
                  <Typography>Credit/Debit Card</Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    mb: 1,
                  }}
                >
                  <Typography>Amount Due</Typography>
                  <Typography>${appointment?.fee.toFixed(2)}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  You will not be charged any additional fee after your consultation.
                </Typography>
              </CardContent>
            </Card>
            <Box>
              <Button 
                fullWidth
                variant='contained'
                sx={{ p: 2 }}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentDetailsPage;