import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Alert,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import scheduleService from "../../../services/doctor/scheduleService";
import { IDaySchedule, ISlot } from "../../../types/doctor/doctor.types";
import { toast } from "sonner";
import { filterAvailability } from "../../../helpers/filterAvailability";
import { formatTime } from "../../../utils/dateUtils";
import { TimeChip } from "../DoctorCard";
import appointmentService from "../../../services/appointment/appointmentService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  appointmentId: string;
  doctorId: string;
  onReschedule: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  onClose,
  appointmentId,
  doctorId,
  onReschedule,
}) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [availability, setAvailability] = useState<IDaySchedule[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [dayId, setDayId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [isSumitting, setSubmitting] = useState(false);

  const patient = useSelector((state: RootState) => state.user.patient);

  useEffect(() => {
    const getSchedule = async () => {
      setLoading(true);
      try {
        const schedule = await scheduleService.getSchedule(doctorId);
        if (schedule?.availability.length) {
          setAvailability(filterAvailability(schedule.availability));
        } else {
          setAvailability([]);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      getSchedule();
    }
  }, [open, doctorId]);

  useEffect(() => {
    const selectedDay = availability.find((day) =>
      dayjs(new Date(day.date)).isSame(selectedDate, "day")
    );
    setSlots(selectedDay ? selectedDay.slots : []);
    setDayId(selectedDay?._id ? selectedDay._id : null);
  }, [selectedDate, availability]);

  const handleSubmit = async () => {
    try {
      if (!dayId || !slotId || !date) {
        toast.error("Please select a valid date and time");
        return;
      }
      setSubmitting(true);
      await appointmentService.updateAppointment(appointmentId, {
        doctor: doctorId,
        dayId,
        slotId,
        date,
      });

      onClose();
      onReschedule();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reschedule appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="reschedule-modal-title"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 800 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography id="reschedule-modal-title" variant="h6" component="h2">
              Reschedule Appointment
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box mb={3} sx={{ height: "100%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Available Times for {selectedDate.format("MMM D, YYYY")}:
                </Typography>
                {loading ? (
                  <Box maxHeight={200} my={2}>
                    <Grid container spacing={1}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Grid item xs={3} key={index}>
                          <Skeleton
                            variant="text"
                            animation="pulse"
                            sx={{
                              width: 60,
                              height: 30,
                              borderRadius: 3,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box maxHeight={200} overflow="auto" my={2}>
                    <Grid container spacing={1}>
                      {slots.length > 0 ? (
                        slots
                          .filter((slot) => !slot.isBooked)
                          .map((slot) => (
                            <Grid item key={slot.startTime.toString()} xs={3}>
                              <TimeChip
                                label={formatTime(slot.startTime)}
                                size="small"
                                onClick={() => {
                                  setSlotId(slot._id ? slot._id : null);
                                  setDate(slot.startTime);
                                }}
                                sx={{
                                  cursor: "pointer",
                                  backgroundColor:
                                    slotId === slot._id ? "teal" : "",
                                  color: slotId === slot._id ? "white" : "",
                                  ":hover": {
                                    backgroundColor: "teal",
                                    color: "white",
                                  },
                                }}
                              />
                            </Grid>
                          ))
                      ) : (
                        <Grid item>
                          <Typography sx={{ my: 2, color: "GrayText" }}>
                            No slots available on this date.
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ height: "100%" }}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={today}
                  maxDate={today.add(20, "day")}
                />
              </Paper>
            </Grid>
          </Grid>
          {patient && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please note that rescheduling is not guaranteed and subject to
              availability. We will confirm your new appointment time via email.
            </Alert>
          )}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              loading={isSumitting}
              onClick={handleSubmit}
              variant="contained"
              disabled={slotId === null || isSumitting}
            >
              Reschedule
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default RescheduleModal;
