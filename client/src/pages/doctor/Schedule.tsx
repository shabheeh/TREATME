import React, { useState } from 'react';
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
import dayjs from 'dayjs';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}

interface DailySchedule {
  date: dayjs.Dayjs;
  timeSlots: TimeSlot[];
}

export default function ScheduleManagement() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(today);
  const [schedules, setSchedules] = useState<{ [key: string]: DailySchedule }>({});
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<{ startTime: dayjs.Dayjs | null, endTime: dayjs.Dayjs | null }>({
    startTime: null,
    endTime: null
  });

  const formatDate = (date: dayjs.Dayjs) => {
    return date.format('MMM D, YYYY');
  };

  const formatTime = (date: dayjs.Dayjs) => {
    return date.format('hh:mm A');
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) return;
    
    if (newTimeSlot.endTime.isBefore(newTimeSlot.startTime)) {
      toast.warning('End time must be after start time');
      return;
    }

    const dateKey = selectedDate.format('YYYY-MM-DD');
    const newSlot: TimeSlot = {
      id: `${dateKey}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime
    };
    
    const existingSlots = schedules[dateKey]?.timeSlots || [];
    const isOverlapping = existingSlots.some(slot => 
      (newSlot.startTime.isBetween(slot.startTime, slot.endTime) ||
       newSlot.endTime.isBetween(slot.startTime, slot.endTime) ||
       (slot.startTime.isBetween(newSlot.startTime, newSlot.endTime)))
    );

    if (isOverlapping) {
      toast.warning('Time slot overlaps with an existing slot');
      return;
    }

    setSchedules(prev => ({
      ...prev,
      [dateKey]: {
        date: selectedDate,
        timeSlots: [...(prev[dateKey]?.timeSlots || []), newSlot]
          .sort((a, b) => a.startTime.diff(b.startTime))
      }
    }));
    

    setNewTimeSlot({ startTime: null, endTime: null });
    setIsAddSlotDialogOpen(false);
  };

  const removeTimeSlot = (dateKey: string, slotId: string) => {
    setSchedules(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        timeSlots: prev[dateKey].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
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
      const dateKey = date.format('YYYY-MM-DD');
      const daySchedule = schedules[dateKey];
      const isToday = date.isSame(today, 'day');

      return (
        <Grid item xs={12} key={dateKey} sx={{ mb: 2 }}>
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
          {daySchedule?.timeSlots.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {daySchedule.timeSlots.map((slot) => (
                <Box 
                  key={slot.id} 
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
                    onClick={() => removeTimeSlot(dateKey, slot.id)}
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
                onChange={(newValue) => setSelectedDate(newValue as dayjs.Dayjs)}
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
                onChange={(newValue) => setNewTimeSlot(prev => ({ ...prev, startTime: newValue as dayjs.Dayjs }))}
                views={['hours', 'minutes']}
                ampm
              />
              <TimePicker
                label="End Time"
                value={newTimeSlot.endTime}
                onChange={(newValue) => setNewTimeSlot(prev => ({ ...prev, endTime: newValue as dayjs.Dayjs }))}
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