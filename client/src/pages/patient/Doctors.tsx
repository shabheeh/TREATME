import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Typography,
  Grid,
  Card,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Container,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import DoctorCard from "../../components/admin/DoctorCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import specializationService from "../../services/specialization/specializationService";
import { ISpecialization } from "../../types/specialization/specialization.types";
import doctorService from "../../services/doctor/doctorService";
import { getDoctorsWithSchedulesResult } from "../../types/doctor/doctor.types";

// Define types
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  specialization: string;
  // Add other properties as needed
}

const Doctors: React.FC = () => {
  const [data, setData] = useState<getDoctorsWithSchedulesResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);

  // Debounce search input
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

  // Fetch doctors data with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = {
          page: page + 1,
          limit: rowsPerPage,
          gender: genderFilter === "all" ? "" : genderFilter,
          specialization:
            specializationFilter === "all" ? "" : specializationFilter,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (genderFilter !== "all") params.gender = genderFilter;
        if (specializationFilter !== "all")
          params.specialization = specializationFilter;

        const response = await doctorService.getDoctorsWithSchedules(query);
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

  const handleGenderFilterChange = (event: SelectChangeEvent) => {
    setGenderFilter(event.target.value);
    setPage(0);
  };

  const handleSpecializationFilterChange = (event: SelectChangeEvent) => {
    setSpecializationFilter(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setGenderFilter("all");
    setSpecializationFilter("all");
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Doctors Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Search, filter, and manage doctor profiles.
        </Typography>
        g
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4, p: 3 }}>
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
                onChange={handleGenderFilterChange}
                label="Gender"
              >
                <MenuItem value="all">All Genders</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
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
                value={specializationFilter}
                onChange={handleSpecializationFilterChange}
                label="Specialization"
              >
                <MenuItem value="all">All Specializations</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
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
      </Card>

      {/* Active Filters */}
      {(genderFilter !== "all" ||
        specializationFilter !== "all" ||
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

          {genderFilter !== "all" && (
            <Chip
              label={`Gender: ${genderFilter}`}
              size="small"
              onDelete={() => setGenderFilter("all")}
            />
          )}

          {specializationFilter !== "all" && (
            <Chip
              label={`Specialization: ${specializationFilter}`}
              size="small"
              onDelete={() => setSpecializationFilter("all")}
            />
          )}
        </Box>
      )}

      {/* Doctors List - One Card Per Row */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            {data?.doctors && data.doctors.length > 0 ? (
              data.doctors.map((doctor) => (
                <Box key={doctor.id} sx={{ mb: 2 }}>
                  <DoctorCard doctor={doctor} />
                </Box>
              ))
            ) : (
              <Paper sx={{ p: 3, textAlign: "center" }}>
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
              </Paper>
            )}
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
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Doctors;
