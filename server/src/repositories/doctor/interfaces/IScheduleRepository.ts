import { ObjectId } from "mongoose";
import { ISchedule } from "../../../interfaces/IDoctor";

interface IScheduleRepository {
  findSchedule(doctorId: string): Promise<ISchedule | null>;
  updateSchedule(
    doctorId: string,
    updateData: Partial<ISchedule>
  ): Promise<ISchedule>;
  updateBookingStatus(
    doctorId: ObjectId,
    dayId: string,
    slotId: string
  ): Promise<void>;
  toggleBookingStatus(
    doctorId: ObjectId,
    dayId: string,
    slotId: string
  ): Promise<void>;
}

export default IScheduleRepository;
