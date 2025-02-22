import {
  Box,
  Typography,
  Avatar,
  Grid,
  // Paper,
  Button,
  // IconButton,
  Container,
  List,
  ListItem,
} from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DoctorProfile = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data
  const doctor = {
    name: "Dr. Andrei A Avenido, MD",
    specialty: "Psychiatrist",
    avatar: "/path/to/avatar.jpg",
    bio: "I am Board Certified with the American Board of Psychiatry & Neurology in Adult Psychiatry. After completing training in 2014, I began practicing Psychiatry in Tennessee. In addition to caring for patients through MDLIVE, I have experience practicing in Inpatient Psychiatry, C&L Psychiatry and ER Psychiatry.",
    specialties: [
      "Alcohol/Drug use, Anxiety, Behavioral Issues, Bipolar Disorder, Depression",
      "Emotional Disturbance, Grief or Loss, Life Transitions, Medical Stress",
      "Medication Management, Panic Disorder, Stress, Trauma and PTSD",
      "Work/Life Balance",
    ],
    licenseStates: ["California", "Tennessee"],
    languages: ["English"],
    npiNumber: "1669786000",
  };

  // const months = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December"
  // ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: "#0288d1" }}
        href="#"
      >
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={8}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              src={doctor.avatar}
              alt={doctor.name}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {doctor.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {doctor.specialty}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Biography
            </Typography>
            <Typography variant="body1" paragraph>
              {doctor.bio}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Specialties
            </Typography>
            <List dense>
              {doctor.specialties.map((specialty, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <Typography variant="body2">• {specialty}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Licensed State(s)
            </Typography>
            <Typography variant="body2">
              • {doctor.licenseStates.join(", ").toLowerCase()}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Languages Spoken
            </Typography>
            <Typography variant="body2">
              • {doctor.languages.join(", ")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              National Provider ID (NPI)
            </Typography>
            <Typography variant="body2">{doctor.npiNumber}</Typography>
          </Box>
        </Grid>

        {/* <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
              }}
            >
              <IconButton>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">
                {`${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
              </Typography>
              <IconButton>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            <Grid container spacing={1} sx={{ mb: 1 }}></Grid>

            <Grid container spacing={1} sx={{ mb: 3 }}></Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Availability on
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: "#0288d1" }} />
                <Typography>Thursday, Dec 26, 2024</Typography>
              </Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
              ></Box>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 2 }}
            >
              Don't see the time you need?
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#0288d1",
                color: "#0288d1",
                borderRadius: 50
              }}
            >
              Request an Appointment
            </Button>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default DoctorProfile;
