import { ISchedule } from "../../../interfaces/ISchedule";

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
  toggleBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void>;
}

export default IScheduleRepository;
