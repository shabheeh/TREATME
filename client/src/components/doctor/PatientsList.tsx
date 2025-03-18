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
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IPatientForDoctor } from "../../types/patient/patient.types";
import appointmentService from "../../services/appointment/appointmentService";
import { toast } from "sonner";
import { calculateAge } from "../../helpers/ageCalculator";

const PatientCardListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [patients, setPatients] = useState<IPatientForDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const result = await appointmentService.getPatientsByDoctor(
        page + 1,
        rowsPerPage,
        debouncedSearch
      );
      setPatients(result.patients);
      setTotalPatients(result.totalPatients);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // const filteredPatients = patients.filter(
  //   (patient) =>
  //     patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const viewHealthProfile = (patient: IPatientForDoctor) => {
    navigate("/doctor/patients/health2", { state: { patient } });
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
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient._id}>
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
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Avatar
                  src={patient.profilePicture}
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="h6" component="h2">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                  <Typography variant="body2">
                    {calculateAge(patient.dateOfBirth)} years • {patient.gender}
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

                  {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      sx={{ fontSize: 18, color: "primary.main", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {patient.phone}
                    </Typography>
                  </Box> */}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => viewHealthProfile(patient)}
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

      {patients.length === 0 && (
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
          count={patients.length}
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
