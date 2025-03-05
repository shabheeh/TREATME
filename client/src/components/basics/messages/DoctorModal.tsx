import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  InputAdornment,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Star as StarIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  getDoctorsQuery,
  getDoctorsResult,
  IDoctor,
} from "../../../types/doctor/doctor.types";
import doctorService from "../../../services/doctor/doctorService";
import specializationService from "../../../services/specialization/specializationService";
import { ISpecialization } from "../../../types/specialization/specialization.types";

interface DoctorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (userId: string, userType2: string) => void;
}

const DoctorSearchModal: React.FC<DoctorSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDoctor,
}) => {
  const [data, setData] = useState<getDoctorsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
          page: 1,
          limit: 100,
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
  }, [debouncedSearch, genderFilter, specializationFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGenderFilter(event.target.value);
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
  };
  const handleClearFilters = () => {
    setGenderFilter("");
    setSpecializationFilter({ id: "", name: "" });
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Select a Doctor for Chat
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Search Doctors"
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                placeholder="Search Doctors,"
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <SearchIcon />
                //     </InputAdornment>
                //   ),
                // }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel
                  id="gender-filter-label"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 15,
                    width: "100%",
                  }}
                >
                  Gender
                </InputLabel>
                <Select
                  size="small"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel
                  id="specialization-filter-label"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 15,
                    width: "100%",
                  }}
                >
                  Specialization
                </InputLabel>
                <Select
                  size="small"
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

            {/* <Grid item xs={12} md={2} textAlign="right">
              <Chip
                icon={<FilterListIcon />}
                label="Clear Filters"
                onClick={handleClearFilters}
                color="primary"
                variant="outlined"
                sx={{ height: 40 }}
              />
            </Grid> */}
          </Grid>
        </Card>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {data?.doctors.length} doctors found
            </Typography>

            <List sx={{ width: "100%" }}>
              {data?.doctors.map((doctor) => (
                <React.Fragment key={doctor._id}>
                  <ListItem
                    alignItems="center"
                    button
                    onClick={() => onSelectDoctor(doctor._id, "Doctor")}
                    sx={{
                      height: 80, // Reduced height
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      py: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={doctor.firstName}
                        src={doctor.profilePicture}
                        sx={{ width: 40, height: 40, mx: 1 }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" component="span">
                            {doctor.firstName}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            display="block"
                          >
                            {doctor.specialization.name}
                          </Typography>

                          <Box display="flex" alignItems="center" mt={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.gender === "male" ? "Male" : "Female"}
                            </Typography>
                          </Box>
                        </>
                      }
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDoctor(doctor._id, "Doctor");
                        onClose();
                      }}
                      sx={{
                        alignSelf: "center",
                        height: 30,
                        fontSize: "0.8rem",
                      }} // Reduced size
                    >
                      Chat Now
                    </Button>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>

            {data?.doctors.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body1">
                  No doctors match your search criteria. Please try different
                  filters.
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorSearchModal;
