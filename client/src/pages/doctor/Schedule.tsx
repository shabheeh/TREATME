import { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/app/store';
import isBetween from 'dayjs/plugin/isBetween';
import doctorAuthService from '../../services/doctor/authService';
import { Slot, Availability } from '../../types/doctor/doctor.types';

export default function ScheduleManagement() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [schedules, setSchedules] = useState<Availability[]>([]);
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<{ startTime: Dayjs | null, endTime: Dayjs | null }>({
    startTime: null,
    endTime: null
  });

  const doctor = useSelector((state: RootState) => state.user.doctor);

  useEffect(() => {
    if (doctor) {
      const availability = doctor.availability?.map(avail => ({
        ...avail,
        date: dayjs(avail.date)
      })) || [];
      setSchedules(availability);
    }
  }, [doctor]);

  const formatDate = (date: Dayjs) => {
    return date.format('MMM D, YYYY');
  };
  dayjs.extend(isBetween);
  const formatTime = (date: Dayjs | null | undefined) => {
    if (!date || !(date instanceof dayjs)) {
      return 'Invalid Time';
    }
    return date.format('hh:mm A');
  };

  const addTimeSlot = async () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) return;
    
    if (newTimeSlot.endTime.isBefore(newTimeSlot.startTime)) {
      toast.warning('End time must be after start time');
      return;
    }

    const newSlot: Slot = {
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime,
      isBooked: false
    };
    
    const existingAvailability = schedules.find(avail => avail.date.isSame(selectedDate, 'day'));
    const existingSlots = existingAvailability ? existingAvailability.slots : [];
    
    const isOverlapping = existingSlots.some(slot => 
      (newSlot.startTime.isBetween(slot.startTime, slot.endTime) ||
       newSlot.endTime.isBetween(slot.startTime, slot.endTime) ||
       (dayjs(slot.startTime).isBetween(newSlot.startTime, newSlot.endTime)))
    );

    if (isOverlapping) {
      toast.warning('Time slot overlaps with an existing slot');
      return;
    }

    const updatedSchedules = schedules.map(avail => 
      avail.date.isSame(selectedDate, 'day') 
        ? { ...avail, slots: [...avail.slots, newSlot].sort((a, b) => a.startTime.diff(b.startTime)) }
        : avail
    );

    if (!existingAvailability) {
      updatedSchedules.push({ date: selectedDate, slots: [newSlot] });
    }

    try {
      if (!doctor) return;
      const result = await doctorAuthService.updateAvailability(doctor._id, { availability: updatedSchedules });
      setSchedules(result.availability.map(avail => ({
        ...avail,
        date: dayjs(avail.date)
      })));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setNewTimeSlot({ startTime: null, endTime: null });
      setIsAddSlotDialogOpen(false);
    }
  };

  const removeTimeSlot = async (date: Dayjs, slotId: string) => {
    try {
      // Step 1: Find the availability for the given date
      const existingAvailability = schedules.find(avail => avail.date.isSame(date, 'day'));
      if (!existingAvailability) {
        toast.error('No availability found for the selected date');
        return;
      }
  
      // Step 2: Remove the slot with the given ID
      const updatedSlots = existingAvailability.slots.filter(slot => slot._id !== slotId);
  
      // Step 3: Prepare the updated availability data for the specific date
      const updatedAvailability = {
        ...existingAvailability,
        slots: updatedSlots
      };
  
      // Step 4: Prepare the updated availability array
      const updatedSchedules = schedules.map(avail =>
        avail.date.isSame(date, 'day') ? updatedAvailability : avail
      );
  
      // Step 5: Update the database with the updated availability
      if (!doctor) {
        toast.error('Doctor information is not available');
        return;
      }
  
      await doctorAuthService.updateAvailability(doctor._id, {
        availability: updatedSchedules
      });
      console.log(schedules, 'before')
  
      // Step 6: Update the local state
      setSchedules(updatedSchedules);
  
      console.log(schedules, 'after')
      toast.success('Time slot removed successfully');
    } catch (error) {
      // Handle errors gracefully
      toast.error(error instanceof Error ? error.message : 'Failed to remove time slot');
    }
  };


  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = today.add(i, 'day');
      dates.push(date);
    }
    return dates;
  };

  const renderWeeklySchedule = () => {
    return generateWeekDates().map((date) => {
      const daySchedule = schedules.find(avail => avail.date.isSame(date, 'day'));
      const isToday = date.isSame(today, 'day');
      return (
        <Grid item xs={12} key={date.format('YYYY-MM-DD')} sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
              {date.format('ddd, MMM D')}
              {isToday && <span style={{ marginLeft: '8px', color: 'teal' }}>Today</span>}
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
          {daySchedule?.slots.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {daySchedule.slots.map((slot) => (
                <Box 
                  key={slot._id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2">
                    {`${formatTime(dayjs(slot?.startTime))} to ${formatTime(dayjs(slot?.endTime))}`}
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h5" color='primary' sx={{ fontWeight: 600 }}>
            Schedule Management
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {renderWeeklySchedule()}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue as Dayjs)}
                minDate={today}
                maxDate={today.add(7, 'day')}
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
          <DialogTitle color='primary' sx={{ my: 1}}>Add Time Slot for {formatDate(selectedDate)}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 1 }}>
              <TimePicker
                label="Start Time"
                value={newTimeSlot.startTime}
                onChange={(newValue) => setNewTimeSlot(prev => ({ ...prev, startTime: newValue as Dayjs }))}
                views={['hours', 'minutes']}
                ampm
              />
              <TimePicker
                label="End Time"
                value={newTimeSlot.endTime}
                onChange={(newValue) => setNewTimeSlot(prev => ({ ...prev, endTime: newValue as Dayjs }))}
                views={['hours', 'minutes']}
                ampm
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddSlotDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={addTimeSlot} 
              disabled={!newTimeSlot.startTime || !newTimeSlot.endTime}
            >
              Add Slot
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
}