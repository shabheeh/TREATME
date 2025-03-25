import React, { useState } from "react";
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
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  color: string;
}
const revenueData = [
  { name: "Jan", revenue: 12500 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 18000 },
  { name: "Apr", revenue: 16500 },
  { name: "May", revenue: 19200 },
  { name: "Jun", revenue: 22000 },
  { name: "Jul", revenue: 23500 },
  { name: "Aug", revenue: 24800 },
  { name: "Sep", revenue: 25300 },
  { name: "Oct", revenue: 27000 },
  { name: "Nov", revenue: 26500 },
  { name: "Dec", revenue: 28000 },
];

const appointmentsData = [
  { name: "Mon", appointments: 18 },
  { name: "Tue", appointments: 22 },
  { name: "Wed", appointments: 28 },
  { name: "Thu", appointments: 25 },
  { name: "Fri", appointments: 20 },
  { name: "Sat", appointments: 12 },
  { name: "Sun", appointments: 5 },
];

const patientDemographicsData = [
  { name: "0-18", value: 250 },
  { name: "19-35", value: 480 },
  { name: "36-50", value: 520 },
  { name: "51-65", value: 380 },
  { name: "65+", value: 220 },
];

const specialtyDistributionData = [
  { name: "Cardiology", value: 8 },
  { name: "Pediatrics", value: 6 },
  { name: "Neurology", value: 5 },
  { name: "Orthopedics", value: 4 },
  { name: "Dermatology", value: 3 },
  { name: "Oncology", value: 3 },
  { name: "Other", value: 3 },
];

const todayAppointments = [
  {
    id: 1,
    patientName: "John Smith",
    time: "09:00 AM",
    doctor: "Dr. Sarah Johnson",
    type: "Checkup",
  },
  {
    id: 2,
    patientName: "Emily Davis",
    time: "10:15 AM",
    doctor: "Dr. Michael Chen",
    type: "Consultation",
  },
  {
    id: 3,
    patientName: "Robert Wilson",
    time: "11:30 AM",
    doctor: "Dr. Sarah Johnson",
    type: "Follow-up",
  },
  {
    id: 4,
    patientName: "Maria Garcia",
    time: "01:45 PM",
    doctor: "Dr. James Williams",
    type: "Procedure",
  },
  {
    id: 5,
    patientName: "William Brown",
    time: "03:00 PM",
    doctor: "Dr. Michael Chen",
    type: "Consultation",
  },
];

const activeDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    patients: 48,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    patients: 36,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Dr. James Williams",
    specialty: "Orthopedics",
    patients: 42,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    patients: 54,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Dr. David Kim",
    specialty: "Dermatology",
    patients: 30,
    rating: 4.6,
  },
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

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  color,
}) => {
  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Icon style={{ color }} />
        </Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

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

  const getPercentage = (value: number, data: Array<{ value: number }>) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    return ((value / total) * 100).toFixed(0);
  };

  return (
    <div>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={MoneyIcon}
            title="Total Revenue"
            value="$124,750"
            description="+12% from previous month"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={UsersIcon}
            title="Total Patients"
            value="1,823"
            description="+85 new patients this month"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CalendarIcon}
            title="Today's Appointments"
            value="28"
            description="5 upcoming in next hour"
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ActivityIcon}
            title="Active Doctors"
            value="32"
            description="92% satisfaction rate"
            color={theme.palette.success.main}
          />
        </Grid>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
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
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].payload.name}: $
                                  {payload[0].value.toLocaleString()}
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentsData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].payload.name}: {payload[0].value}{" "}
                                  appointments
                                </Typography>
                              </Paper>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="appointments"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientDemographicsData}
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
                        {patientDemographicsData.map((entry, index) => (
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
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].name}: {payload[0].value} patients
                                  (
                                  {getPercentage(
                                    Number(payload[0].value),
                                    patientDemographicsData
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
                    <ActivityIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Doctor Specialties</Typography>
                  </Box>
                }
                subheader="Distribution of doctors by specialty"
              />
              <CardContent>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={specialtyDistributionData}
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
                        {specialtyDistributionData.map((entry, index) => (
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
                              <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="body2">
                                  {payload[0].name}: {payload[0].value} doctors
                                  (
                                  {getPercentage(
                                    Number(payload[0].value),
                                    specialtyDistributionData
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          onClick={() =>
                            navigate(`/appointments/${appointment.id}`)
                          }
                          size="small"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableCell>Patients</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.patients}</TableCell>
                      <TableCell>{doctor.rating}/5.0</TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          onClick={() => navigate(`/doctors/${doctor.id}`)}
                          size="small"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            <Box display="flex" justifyContent="center" p={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/patients")}
              >
                View All Patients
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
    </div>
  );
};

export default Dashboard;
