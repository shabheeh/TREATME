import React, { useState, useRef, ChangeEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Divider,
  Autocomplete,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

import useRevenueReportData from "../../hooks/useRevenueReport";
import useDoctorsRevenueSummary from "../../hooks/useDoctorsRevenueSummary";
import {
  ReportType,
  TimeFilter,
} from "../../types/revenueReport/revenueReport.types";
import { useGetDoctors } from "../../hooks/useGetDoctors";
import { IDoctor } from "../../types/doctor/doctor.types";

const RevenueReport = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const [reportType, setReportType] = useState<ReportType>("admin");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  const {
    currentData: revenueCurrentData,
    loading: revenueLoading,
    error: revenueError,
    setError: setRevenueError,
  } = useRevenueReportData({
    reportType,
    timeFilter,
    doctorId,
    startDate,
    endDate,
    page,
  });

  const {
    currentData: doctorsCurrentData,
    loading: doctorsLoading,
    error: doctorsError,
    setError: setDoctorsError,
  } = useDoctorsRevenueSummary({
    reportType,
    timeFilter,
    startDate,
    endDate,
    page,
  });

  const { doctors } = useGetDoctors({ page: 1, limit: 20 });

  const handleSelectDoctor = (
    _event: React.SyntheticEvent,
    value: IDoctor | null
  ) => {
    setSelectedDoctor(value);
    setDoctorId(value?._id || null);
  };

  const getCurrentData = () => {
    if (reportType === "all") {
      return {
        transactions: [],
        summary: doctorsCurrentData.summary,
        doctors: doctorsCurrentData.doctors,
        pagination: doctorsCurrentData.pagination,
        dateRange: null,
      };
    } else {
      return {
        transactions: revenueCurrentData.transactions,
        summary: revenueCurrentData.summary,
        doctors: [],
        pagination: revenueCurrentData.pagination,
        dateRange: revenueCurrentData.dateRange,
      };
    }
  };

  const currentData = getCurrentData();

  const loading = revenueLoading || doctorsLoading;
  const error = revenueError || doctorsError;

  const clearErrors = () => {
    setRevenueError(null);
    setDoctorsError(null);
  };

  const handleChangePage = (_event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handlePrint = () => {
    window.print();
  };

  const getReportTitle = () => {
    if (reportType === "admin") {
      return "Platform Revenue Report";
    } else if (reportType === "doctor" && selectedDoctor) {
      return `Doctor Revenue Report - Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`;
    } else if (reportType === "all") {
      return "All Doctors Revenue Report";
    } else {
      return "All Doctors Revenue Report";
    }
  };

  const getDateRangeText = () => {
    if (currentData.dateRange) {
      return `${new Date(currentData.dateRange.startDate).toLocaleDateString()} to ${new Date(currentData.dateRange.endDate).toLocaleDateString()}`;
    }

    switch (timeFilter) {
      case "weekly":
        return "Weekly Report";
      case "monthly":
        return "Monthly Report";
      case "yearly":
        return "Yearly Report";
      case "custom":
        return `Custom Range: ${startDate} to ${endDate}`;
      default:
        return "Monthly Report";
    }
  };

  const handleReportTypeChange = (newReportType: ReportType) => {
    setReportType(newReportType);
    setSelectedDoctor(null);
    setPage(1);
    clearErrors();
  };

  const handleTimeFilterChange = (newTimeFilter: TimeFilter) => {
    setTimeFilter(newTimeFilter);
    setPage(1);
    clearErrors();
  };

  const getAdditionalStats = () => {
    if (!currentData.summary) return null;

    const commissionPercentage =
      currentData.summary.totalFees > 0
        ? (
            (currentData.summary.totalCommission /
              currentData.summary.totalFees) *
            100
          ).toFixed(1)
        : 0;

    const doctorEarningPercentage =
      currentData.summary.totalFees > 0
        ? (
            (currentData.summary.totalDoctorEarnings /
              currentData.summary.totalFees) *
            100
          ).toFixed(1)
        : 0;

    return {
      commissionPercentage,
      doctorEarningPercentage,
    };
  };

  const additionalStats = getAdditionalStats();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: "white" }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ color: "#0f766e", fontWeight: "bold", mb: 1 }}
            >
              Revenue Reports
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#64748b" }}>
              Comprehensive revenue analysis and reporting
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "left", md: "right" } }}
          >
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={loading}
              sx={{
                backgroundColor: "#0f766e",
                "&:hover": { backgroundColor: "#0d5e52" },
                mr: 2,
              }}
            >
              Print Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              disabled={loading}
              sx={{
                borderColor: "#0f766e",
                color: "#0f766e",
                "&:hover": {
                  borderColor: "#0d5e52",
                  backgroundColor: "#f0fdfa",
                },
              }}
            >
              Export PDF
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#0f766e" }}>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) =>
                  handleReportTypeChange(e.target.value as ReportType)
                }
                label="Report Type"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#14b8a6",
                  },
                }}
              >
                <MenuItem value="admin">Admin Revenue</MenuItem>
                <MenuItem value="doctor">Doctor Revenue</MenuItem>
                <MenuItem value="all">All Doctors</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#0f766e" }}>Time Period</InputLabel>
              <Select
                value={timeFilter}
                onChange={(e) =>
                  handleTimeFilterChange(e.target.value as TimeFilter)
                }
                label="Time Period"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#14b8a6",
                  },
                }}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {reportType === "doctor" && (
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(doctor) =>
                  `Dr. ${doctor.firstName} ${doctor.lastName}`
                }
                value={selectedDoctor}
                onChange={handleSelectDoctor}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Doctor"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                      },
                    }}
                  />
                )}
              />
            </Grid>
          )}

          {timeFilter === "custom" && (
            <>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#14b8a6",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#14b8a6",
                    },
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress sx={{ color: "#0f766e" }} />
        </Box>
      )}

      <div ref={printRef}>
        <Paper elevation={3} sx={{ backgroundColor: "white" }}>
          <Box sx={{ p: 3, backgroundColor: "#0f766e", color: "white" }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {getReportTitle()}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {getDateRangeText()}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Generated on: {new Date().toLocaleDateString()}
                </Typography>
                {currentData.pagination && (
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Page {currentData.pagination.page} •{" "}
                    {currentData.pagination.count} records
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 3 }}>
            {reportType === "all" && currentData.doctors.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: "#0f766e", mb: 3, fontWeight: "bold" }}
                >
                  Doctors Revenue Summary
                </Typography>
                <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f0fdfa" }}>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Doctor Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Specialization
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                          align="right"
                        >
                          Total Appointments
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                          align="right"
                        >
                          Total Earnings
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                          align="right"
                        >
                          Average per Consultation
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentData.doctors.map((doctor) => (
                        <TableRow key={doctor.doctorId} hover>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {doctor.doctorName}
                          </TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "medium" }}
                          >
                            {doctor.totalAppointments}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "medium", color: "#059669" }}
                          >
                            ₹{doctor.totalEarnings}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "medium" }}
                          >
                            ₹{doctor.averageEarningPerConsultation}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {(reportType === "admin" || reportType === "doctor") && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: "#0f766e", mb: 3, fontWeight: "bold" }}
                >
                  Detailed Transaction Report
                </Typography>
                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f0fdfa" }}>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Appointment ID
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Date & Time
                        </TableCell>
                        {reportType === "admin" && (
                          <TableCell
                            sx={{ fontWeight: "bold", color: "#0f766e" }}
                          >
                            Doctor
                          </TableCell>
                        )}
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Patient Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                          align="right"
                        >
                          Consultation Fee
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                          align="right"
                        >
                          {reportType === "admin"
                            ? "Platform Commission"
                            : "Doctor Earning"}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentData.transactions.map((appointment) => (
                        <TableRow key={appointment.appointmentId} hover>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {appointment.appointmentId}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium" }}
                              >
                                {new Date(
                                  appointment.date
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#64748b" }}
                              >
                                {appointment.time ||
                                  new Date(
                                    appointment.date
                                  ).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          {reportType === "admin" && (
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium" }}
                                >
                                  {appointment.doctorName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#64748b" }}
                                >
                                  {appointment.specialization}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          <TableCell>{appointment.patientName}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "medium" }}
                          >
                            {appointment.consultationFee}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "medium", color: "#059669" }}
                          >
                            ₹
                            {reportType === "admin"
                              ? appointment.platformCommission
                              : appointment.doctorEarning}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              size="small"
                              sx={{
                                backgroundColor:
                                  appointment.status === "completed"
                                    ? "#dcfce7"
                                    : "#fef3c7",
                                color:
                                  appointment.status === "completed"
                                    ? "#166534"
                                    : "#92400e",
                                fontWeight: "medium",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {currentData.pagination &&
                  currentData.pagination.totalPages > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                        alignItems: "center",
                      }}
                    >
                      <Pagination
                        count={currentData.pagination.totalPages}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        size="large"
                        sx={{
                          "& .MuiPagination-ul": {
                            justifyContent: "center",
                          },
                          "& .Mui-selected": {
                            backgroundColor: "#0f766e !important",
                            color: "white",
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          alignSelf: "center",
                          ml: 2,
                          color: "#64748b",
                        }}
                      >
                        Showing page {page} of{" "}
                        {currentData.pagination.totalPages}(
                        {currentData.pagination.count} total records)
                      </Typography>
                    </Box>
                  )}
              </>
            )}

            {currentData.summary && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "#f0fdfa",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#0f766e", mb: 3, fontWeight: "bold" }}
                >
                  Revenue Summary & Analytics
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#0f766e", fontWeight: "bold", mb: 2 }}
                    >
                      Financial Overview
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Total Revenue Generated:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#0f766e" }}
                        >
                          ₹{currentData.summary.totalFees}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Platform Commission:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#f59e0b" }}
                        >
                          ₹{currentData.summary.totalCommission} (
                          {additionalStats?.commissionPercentage}%)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Doctor Earnings:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#059669" }}
                        >
                          ₹{currentData.summary.totalDoctorEarnings} (
                          {additionalStats?.doctorEarningPercentage}%)
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Average Fee per Consultation:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8b5cf6" }}
                        >
                          ₹{currentData.summary.averageFeePerConsultation}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#0f766e", fontWeight: "bold", mb: 2 }}
                    >
                      Operational Metrics
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Total Completed Appointments:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#0288d1" }}
                        >
                          {currentData.summary.appointmentCount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Report Period:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {getDateRangeText()}
                        </Typography>
                      </Box>
                      {currentData.pagination && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Records Shown:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {currentData.pagination.count} records
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Current Page:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Page {currentData.pagination.page}
                            </Typography>
                          </Box>
                        </>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Generated On:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {new Date().toLocaleDateString("en-IN")} at{" "}
                          {new Date().toLocaleTimeString("en-IN")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                {/* <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "#e0f2fe",
                    borderRadius: 1,
                    borderLeft: "4px solid #0288d1",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#01579b", fontWeight: "medium", mb: 1 }}
                  >
                    📊 Revenue Distribution Policy
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#0277bd" }}>
                    Platform maintains a{" "}
                    {additionalStats?.commissionPercentage || "10"}% commission
                    on all completed consultations. Doctors receive{" "}
                    {additionalStats?.doctorEarningPercentage || "90"}% of the
                    consultation fee as their earnings.
                  </Typography>
                </Box> */}
              </Box>
            )}

            {!loading && !currentData.summary && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>
                  No data available for the selected filters
                </Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                  Try adjusting your date range or filters to view revenue data
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </div>
    </Box>
  );
};

export default RevenueReport;
