import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

import {
  ISchedule,
  IDaySchedule,
  ISlot,
  ISlotInput,
  IDayScheduleInput,
} from "../../types/doctor/doctor.types";
import scheduleService from "../../services/doctor/scheduleService";

dayjs.extend(isBetween);
dayjs.extend(utc);

export default function ScheduleManagement() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [schedules, setSchedules] = useState<IDaySchedule[]>([]);
  const [schedulesInputs, setSchedulesInputs] = useState<IDayScheduleInput[]>(
    []
  );
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<{
    startTime: Dayjs | null;
    endTime: Dayjs | null;
  }>({
    startTime: null,
    endTime: null,
  });
  const doctor = useSelector((state: RootState) => state.user.doctor);

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
          const scheduleWithStringTimes = scheduleResponse.availability.map(
            (avail: IDaySchedule) => ({
              _id: avail._id,
              date: new Date(avail.date).toISOString(),
              slots: avail.slots.map((slot: ISlot) => ({
                ...slot,
                startTime: new Date(slot.startTime).toISOString(),
                endTime: new Date(slot.endTime).toISOString(),
              })),
            })
          );
          setSchedulesInputs(scheduleWithStringTimes);
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

  const formatDate = (date: Date) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  const formatTime = (date: Date | null | undefined) => {
    if (!date) {
      return "Invalid Time";
    }
    return dayjs(date).format("hh:mm A");
  };

  const addTimeSlot = async () => {
    if (!newTimeSlot.startTime) return;

    const slotDuration = doctor?.specialization.durationInMinutes || 30;

    const startTime = dayjs(selectedDate)
      .set("hour", newTimeSlot.startTime.hour())
      .set("minute", newTimeSlot.startTime.minute())
      .toISOString();

    console.log(startTime, "startTime");
    const endTime = dayjs(startTime).add(slotDuration, "minute").toISOString();

    if (dayjs(selectedDate).isSame(today, "day")) {
      const currentTime = dayjs();
      if (newTimeSlot.startTime.isBefore(currentTime)) {
        toast.warning("Cannot set a slot time that passed today");
        return;
      }
    }

    const existingAvailability = schedules.find((avail) =>
      dayjs(avail.date).isSame(selectedDate, "day")
    );
    const existingSlots = existingAvailability
      ? existingAvailability.slots
      : [];

    const isDuplicateStartTime = existingSlots.some((slot) =>
      dayjs(slot.startTime).isSame(startTime)
    );
    if (isDuplicateStartTime) {
      toast.warning("A time slot with this start time already exists");
      return;
    }

    const isOverlapping = existingSlots.some(
      (slot) =>
        dayjs(startTime).isBetween(slot.startTime, slot.endTime) ||
        dayjs(endTime).isBetween(slot.startTime, slot.endTime) ||
        dayjs(slot.startTime).isBetween(startTime, endTime)
    );
    if (isOverlapping) {
      toast.warning("Time slot overlaps with an existing slot");
      return;
    }

    const newSlot: ISlotInput = {
      startTime,
      endTime,
      isBooked: false,
    };

    const updatedSchedules = schedulesInputs.map((avail) => {
      if (dayjs(avail.date).isSame(selectedDate, "day")) {
        return {
          ...avail,
          slots: [...avail.slots, newSlot]
            .map((slot) => ({
              ...slot,
              startTime: new Date(slot.startTime).toISOString(),
              endTime: new Date(slot.endTime).toISOString(),
            }))
            .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime))),
        };
      }
      return avail;
    });

    if (!existingAvailability) {
      updatedSchedules.push({
        date: selectedDate.toISOString(),
        slots: [newSlot],
      });
    }

    try {
      if (!doctor) return;

      const result = await scheduleService.updateSchedule(doctor._id, {
        availability: updatedSchedules,
      });

      const formattedResult = result.availability.map(
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

      setSchedules(formattedResult);
      toast.success("Time slot added successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setNewTimeSlot({ startTime: null, endTime: null });
      setIsAddSlotDialogOpen(false);
    }
  };

  const removeTimeSlot = async (date: Dayjs, slotId: string) => {
    try {
      const existingAvailability = schedules.find((avail) =>
        dayjs(avail.date).isSame(date, "day")
      );
      if (!existingAvailability) {
        toast.error("No availability found for the selected date");
        return;
      }

      const selectedSlot = existingAvailability.slots.find(
        (slot) => slot._id === slotId
      );
      if (selectedSlot && selectedSlot.isBooked) {
        toast.error("Cannot remove Booked slot");
        return;
      }

      // Filter out the slot to be removed
      const updatedSlots = existingAvailability.slots.filter(
        (slot) => slot._id !== slotId
      );

      // Update the availability for the selected date
      const updatedAvailability: IDaySchedule = {
        ...existingAvailability,
        slots: updatedSlots,
      };

      // Update the schedules array
      const updatedSchedules = schedules.map((avail) =>
        dayjs(avail.date).isSame(date, "day") ? updatedAvailability : avail
      );

      if (!doctor) {
        toast.error("Doctor information is not available");
        return;
      }

      // Prepare the payload for the backend
      const updatedSchedulesInput: IDayScheduleInput[] = updatedSchedules.map(
        (avail) => ({
          date: new Date(avail.date).toISOString(), // Ensure `date` is a Date object
          slots: avail.slots.map((slot) => ({
            startTime: dayjs(slot.startTime).utc().local().format(), // ISO string
            endTime: dayjs(slot.endTime).utc().local().format(), // ISO string
            isBooked: slot.isBooked,
          })),
        })
      );

      // Update the local state
      setSchedulesInputs(updatedSchedulesInput);

      // Send the updated schedule to the backend
      await scheduleService.updateSchedule(doctor._id, {
        availability: updatedSchedulesInput,
      });

      // Update the schedules state
      setSchedules(updatedSchedules);

      toast.success("Time slot removed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove time slot"
      );
    }
  };

  const renderSchedule = () => {
    if (schedules.length === 0) {
      return (
        <Box sx={{ m: 2, color: "GrayText" }}>
          <Typography variant="h6">Setup you daily schedules</Typography>
        </Box>
      );
    } else {
      return schedules.map((daySchedule) => {
        const date = dayjs(daySchedule.date);
        const isToday = date.isSame(today, "day");
        return (
          <Grid item xs={12} key={date.format("YYYY-MM-DD")} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: isToday ? "bold" : "normal" }}
              >
                {date.format("ddd, MMM D")}
                {isToday && (
                  <span style={{ marginLeft: "8px", color: "teal" }}>
                    Today
                  </span>
                )}
              </Typography>
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={() => {
                  setSelectedDate(date);
                  setIsAddSlotDialogOpen(true);
                }}
              >
                Add Slot
              </Button>
            </Box>
            {daySchedule.slots.length ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {daySchedule.slots.map((slot) => (
                  <Box
                    key={slot._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(0,0,0,0.05)",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {`${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}`}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeTimeSlot(date, slot._id!)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not Scheduled
              </Typography>
            )}
          </Grid>
        );
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
            Schedule Management
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {renderSchedule()}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue as Dayjs);
                  setIsAddSlotDialogOpen(true);
                }}
                minDate={today}
                maxDate={today.add(20, "day")}
              />
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={isAddSlotDialogOpen}
          onClose={() => setIsAddSlotDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle color="primary" sx={{ my: 1 }}>
            Add Time Slot for {formatDate(selectedDate.toDate())}
            {doctor?.specialization?.name && (
              <Typography variant="body2" color="text.secondary">
                {doctor.specialization.name} - Slot Duration:{" "}
                {doctor.specialization.durationInMinutes || 30} mins
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <TimePicker
                sx={{ width: "100%" }}
                label="Start Time"
                value={newTimeSlot.startTime}
                onChange={(newValue) =>
                  setNewTimeSlot((prev) => ({
                    ...prev,
                    startTime: newValue as Dayjs,
                    endTime: newValue
                      ? newValue.add(
                          doctor?.specialization?.durationInMinutes || 30,
                          "minute"
                        )
                      : null,
                  }))
                }
                views={["hours", "minutes"]}
                ampm
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTimeSlot} disabled={!newTimeSlot.startTime}>
              Add Slot
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
}
