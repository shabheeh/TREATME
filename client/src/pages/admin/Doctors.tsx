import * as React from "react";
import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import {
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Container,
  InputAdornment,
  SelectChangeEvent,
  Divider,
  Button,
} from "@mui/material";
import DoctorCard from "../../components/admin/DoctorCard";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import specializationService from "../../services/specialization/specializationService";
import { ISpecialization } from "../../types/specialization/specialization.types";
import doctorService from "../../services/doctor/doctorService";
import {
  getDoctorsQuery,
  getDoctorsResult,
} from "../../types/doctor/doctor.types";
import Loading from "../../components/basics/ui/Loading";
import { useNavigate } from "react-router-dom";

const Doctors: React.FC = () => {
  const [data, setData] = useState<getDoctorsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [specializationFilter, setSpecializationFilter] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specializations =
          await specializationService.getSpecializations();
        setSpecializations(specializations);
      } catch (err) {
        console.error("Error fetching specializations:", err);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = {
          page: page + 1,
          limit: rowsPerPage,
          gender: genderFilter,
          specialization: specializationFilter.id,
          search: debouncedSearch,
        } as getDoctorsQuery;

        const response = await doctorService.getDoctors(query);
        setData(response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch doctors data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, debouncedSearch, genderFilter, specializationFilter]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGenderFilter(event.target.value);
    setPage(0);
  };

  const handleSpecializationChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const selectedSpec = specializations.find(
      (spec) => spec._id === selectedId
    );

    if (selectedSpec) {
      setSpecializationFilter({
        id: selectedSpec._id,
        name: selectedSpec.name,
      });
    }
    setPage(0);
  };
  const handleClearFilters = () => {
    setGenderFilter("");
    setSpecializationFilter({ id: "", name: "" });
    setSearchQuery("");
    setPage(0);
  };

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Search and Filters */}
      <Box sx={{ mb: 4, p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Doctors
          </Typography>

          <Button
            onClick={() => navigate("/admin/add-doctor")}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              textDecoration: "none",
            }}
          >
            Add Doctor
          </Button>
        </Box>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Doctors"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              placeholder="Search by name, email, or phone..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender-filter-label">Gender</InputLabel>
              <Select
                labelId="gender-filter-label"
                id="gender-filter"
                value={genderFilter}
                onChange={handleGenderChange}
                label="Gender"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="specialization-filter-label">
                Specialization
              </InputLabel>
              <Select
                labelId="specialization-filter-label"
                id="specialization-filter"
                value={specializationFilter.id}
                onChange={handleSpecializationChange}
                label="Specialization"
              >
                <MenuItem value="">All Specializations</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec._id} value={spec._id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2} textAlign="right">
            <Chip
              icon={<FilterListIcon />}
              label="Clear Filters"
              onClick={handleClearFilters}
              color="primary"
              variant="outlined"
              sx={{ height: 40 }}
            />
          </Grid>
        </Grid>
      </Box>

      {(genderFilter !== "all" ||
        specializationFilter.id !== "all" ||
        searchQuery) && (
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1, mt: 0.5 }}>
            Active filters:
          </Typography>

          {searchQuery && (
            <Chip
              label={`Search: ${searchQuery}`}
              size="small"
              onDelete={() => setSearchQuery("")}
            />
          )}

          {genderFilter !== "" && (
            <Chip
              label={`Gender: ${genderFilter}`}
              size="small"
              onDelete={() => setGenderFilter("")}
            />
          )}

          {specializationFilter.id !== "" && (
            <Chip
              label={`Specialization: ${specializationFilter.name}`}
              size="small"
              onDelete={() => setSpecializationFilter({ id: "", name: "" })}
            />
          )}
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {data?.doctors && data.doctors.length > 0 ? (
                data.doctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                    <DoctorCard doctor={doctor} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">
                      No doctors found matching your criteria.
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Try adjusting your search or filters.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Pagination */}
          {data?.doctors && data.doctors.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <TablePagination
                component="div"
                count={data?.total || 0}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsCount}
                rowsPerPageOptions={[6, 9, 15]}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Doctors;
