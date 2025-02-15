import { ObjectId } from "mongoose";
import { ISchedule } from "../../../interfaces/IDoctor";

interface IScheduleRepository {
    findSchedule(doctorId: string): Promise<ISchedule | null>;
    updateSchedule(doctorId: string, updateData: Partial<ISchedule>): Promise<ISchedule>;
    updateBookingStatus(doctorId: ObjectId, dayId: ObjectId, slotId: ObjectId): Promise<void>;
}

export default IScheduleRepository