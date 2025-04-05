import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  styled,
  Button,
  Paper,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Group as UsersIcon,
  Healing as ActivityIcon,
  AccessTime as ClockIcon,
  Money as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import dashboardService from "../../services/dashboard/DashboardService";
import { IPatientForDoctor } from "../../types/patient/patient.types";
import { IAppointmentPopulated } from "../../types/appointment/appointment.types";
import { toast } from "sonner";
import Loading from "../../components/basics/ui/Loading";
import { formatMonthDay, formatTime } from "../../utils/dateUtils";
import { calculateAge } from "../../helpers/ageCalculator";
import { StatCard } from "../../components/basics/ui/StatCard";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  position: "relative",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  fontSize: "0.875rem",
  fontWeight: 500,
  marginRight: theme.spacing(4),
  "&.Mui-selected": {
    fontWeight: 600,
  },
}));

const StyledTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [todaysAppointments, setTodaysAppointments] = useState<
    IAppointmentPopulated[]
  >([]);
  const [totalTodaysAppointments, setTotalTodaysAppointments] =
    useState<number>(0);

  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<
    | {
        month: string;
        revenue: number;
      }[]
    | null
  >(null);

  const [weeklyAppointments, setWeeklyAppointments] = useState<
    { day: string; count: number }[] | null
  >(null);

  const [patients, setPatients] = useState<IPatientForDoctor[]>([]);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const {
        monthlyData,
        totalRevenue,
        averageRating,
        patients,
        todaysAppointments,
        weeklyAppointments,
        totalPatients,
        totalTodaysAppointment,
      } = await dashboardService.getDoctorDashboard();
      setMonthlyData(monthlyData);
      setTotalRevenue(totalRevenue);
      setWeeklyAppointments(weeklyAppointments);
      setTodaysAppointments(todaysAppointments);
      setTotalPatients(totalPatients);
      setPatients(patients);
      setAverageRating(averageRating);
      setTotalTodaysAppointments(totalTodaysAppointment);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Somethig went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const getNextHourAppointmentsCount = (
    appointments: IAppointmentPopulated[]
  ) => {
    const now = dayjs();
    const nextHour = now.add(1, "hour");

    return appointments.filter((appointment) =>
      dayjs(appointment.date).isBetween(now, nextHour, "minute", "[)")
    ).length;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {totalRevenue && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={MoneyIcon}
              title="Total Revenue"
              value={`₹${totalRevenue}`}
              description="Total revenue earned"
              color={theme.palette.primary.main}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CalendarIcon}
            title="Today's Appointments"
            value={`${totalTodaysAppointments}`}
            description={`${todaysAppointments && getNextHourAppointmentsCount(todaysAppointments)} upcoming in next hour`}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={UsersIcon}
            title="My Patients"
            value={`${totalPatients}`}
            description="Patients treated by me"
            color={theme.palette.info.main}
          />
        </Grid>
        {averageRating && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={ActivityIcon}
              title="Patient Satisfaction"
              value={`${averageRating}/5.0`}
              description="Ratings given by patients"
              color={theme.palette.success.main}
            />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Monthly Revenue</Typography>
                </Box>
              }
              subheader="Total revenue generated over the past 12 months"
            />
            <CardContent>
              <Box height={300}>
                {monthlyData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].payload.month}: ₹
                                  {payload[0].payload.revenue.toLocaleString()}
                                </Typography>
                              </Paper>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography>monthly Currently not availble</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <CalendarIcon sx={{ mr: 1, color: "teal" }} />
                  <Typography variant="h6">Weekly Appointments</Typography>
                </Box>
              }
              subheader="Number of appointments scheduled per day"
            />
            <CardContent>
              <Box height={300}>
                {weeklyAppointments ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyAppointments}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].payload.day}:{" "}
                                  {payload[0].payload.count} appointments
                                </Typography>
                              </Paper>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography>no Weekly appointments data available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TabsContainer>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="doctor dashboard tabs"
        >
          <StyledTab
            label="Today's Appointments"
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <StyledTab
            label="My Patients"
            id="tab-1"
            aria-controls="tabpanel-1"
          />
        </StyledTabs>
      </TabsContainer>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <ClockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Todays Appointments</Typography>
              </Box>
            }
            subheader="Your scheduled appointments for today"
          />
          <CardContent>
            <TableContainer>
              <Table aria-label="doctor appointments">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todaysAppointments && todaysAppointments.length > 0 ? (
                    todaysAppointments.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell>
                          {appointment.patient.firstName}{" "}
                          {appointment.patient.lastName}
                        </TableCell>
                        <TableCell>{formatTime(appointment.date)}</TableCell>
                        <TableCell>
                          {calculateAge(appointment.patient.dateOfBirth)}
                        </TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No appointments scheculed for today
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" pt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/doctor/appointments")}
              >
                View All
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <UsersIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">My Patients</Typography>
              </Box>
            }
            subheader="Patients under your care"
          />
          <CardContent>
            <TableContainer>
              <Table aria-label="doctor patients">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Last Visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell>
                          {patient.firstName} {patient.lastName}
                        </TableCell>
                        <TableCell>
                          {calculateAge(patient.dateOfBirth)}
                        </TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{`${formatMonthDay(patient.lastVisit)} ${formatTime(patient.lastVisit)}`}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {totalPatients && totalPatients > 0 && (
              <Box display="flex" justifyContent="center" pt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/doctor/patients")}
                >
                  View All Patients
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <ActivityIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Service Breakdown</Typography>
                    </Box>
                  }
                  subheader="Distribution of your medical services"
                />
                <CardContent>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={doctorPerformanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {doctorPerformanceData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <Paper
                                  elevation={3}
                                  style={{ padding: "10px" }}
                                >
                                  <Typography variant="body2">
                                    {payload[0].name}: {payload[0].value}{" "}
                                    sessions (
                                    {getPercentage(
                                      Number(payload[0].value),
                                      doctorPerformanceData
                                    )}
                                    %)
                                  </Typography>
                                </Paper>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">Patient Satisfaction</Typography>
                    </Box>
                  }
                  subheader="Feedback ratings from your patients"
                />
                <CardContent>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientSatisfactionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {patientSatisfactionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <Paper
                                  elevation={3}
                                  style={{ padding: "10px" }}
                                >
                                  <Typography variant="body2">
                                    {payload[0].name}: {payload[0].value}{" "}
                                    ratings (
                                    {getPercentage(
                                      Number(payload[0].value),
                                      patientSatisfactionData
                                    )}
                                    %)
                                  </Typography>
                                </Paper>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel> */}
    </Box>
  );
};

export default Dashboard;
