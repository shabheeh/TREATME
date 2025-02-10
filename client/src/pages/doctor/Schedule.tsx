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

import { ISchedule, IDaySchedule, ISlot } from '../../types/doctor/doctor.types';
import scheduleService from '../../services/doctor/scheduleService';

dayjs.extend(isBetween);

const SPECIALIZATION_DURATION: { [key: string]: number } = {
  'Dermatology': 20,
  'Urgent Care': 15,
  'Therapy': 45,
  'Psychiatry': 30,
  'Default': 30
};

export default function ScheduleManagement() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [schedules, setSchedules] = useState<IDaySchedule[]>([]); 
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<{ startTime: Dayjs | null, endTime: Dayjs | null }>({
    startTime: null,
    endTime: null
  });
  const doctor = useSelector((state: RootState) => state.user.doctor);

  useEffect(() => {
    if (!doctor) return;
    const fetchSchedule = async () => {
      try {
        const scheduleResponse: ISchedule | null = await scheduleService.getSchedule(doctor._id);
        if (scheduleResponse && scheduleResponse.availability) {
          const scheduleWithDayjsDates = scheduleResponse.availability.map((avail: IDaySchedule) => ({
            date: new Date(avail.date), // Convert to Date
            slots: avail.slots.map((slot: ISlot) => ({
              ...slot,
              startTime: new Date(slot.startTime), // Convert to Date
              endTime: new Date(slot.endTime) // Convert to Date
            }))
          }));
          setSchedules(scheduleWithDayjsDates);
        } else {
          setSchedules([]); 
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch schedule');
      }
    };
    fetchSchedule();
  }, [doctor]);

  const formatDate = (date: Date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  const formatTime = (date: Date | null | undefined) => {
    if (!date) {
      return 'Invalid Time';
    }
    return dayjs(date).format('hh:mm A');
  };

  const addTimeSlot = async () => {
    if (!newTimeSlot.startTime) return;
    
    const startTime = newTimeSlot.startTime.toDate(); // Convert to Date
    const specialization = doctor?.specialization?.name || 'default';
    const slotDuration = SPECIALIZATION_DURATION[specialization] || SPECIALIZATION_DURATION['default'];
    const endTime = newTimeSlot.startTime.add(slotDuration, 'minute').toDate(); // Convert to Date
    
    if (dayjs(selectedDate).isSame(today, 'day')) {
      const currentTime = dayjs(); 
      if (newTimeSlot.startTime.isBefore(currentTime)) {
        toast.warning('Cannot set a slot time that passed today');
        return;
      }
    }
    
    const existingAvailability = schedules.find(avail => dayjs(avail.date).isSame(selectedDate, 'day'));
    const existingSlots = existingAvailability ? existingAvailability.slots : [];
    
    const isDuplicateStartTime = existingSlots.some(slot => 
      dayjs(slot.startTime).isSame(startTime)
    );
    
    if (isDuplicateStartTime) {
      toast.warning('A time slot with this start time already exists');
      return;
    }
    
    const isOverlapping = existingSlots.some(slot => 
      (dayjs(startTime).isBetween(slot.startTime, slot.endTime) ||
       dayjs(endTime).isBetween(slot.startTime, slot.endTime) ||
       (dayjs(slot.startTime).isBetween(startTime, endTime))
      )
    );
    
    if (isOverlapping) {
      toast.warning('Time slot overlaps with an existing slot');
      return;
    }
    
    const newSlot: ISlot = {
      startTime,
      endTime,
      isBooked: false
    };
    
    const updatedSchedules = schedules.map(avail => 
      dayjs(avail.date).isSame(selectedDate, 'day') 
        ? { ...avail, slots: [...avail.slots, newSlot].sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime))) }
        : avail
    );
    
    if (!existingAvailability) {
      updatedSchedules.push({ date: selectedDate.toDate(), slots: [newSlot] });
    }
    
    try {
      if (!doctor) return;
      const result = await scheduleService.updateSchedule(doctor._id, { availability: updatedSchedules });
      const formatedResult = result.availability.map((avail: IDaySchedule) => ({
        date: new Date(avail.date), // Convert to Date
        slots: avail.slots.map((slot: ISlot) => ({
          ...slot,
          startTime: new Date(slot.startTime), // Convert to Date
          endTime: new Date(slot.endTime) // Convert to Date
        }))
      }));
      setSchedules(formatedResult);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setNewTimeSlot({ startTime: null, endTime: null });
      setIsAddSlotDialogOpen(false);
    }
  };

  const removeTimeSlot = async (date: Dayjs, slotId: string) => {
    try {
      const existingAvailability = schedules.find(avail => dayjs(avail.date).isSame(date, 'day'));
      if (!existingAvailability) {
        toast.error('No availability found for the selected date');
        return;
      }
      const updatedSlots = existingAvailability.slots.filter(slot => slot._id !== slotId);
      const updatedAvailability: IDaySchedule = {
        date: existingAvailability.date,
        slots: updatedSlots
      };
      const updatedSchedules = schedules.map(avail =>
        dayjs(avail.date).isSame(date, 'day') ? updatedAvailability : avail
      );
      if (!doctor) {
        toast.error('Doctor information is not available');
        return;
      }
      await scheduleService.updateSchedule(doctor._id, {
        availability: updatedSchedules
      });
      setSchedules(updatedSchedules);
      toast.success('Time slot removed successfully');
    } catch (error) {
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
      const daySchedule = schedules.find(avail => dayjs(avail.date).isSame(date, 'day'));
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
          <DialogTitle color='primary' sx={{ my: 1}}>
            Add Time Slot for {formatDate(selectedDate.toDate())}
            {doctor?.specialization?.name && (
              <Typography variant="body2" color="text.secondary">
                {doctor.specialization.name} - Default Slot Duration: {SPECIALIZATION_DURATION[doctor.specialization.name] || 30} mins
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <TimePicker
                sx={{ width: '100%'}}
                label="Start Time"
                value={newTimeSlot.startTime}
                onChange={(newValue) => setNewTimeSlot(prev => ({ 
                  ...prev, 
                  startTime: newValue as Dayjs,
                  endTime: newValue ? newValue.add(
                    SPECIALIZATION_DURATION[doctor?.specialization?.name || 'default'] || 30, 
                    'minute'
                  ) : null
                }))}
                views={['hours', 'minutes']}
                ampm
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddSlotDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={addTimeSlot} 
              disabled={!newTimeSlot.startTime}
            >
              Add Slot
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
}