import { ISchedule } from "../../../interfaces/IDoctor";

interface IScheduleRepository {
    findSchedule(doctorId: string): Promise<ISchedule | null>;
    updateSchedule(doctorId: string, updateData: Partial<ISchedule>): Promise<ISchedule>
}

export default IScheduleRepository