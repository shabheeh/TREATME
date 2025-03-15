import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Card,
  CardContent,
  Button,
  Divider,
  TablePagination,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  profileImage?: string;
  email: string;
  phone: string;
}

const samplePatients: Patient[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    lastVisit: "2025-03-12",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 32,
    gender: "Male",
    lastVisit: "2025-03-10",
    email: "michael.c@example.com",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    age: 28,
    gender: "Female",
    lastVisit: "2025-03-05",
    email: "emma.r@example.com",
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    name: "John Smith",
    age: 58,
    gender: "Male",
    lastVisit: "2025-03-01",
    email: "john.s@example.com",
    phone: "(555) 456-7890",
  },
  {
    id: 5,
    name: "Aisha Patel",
    age: 36,
    gender: "Female",
    lastVisit: "2025-02-25",
    email: "aisha.p@example.com",
    phone: "(555) 567-8901",
  },
  {
    id: 6,
    name: "Robert Wilson",
    age: 62,
    gender: "Male",
    lastVisit: "2025-02-20",
    email: "robert.w@example.com",
    phone: "(555) 678-9012",
  },
  {
    id: 7,
    name: "Linda Garcia",
    age: 51,
    gender: "Female",
    lastVisit: "2025-02-18",
    email: "linda.g@example.com",
    phone: "(555) 789-0123",
  },
  {
    id: 8,
    name: "David Kim",
    age: 40,
    gender: "Male",
    lastVisit: "2025-02-15",
    email: "david.k@example.com",
    phone: "(555) 890-1234",
  },
  {
    id: 9,
    name: "Maria Lopez",
    age: 33,
    gender: "Female",
    lastVisit: "2025-02-10",
    email: "maria.l@example.com",
    phone: "(555) 901-2345",
  },
  {
    id: 10,
    name: "Thomas Wright",
    age: 55,
    gender: "Male",
    lastVisit: "2025-02-08",
    email: "thomas.w@example.com",
    phone: "(555) 012-3456",
  },
  {
    id: 11,
    name: "Jennifer Lee",
    age: 42,
    gender: "Female",
    lastVisit: "2025-02-05",
    email: "jennifer.l@example.com",
    phone: "(555) 123-4567",
  },
  {
    id: 12,
    name: "Omar Hassan",
    age: 38,
    gender: "Male",
    lastVisit: "2025-02-01",
    email: "omar.h@example.com",
    phone: "(555) 234-5678",
  },
];

const PatientCardListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useTheme();
  const navigate = useNavigate();

  // Filtered patients based on search term
  const filteredPatients = samplePatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page of patients
  const currentPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset to first page when search terms change
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const viewHealthProfile = () => {
    navigate("/doctor/patients/health", { state: { patient } });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h5"
              component="h1"
              color="text.primary"
              fontWeight="500"
            >
              Your Patients
            </Typography>
            <Typography
              variant="body2"
              component="h5"
              color="text.secondary"
              fontWeight="500"
            >
              View and manage your patient records. Click on a patient to see
              more details.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search patients..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        {/* <Button
          startIcon={<FilterListIcon />}
          color="secondary"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Filter
        </Button> */}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {currentPatients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                <Avatar
                //   src={patient.image}
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="h6" component="h2">
                    {patient.name}
                  </Typography>
                  <Typography variant="body2">
                    {patient.age} years • {patient.gender}
                  </Typography>
                </Box>
              </Box>
              <CardContent>

                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarIcon
                      sx={{ fontSize: 18, color: "primary.main", mr: 1 }}
                    />
                    <Typography variant="body2">
                      <Typography
                        component="span"
                        variant="body2"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        Last Visit:
                      </Typography>{" "}
                      {formatDate(patient.lastVisit)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon
                      sx={{ fontSize: 18, color: "primary.main", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {patient.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      sx={{ fontSize: 18, color: "primary.main", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {patient.phone}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={viewHealthProfile}
                    variant="outlined"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPatients.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No patients found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Material UI TablePagination component */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredPatients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[6, 12, 24]}
          labelRowsPerPage="Patients per page:"
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                margin: 0,
              },
            ".MuiTablePagination-toolbar": {
              paddingLeft: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PatientCardListPage;
