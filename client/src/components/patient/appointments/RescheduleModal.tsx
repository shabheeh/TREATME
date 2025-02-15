import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import scheduleService from '../../../services/doctor/scheduleService';
import { IDaySchedule, ISlot } from '../../../types/doctor/doctor.types';
import { toast } from 'sonner';
import { filterAvailability } from '../../../helpers/filterAvailability';
import { formatTime } from '../../../utils/dateUtils';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  doctorId: string;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ open, onClose, doctorId }) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [availability, setAvailability] = useState<IDaySchedule[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the doctor's schedule when the modal opens
  useEffect(() => {
    const getSchedule = async () => {
      setLoading(true);
      try {
        const schedule = await scheduleService.getSchedule(doctorId);
        setAvailability(filterAvailability(schedule.availability));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      getSchedule();
    }
  }, [open, doctorId]);

  // Update the slots when the selected date or availability changes
  useEffect(() => {
    const selectedDay = availability.find((day) =>
      dayjs(new Date(day.date)).isSame(selectedDate, 'day')
    );
    setSlots(selectedDay ? selectedDay.slots : []);
  }, [selectedDate, availability]);

  const handleSubmit = async () => {
    try {
      if (!selectedDate || slots.length === 0) {
        toast.error('Please select a valid date and time');
        return;
      }

      const firstAvailableSlot = slots.find((slot) => !slot.isBooked);
      if (!firstAvailableSlot) {
        toast.error('No available slots for the selected date');
        return;
      }

      // Submit the reschedule request
      await scheduleService.rescheduleAppointment(doctorId, {
        newDate: selectedDate.toDate(),
        newTime: firstAvailableSlot.startTime,
      });

      toast.success('Reschedule request submitted successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reschedule appointment');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="reschedule-modal-title">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 800 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="reschedule-modal-title" variant="h6" component="h2">
              Reschedule Appointment
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box mb={3} sx={{ height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Available Times for {selectedDate.format('MMM D, YYYY')}:
                  </Typography>
                  <Box maxHeight={200} overflow="auto">
                    <Grid container spacing={1}>
                      {slots &&
                        slots
                          .filter((slot) => !slot.isBooked)
                          .map((slot) => (
                            <Grid item key={slot.startTime.toString()} xs={3}>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  ':hover': { backgroundColor: 'teal', color: 'white' },
                                }}
                              >
                                {formatTime(slot.startTime)}
                              </Button>
                            </Grid>
                          ))}
                    </Grid>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ height: '100%' }}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    minDate={today}
                    maxDate={today.add(20, 'day')}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
          <Alert severity="info" sx={{ mb: 3 }}>
            Please note that rescheduling is not guaranteed and subject to availability. We will confirm your new
            appointment time via email.
          </Alert>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={slots.length === 0}
            >
              Request Reschedule
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default RescheduleModal;