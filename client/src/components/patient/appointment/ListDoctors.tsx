import DoctorCard from "../../basics/DoctorCard";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Link,
  Select,
  Grid,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import ProgressBar from "../../basics/PrgressBar";
import { useEffect, useState } from "react";
import doctorService from "../../../services/doctor/doctorService";
import { IDoctorWithSchedule } from "../../../types/doctor/doctor.types";
import { toast } from "sonner";
import Loading from "../../basics/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import appointmentService from "../../../services/appointment/appointmentService";

type Gender = "male" | "female" | "any" | "";

const LANGUAGES = [ 
  'English',
  'Hindi',
  'Malayalam',
  'Tamil',
  'Kannada',
  'Telugu',
  'Urdu',
  "Bengali",
  "Gujarati",
  "Punjabi",
]

const ListDoctors = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender>("");
  const [language, setLanguage] = useState<string>("");
  const specialization = "679494304a73cf74bf3bd1d8";
  const [page, setPage] = useState<number>(1);
  const [doctors, setDoctors] = useState<IDoctorWithSchedule[] | []>([]);
  const [loading, setLoading] = useState(false);


  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state

  console.log('state', state)

  useEffect(() => {

    if (!state) {
      navigate('/visitnow')
      return
    }

    const query = {
      selectedDate: date || new Date(),
      gender: gender,
      language: language,
      specialization: specialization,
      page: page,
    };
    const fetchDoctors = async () => {
      try {
        console.log(query)
        setLoading(true);
        const result = await doctorService.getDoctorsWithSchedules(query);
        setDoctors(result.doctors);
        setPage(result.currentPage)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [gender, language, date]);

  const handleGenderChange = (event: React.ChangeEvent<{ value: string }>) => {
    const value = event.target.value as Gender;
    setGender(value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<{ value: string }>) => {
    const value = event.target.value as string;
    setLanguage(value);
  };

  const handleDateChange = (event: React.ChangeEvent<{ value: Date }>) => {
    const value = event.target.value as Date
    setDate(value)
  }

  const handleSlotBooking = async (doctorId: string, dayId: string, slotId: string) => {
    const appointmentId = state.appointmentId
    try {
      const result = await appointmentService.updateAppointment(appointmentId, { doctorId })
      navigate('/review-appointment', { state: { appointment: result._id, slotId, dayId }})
    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message)
      }else {
        console.error('Something went wrong')
      }
    }
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
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={80} />
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
        <ArrowBack fontSize="small" sx={{ mr: 1 }} />
        Back
      </Link>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="grayText">
          Select Doctor for your Appointment
        </Typography>
      </Box>
      <Box sx={{ display: "flex", my: 3 }}>
        <Grid container direction="row" justifyContent='end' spacing={1}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 110 }}>
              <TextField
                select
                size="small"
                label="Gender"
                variant="outlined"
                onChange={handleGenderChange}
                value={gender}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
            <TextField
                select
                size='small'
                label="Language"
                variant="outlined"
                onChange={handleLanguageChange}
                value={language}
            > 
            <MenuItem value="any">Any</MenuItem>
            {LANGUAGES.map(language => (
              <MenuItem value={language}>{language}</MenuItem>

            ))}
            </TextField>
        </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
          <TextField
          size="small"
            fullWidth
            type="date"
            label="Select Date"
            value={date}
            onChange={handleDateChange}
            // onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Loading />
      ) : (
        doctors.map((doctor) => (
          <DoctorCard
            id={doctor._id}
            name={doctor.firstName + " " + doctor.lastName}
            experience={doctor.experience}
            availability={doctor.availability}
            profilePicture={doctor.profilePicture}
            specialties={doctor.specialties}
            handleSlotClick={handleSlotBooking}
          />
        ))
      )}

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" sx={{ py: 1.5, px: 5, borderRadius: 8 }}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default ListDoctors;
