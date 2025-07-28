import { ISchedule, ISlot } from "../../../interfaces/ISchedule";

interface IScheduleRepository {
  findSchedule(doctorId: string): Promise<ISchedule | null>;
  updateSchedule(
    doctorId: string,
    updateData: Partial<ISchedule>
  ): Promise<ISchedule>;
  updateBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void>;
  addTimeSlot(
    doctorId: string,
    date: string,
    startTime: string,
    durationInMinutes: number,
    timezone?: string
  ): Promise<ISchedule>;
  removeTimeSlot(
    doctorId: string,
    date: string,
    slotId: string
  ): Promise<ISchedule>;
  toggleBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void>;
  getAvailableSlots(doctorId: string, date: string): Promise<ISlot[]>;
  bulkUpdateSlots(
    doctorId: string,
    updates: Array<{
      date: string;
      slots: Array<{
        startTime: string;
        endTime: string;
        isBooked: boolean;
      }>;
    }>
  ): Promise<ISchedule>;
}

export default IScheduleRepository;
