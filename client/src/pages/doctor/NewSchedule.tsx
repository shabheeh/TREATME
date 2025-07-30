import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  // TextField,
  // FormControlLabel,
  // Switch,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  // Delete as DeleteIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  // AutoAwesome as AutoAwesomeIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
import {
  ISchedule,
  IDaySchedule,
  ISlot,
} from "../../types/doctor/doctor.types";
import scheduleService from "../../services/doctor/scheduleService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { toast } from "sonner";

const NewSchedule = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [schedules, setSchedules] = useState<IDaySchedule[]>([]);
  const doctor = useSelector((state: RootState) => state.user.doctor);

  const [newTimeSlot, setNewTimeSlot] = useState<{ startTime: Dayjs | null }>({
    startTime: null,
  });
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  // const [isBulkGenerateOpen, setIsBulkGenerateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // const [bulkGeneration, setBulkGeneration] = useState({
  //   startDate: dayjs(),
  //   endDate: dayjs().add(7, "day"),
  //   timeSlots: [{ start: "09:00", duration: 30 }],
  //   excludeWeekends: true,
  // });

  const formatTime = (date: Date) => dayjs(date).format("h:mm A");
  const formatDate = (date: Date) => dayjs(date).format("MMM D, YYYY");

  useEffect(() => {
    if (!doctor) return;
    const fetchSchedule = async () => {
      try {
        const scheduleResponse: ISchedule | null =
          await scheduleService.getSchedule(doctor._id);
        if (scheduleResponse && scheduleResponse.availability) {
          const scheduleWithDayjsDates = scheduleResponse.availability.map(
            (avail: IDaySchedule) => ({
              _id: avail._id,
              date: new Date(avail.date),
              slots: avail.slots.map((slot: ISlot) => ({
                ...slot,
                startTime: new Date(slot.startTime),
                endTime: new Date(slot.endTime),
              })),
            })
          );

          setSchedules(scheduleWithDayjsDates);
        } else {
          setSchedules([]);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch schedule"
        );
      }
    };
    fetchSchedule();
  }, [doctor]);

  const getScheduleStats = () => {
    const totalSlots = schedules.reduce(
      (acc, day) => acc + day.slots.length,
      0
    );
    const bookedSlots = schedules.reduce(
      (acc, day) => acc + day.slots.filter((slot) => slot.isBooked).length,
      0
    );
    const availableSlots = totalSlots - bookedSlots;
    const totalDays = schedules.length;

    return { totalSlots, bookedSlots, availableSlots, totalDays };
  };

  const stats = getScheduleStats();

  const addTimeSlot = async () => {
    if (!newTimeSlot.startTime || !doctor?._id) return;

    try {
      setLoading(true);

      if (dayjs(selectedDate).isSame(today, "day")) {
        if (newTimeSlot.startTime.isBefore(dayjs())) {
          setSnackbar({
            open: true,
            message: "Cannot set a slot time that has passed today",
            severity: "error",
          });
          return;
        }
      }

      const combinedLocalTime = selectedDate
        .hour(newTimeSlot.startTime.hour())
        .minute(newTimeSlot.startTime.minute())
        .second(0)
        .millisecond(0);

      const startTime = dayjs(combinedLocalTime).utc().toISOString();

      const updatedSchedule: ISchedule = await scheduleService.addTimeSlot(
        doctor._id,
        selectedDate.format("YYYY-MM-DD"),
        startTime,
        doctor.specialization.durationInMinutes
      );

      if (updatedSchedule && updatedSchedule.availability) {
        const scheduleWithDayjsDates = updatedSchedule.availability.map(
          (avail: IDaySchedule) => ({
            _id: avail._id,
            date: new Date(avail.date),
            slots: avail.slots.map((slot: ISlot) => ({
              ...slot,
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            })),
          })
        );

        setSchedules(scheduleWithDayjsDates);
      } else {
        setSchedules([]);
      }

      setSnackbar({
        open: true,
        message: "Time slot added successfully",
        severity: "success",
      });
      setNewTimeSlot({ startTime: null });
      setIsAddSlotDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to add time slot",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTimeSlot = async (date: Dayjs, slotId: string) => {
    if (!doctor?._id) return;

    try {
      setLoading(true);

      await scheduleService.removeTimeSlot(
        doctor._id,
        date.utc().format("YYYY-MM-DD"),
        slotId
      );

      setSchedules((prevSchedules) => {
        const dayIndex = prevSchedules.findIndex((day) =>
          dayjs(day.date).isSame(date, "day")
        );

        if (dayIndex === -1) return prevSchedules;

        const targetDay = prevSchedules[dayIndex];
        const filteredSlots = targetDay.slots.filter(
          (slot) => slot._id !== slotId
        );

        if (filteredSlots.length === 0) {
          return prevSchedules.filter((_, i) => i !== dayIndex);
        }

        const updatedDay = {
          ...targetDay,
          slots: filteredSlots,
        };

        const updatedSchedules = [...prevSchedules];
        updatedSchedules[dayIndex] = updatedDay;
        return updatedSchedules;
      });

      setSnackbar({
        open: true,
        message: "Time slot removed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to remove time slot",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // const generateBulkSlots = async () => {
  //   if (!doctor?._id) return;

  //   try {
  //     setLoading(true);

  //     if (!dayjs.isDayjs(bulkGeneration.startDate)) {
  //       bulkGeneration.startDate = dayjs(bulkGeneration.startDate);
  //     }
  //     if (!dayjs.isDayjs(bulkGeneration.endDate)) {
  //       bulkGeneration.endDate = dayjs(bulkGeneration.endDate);
  //     }

  //     console.log("Start:", bulkGeneration.startDate.format("YYYY-MM-DD"));
  //     console.log("End:", bulkGeneration.endDate.format("YYYY-MM-DD"));

  //     const updates: {
  //       date: string;
  //       slots: {
  //         startTime: string;
  //         endTime: string;
  //         isBooked: boolean;
  //       }[];
  //     }[] = [];

  //     let current = bulkGeneration.startDate.clone().startOf("day");
  //     const end = bulkGeneration.endDate.clone().startOf("day");

  //     const MAX_DAYS = 60;
  //     let loopCount = 0;

  //     while (current.isSameOrBefore(end, "day")) {
  //       console.log(
  //         "Loop count:",
  //         loopCount,
  //         "Current date:",
  //         current.format("YYYY-MM-DD")
  //       );
  //       if (++loopCount > MAX_DAYS) {
  //         throw new Error(
  //           "Date range too large. Please select a shorter range."
  //         );
  //       }

  //       const isWeekend = [0, 6].includes(current.day());

  //       if (!bulkGeneration.excludeWeekends || !isWeekend) {
  //         const slotsForDay = bulkGeneration.timeSlots.map((slot) => {
  //           const [startHour, startMin] = slot.start.split(":").map(Number);
  //           const start = dayjs
  //             .utc(current)
  //             .set("hour", startHour)
  //             .set("minute", startMin)
  //             .set("second", 0)
  //             .set("millisecond", 0);
  //           const end = start.add(slot.duration || 30, "minute");

  //           return {
  //             startTime: start.toISOString(),
  //             endTime: end.toISOString(),
  //             isBooked: false,
  //           };
  //         });

  //         updates.push({
  //           date: current.utc().format("YYYY-MM-DD"),
  //           slots: slotsForDay,
  //         });
  //       }

  //       current = current.add(1, "day");
  //     }

  //     await scheduleService.bulkUpdateSlots(doctor._id, updates);

  //     setSnackbar({
  //       open: true,
  //       message: "Bulk slots generated successfully",
  //       severity: "success",
  //     });
  //     setIsBulkGenerateOpen(false);
  //   } catch (error) {
  //     console.error("Bulk generation error:", error);
  //     setSnackbar({
  //       open: true,
  //       message:
  //         error instanceof Error
  //           ? error.message
  //           : "Failed to generate bulk slots",
  //       severity: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addBulkTimeSlot = () => {
  //   setBulkGeneration((prev) => ({
  //     ...prev,
  //     timeSlots: [...prev.timeSlots, { start: "09:00", duration: 30 }],
  //   }));
  // };

  // const removeBulkTimeSlot = (index: number) => {
  //   setBulkGeneration((prev) => ({
  //     ...prev,
  //     timeSlots: prev.timeSlots.filter((_, i) => i !== index),
  //   }));
  // };

  const StatsCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center", py: 3 }}>
        <Box sx={{ color, mb: 2 }}>{icon}</Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderSchedule = () => {
    if (schedules.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "grey.50" }}>
          <ScheduleIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No schedules set up yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding your first time slot or generate bulk slots for
            multiple days
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddSlotDialogOpen(true)}
            >
              Add Time Slot
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setIsBulkGenerateOpen(true)}
            >
              Generate Bulk Slots
            </Button> */}
          </Box>
        </Paper>
      );
    }

    return schedules.map((daySchedule) => {
      const date = dayjs(daySchedule.date);
      const isToday = date.isSame(today, "day");
      const availableSlots = daySchedule.slots.filter(
        (slot) => !slot.isBooked
      ).length;
      const bookedSlots = daySchedule.slots.filter(
        (slot) => slot.isBooked
      ).length;

      return (
        <Accordion key={date.format("YYYY-MM-DD")} defaultExpanded={isToday}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mr: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: isToday ? "bold" : "normal" }}
                >
                  {date.format("ddd, MMM D")}
                </Typography>
                {isToday && <Chip label="Today" size="small" color="primary" />}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  icon={<EventAvailableIcon />}
                  label={`${availableSlots} Available`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<EventBusyIcon />}
                  label={`${bookedSlots} Booked`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {daySchedule.slots.length} time slots scheduled
              </Typography>
              <Button
                startIcon={<AddIcon />}
                size="small"
                variant="outlined"
                onClick={() => {
                  setSelectedDate(date);
                  setIsAddSlotDialogOpen(true);
                }}
              >
                Add Slot
              </Button>
            </Box>
            {daySchedule.slots.length > 0 ? (
              <Grid container spacing={1}>
                {daySchedule.slots.map((slot) => (
                  <Grid item xs={12} sm={6} md={4} key={slot._id}>
                    <Card
                      variant="outlined"
                      sx={{
                        backgroundColor: slot.isBooked
                          ? "error.50"
                          : "success.50",
                        borderColor: slot.isBooked
                          ? "error.200"
                          : "success.200",
                      }}
                    >
                      <CardContent
                        sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                            </Typography>
                            <Chip
                              label={slot.isBooked ? "Booked" : "Available"}
                              size="small"
                              color={slot.isBooked ? "error" : "success"}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                          {!slot.isBooked && (
                            <Tooltip title="Remove slot">
                              <IconButton
                                size="small"
                                onClick={() => removeTimeSlot(date, slot._id!)}
                                disabled={loading}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                No time slots scheduled for this day
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  if (!doctor) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Schedule Management
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddSlotDialogOpen(true)}
              disabled={loading}
            >
              Add Slot
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setIsBulkGenerateOpen(true)}
              disabled={loading}
            >
              Bulk Generate
            </Button>
             */}
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Days"
              value={stats.totalDays}
              icon={<CalendarIcon sx={{ fontSize: 32 }} />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Slots"
              value={stats.totalSlots}
              icon={<ScheduleIcon sx={{ fontSize: 32 }} />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Available"
              value={stats.availableSlots}
              icon={<EventAvailableIcon sx={{ fontSize: 32 }} />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Booked"
              value={stats.bookedSlots}
              icon={<EventBusyIcon sx={{ fontSize: 32 }} />}
              color="error.main"
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TimelineIcon />
                Daily Schedules
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {renderSchedule()}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, position: "sticky", top: 24 }}>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue as Dayjs);
                  setIsAddSlotDialogOpen(true);
                }}
                minDate={today}
                maxDate={today.add(30, "day")}
                sx={{ width: "100%" }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Add Slot Dialog */}
        <Dialog
          open={isAddSlotDialogOpen}
          onClose={() => setIsAddSlotDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AddIcon color="primary" />
              Add Time Slot
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatDate(selectedDate.toDate())} • Duration:{" "}
              {doctor.specialization.durationInMinutes} minutes
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TimePicker
              label="Start Time"
              value={newTimeSlot.startTime}
              onChange={(newValue) =>
                setNewTimeSlot({ startTime: newValue as Dayjs })
              }
              views={["hours", "minutes"]}
              ampm
              sx={{ width: "100%" }}
            />
            {newTimeSlot.startTime && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Slot will be from {newTimeSlot.startTime.format("h:mm A")} to{" "}
                {newTimeSlot.startTime
                  .add(doctor.specialization.durationInMinutes, "minute")
                  .format("h:mm A")}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setIsAddSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addTimeSlot}
              disabled={!newTimeSlot.startTime || loading}
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            >
              {loading ? "Adding..." : "Add Slot"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Generate Dialog */}
        {/* <Dialog
          open={isBulkGenerateOpen}
          onClose={() => setIsBulkGenerateOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesomeIcon color="primary" />
              Generate Bulk Time Slots
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={bulkGeneration.startDate}
                  onChange={(newValue) =>
                    setBulkGeneration((prev) => ({
                      ...prev,
                      startDate: newValue as Dayjs,
                    }))
                  }
                  minDate={today}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={bulkGeneration.endDate}
                  onChange={(newValue) =>
                    setBulkGeneration((prev) => ({
                      ...prev,
                      endDate: newValue as Dayjs,
                    }))
                  }
                  minDate={bulkGeneration.startDate}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={bulkGeneration.excludeWeekends}
                      onChange={(e) =>
                        setBulkGeneration((prev) => ({
                          ...prev,
                          excludeWeekends: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Exclude weekends"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Time Slots
                </Typography>
                {bulkGeneration.timeSlots.map((slot, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      type="time"
                      label="Start Time"
                      value={slot.start}
                      onChange={(e) => {
                        const newSlots = [...bulkGeneration.timeSlots];
                        newSlots[index].start = e.target.value;
                        setBulkGeneration((prev) => ({
                          ...prev,
                          timeSlots: newSlots,
                        }));
                      }}
                      sx={{ flex: 1 }}
                    />

                    <IconButton
                      onClick={() => removeBulkTimeSlot(index)}
                      disabled={bulkGeneration.timeSlots.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addBulkTimeSlot}
                  variant="outlined"
                  size="small"
                >
                  Add Time Slot
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setIsBulkGenerateOpen(false)}>Cancel</Button>
            <Button
              onClick={generateBulkSlots}
              disabled={loading}
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />
              }
            >
              {loading ? "Generating..." : "Generate Slots"}
            </Button>
          </DialogActions>
        </Dialog> */}

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText>Copy Schedule</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText>Edit Template</ListItemText>
          </MenuItem>
        </Menu>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress />
              <Typography>Processing...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default NewSchedule;
