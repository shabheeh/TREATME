import DoctorCard from "../../../components/basics/DoctorCard";

import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Grid,
  FormControl,
  MenuItem,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import ProgressBar from "../../../components/basics/PrgressBar";
import { useEffect, useState } from "react";
import doctorService from "../../../services/doctor/doctorService";
import {
  IDoctor,
  IDoctorWithSchedule,
} from "../../../types/doctor/doctor.types";
import { toast } from "sonner";
import Loading from "../../../components/basics/Loading";
import { useNavigate } from "react-router-dom";
import ConfirmActionModal from "../../../components/basics/ConfirmActionModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import {
  resetAppointment,
  updateAppointment,
} from "../../../redux/features/appointment/appointmentSlice";

type Gender = "male" | "female" | "any" | "";

const LANGUAGES = [
  "English",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Kannada",
  "Telugu",
  "Urdu",
  "Bengali",
  "Gujarati",
  "Punjabi",
];

const ListDoctors = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<Date | string>(today);
  const [gender, setGender] = useState<Gender>("");
  const [language, setLanguage] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [doctors, setDoctors] = useState<IDoctorWithSchedule[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const appointmentData = useSelector(
    (state: RootState) => state.appointment.appointmentData
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!appointmentData || !appointmentData.specialization) {
      navigate("/visitnow");
      return;
    }

    const query = {
      selectedDate: date || new Date(),
      gender: gender,
      language: language,
      specialization: appointmentData.specialization,
      page: page,
    };
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const result = await doctorService.getDoctorsWithSchedules(query);
        setDoctors(result.doctors);
        setPage(result.currentPage);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [gender, language, date, navigate, page, appointmentData]);

  const handleGenderChange = (event: React.ChangeEvent<{ value: string }>) => {
    const value = event.target.value as Gender;
    setGender(value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    const value = event.target.value as string;
    setLanguage(value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDate(value);
  };

  const handleSlotBooking = async (
    doctor: IDoctor,
    dayId: string,
    slotId: string,
    date: Date
  ) => {
    dispatch(
      updateAppointment({
        doctor: doctor._id,
        dayId,
        slotId,
        date,
      })
    );

    navigate("/review-appointment");
  };

  const handleExitBooking = () => {
    setExitModalOpen(false);
    navigate("/visitnow");
    dispatch(resetAppointment());
  };

  const handleBack = () => {
    navigate(-1);
  };

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
          <IconButton onClick={() => setExitModalOpen(true)}>
            <Close />
          </IconButton>
        </Box>
        <ProgressBar value={80} />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Button
        onClick={handleBack}
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
      </Button>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="grayText">
          Select Doctor for your Appointment
        </Typography>
      </Box>
      <Box sx={{ display: "flex", my: 3 }}>
        <Grid container direction="row" justifyContent="end" spacing={1}>
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
                size="small"
                label="Language"
                variant="outlined"
                onChange={handleLanguageChange}
                value={language}
              >
                <MenuItem value="any">Any</MenuItem>
                {LANGUAGES.map((language) => (
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
              inputProps={{ min: today }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Loading />
      ) : doctors.length === 0 ? (
        <Card
          sx={{
            maxWidth: "100%",
            border: "1px solid",
            borderColor: "teal",
            boxShadow: "none",
            minHeight: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              p: 2,
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No doctors Available.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Please adjust date, gender, or language.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        doctors.map((doctor) => (
          <DoctorCard
            doctor={doctor}
            availability={doctor.availability}
            handleSlotClick={handleSlotBooking}
          />
        ))
      )}
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

export default ListDoctors;
