import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Paper,
  Button,
  useTheme,
  styled,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Group as UsersIcon,
  AttachMoney as MoneyIcon,
  Healing as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import dashboardService from "../../services/dashboard/DashboardService";
import { IPatient } from "../../types/patient/patient.types";
import { IDoctor } from "../../types/doctor/doctor.types";
import { IAppointmentPopulated } from "../../types/appointment/appointment.types";
import { toast } from "sonner";
import Loading from "../../components/basics/ui/Loading";
import { formatTime } from "../../utils/dateUtils";
import { calculateAge } from "../../helpers/ageCalculator";
import { StatCard } from "../../components/basics/ui/StatCard";
import dayjs from "dayjs";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#14b8a6",
  "#6366f1",
  "#a855f7",
];

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
  const navigate = useNavigate();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<
    | {
        month: string;
        revenue: number;
      }[]
    | null
  >(null);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [totalDoctors, setTotalDoctors] = useState<number | null>(null);
  const [todaysAppointments, setTodaysAppointments] = useState<
    IAppointmentPopulated[]
  >([]);
  const [specializationDoctorCount, setSpecializationDoctorCount] = useState<
    | {
        specialization: string;
        count: number;
      }[]
    | null
  >(null);
  const [ageGroupCounts, setAgeGroupCounts] = useState<
    | {
        ageGroup: string;
        count: number;
      }[]
    | null
  >(null);
  const [weeklyAppointments, setWeeklyAppointments] = useState<
    { day: string; count: number }[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);

  const getPercentage = (value: number, data: Array<{ count: number }>) => {
    const total = data.reduce((acc, item) => acc + item.count, 0);
    return ((value / total) * 100).toFixed(0);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const {
        monthlyData,
        totalRevenue,
        totalDoctors,
        totalPatients,
        doctors,
        patients,
        weeklyAppointments,
        todaysAppointments,
        ageGroupCounts,
        specializationDoctorCount,
      } = await dashboardService.getAdminDashboard();
      setMonthlyData(monthlyData);
      setTotalRevenue(totalRevenue);
      setDoctors(doctors);
      setPatients(patients);
      setTotalDoctors(totalDoctors);
      setTotalPatients(totalPatients);
      setTodaysAppointments(todaysAppointments);
      const filteredAgeGroups = ageGroupCounts.filter(
        (group) => group.count > 0
      );
      setAgeGroupCounts(filteredAgeGroups);
      setSpecializationDoctorCount(specializationDoctorCount);
      setWeeklyAppointments(weeklyAppointments);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
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
        {totalPatients && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={UsersIcon}
              title="Total Patients"
              value={`${totalPatients}`}
              description="Total Registed Patients"
              color={theme.palette.primary.main}
            />
          </Grid>
        )}

        {todaysAppointments && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={CalendarIcon}
              title="Today's Appointments"
              value={`${todaysAppointments.length}`}
              description={`${todaysAppointments && getNextHourAppointmentsCount(todaysAppointments)} Upcoming in next hour`}
              color={theme.palette.primary.main}
            />
          </Grid>
        )}
        {totalDoctors && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={ActivityIcon}
              title="Active Doctors"
              value={`${totalDoctors}`}
              description="Total Doctor Available"
              color={theme.palette.primary.main}
            />
          </Grid>
        )}
      </Grid>

      <TabsContainer>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <StyledTab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
          <StyledTab
            label="Appointments"
            id="tab-1"
            aria-controls="tabpanel-1"
          />
          <StyledTab label="Doctors" id="tab-2" aria-controls="tabpanel-2" />
          <StyledTab label="Patients" id="tab-3" aria-controls="tabpanel-3" />
        </StyledTabs>
      </TabsContainer>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
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
                                <Paper
                                  elevation={3}
                                  style={{ padding: "10px" }}
                                >
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
                                <Paper
                                  elevation={3}
                                  style={{ padding: "10px" }}
                                >
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
                    <Typography>
                      no Weekly appointments data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center">
                    <UsersIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Patient Demographics</Typography>
                  </Box>
                }
                subheader="Age distribution of patients"
              />
              <CardContent>
                <Box height={300}>
                  {ageGroupCounts ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageGroupCounts}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ ageGroup, percent }) =>
                            `${ageGroup}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="ageGroup"
                        >
                          {ageGroupCounts.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.ageGroup}`}
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
                                    {payload[0].payload.ageGroup}:{" "}
                                    {payload[0].payload.count} patients (
                                    {getPercentage(
                                      Number(payload[0].payload.count),
                                      ageGroupCounts
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
                  ) : (
                    <Typography>No Data available</Typography>
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
                    <ActivityIcon sx={{ mr: 1, color: "teal" }} />
                    <Typography variant="h6">Doctor Specialties</Typography>
                  </Box>
                }
                subheader="Distribution of doctors by specialty"
              />
              <CardContent>
                <Box height={300}>
                  {specializationDoctorCount ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={specializationDoctorCount}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ specialization, percent }) =>
                            `${specialization}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="specialization"
                        >
                          {specializationDoctorCount.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.specialization}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <Paper
                                  elevation={3}
                                  style={{ padding: "10px" }}
                                >
                                  <Typography variant="body2">
                                    {data.specialization}: {data.count} doctors
                                    (
                                    {getPercentage(
                                      Number(data.count),
                                      specializationDoctorCount
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
                  ) : (
                    <Typography>No Data available</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <ClockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Today's Appointments</Typography>
              </Box>
            }
            subheader="All scheduled appointments for today"
          />
          <CardContent>
            <TableContainer>
              <Table aria-label="today's appointments">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Type</TableCell>
                    {/* <TableCell>Actions</TableCell> */}
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
                          {appointment.doctor.firstName}{" "}
                          {appointment.doctor.lastName}
                        </TableCell>
                        <TableCell>{appointment.specialization.name}</TableCell>
                        {/* <TableCell>
                          <Button
                            color="primary"
                            onClick={() =>
                              navigate(`/appointments/${appointment._id}`)
                            }
                            size="small"
                          >
                            View Details
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <UsersIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Doctors</Typography>
              </Box>
            }
            subheader="Currently active doctors and their stats"
          />
          <CardContent>
            <TableContainer>
              <Table aria-label="active doctors">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Specialty</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Experience</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <TableRow key={doctor._id}>
                        <TableCell>
                          {doctor.firstName} {doctor.lastName}
                        </TableCell>
                        <TableCell>{doctor.specialization.name}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                        <TableCell>{doctor.gender}</TableCell>
                        <TableCell>{doctor.experience} Years</TableCell>

                        {/* <TableCell>
                          <Button
                            color="primary"
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                            size="small"
                          >
                            View Profile
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {totalDoctors && totalDoctors > 5 && (
              <Box display="flex" justifyContent="center" pt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/admin/doctors")}
                >
                  View All Doctors
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <UsersIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Patients</Typography>
              </Box>
            }
            subheader="Recently active patients"
          />
          <CardContent>
            <TableContainer>
              <Table aria-label="active doctors">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>email</TableCell>
                    <TableCell>phone</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>age</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell>
                          {patient.firstName} {patient.lastName}
                        </TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>
                          {calculateAge(patient.dateOfBirth)}
                        </TableCell>
                        {/* <TableCell>
                          <Button
                            color="primary"
                            onClick={() => navigate(`/doctors/${patient._id}`)}
                            size="small"
                          >
                            View Profile
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {totalPatients && totalPatients > 5 && (
              <Box display="flex" justifyContent="center" pt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/admin/patients")}
                >
                  View All Patients
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>
    </div>
  );
};

export default Dashboard;
