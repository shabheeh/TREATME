import { ISchedule } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

class ScheduleService {


    async getSchedule(id: string): Promise<ISchedule> {
        try {
            const response = await api.doctor.get(`/schedules/${id}`)
            const { schedule } = response.data;
            return schedule
        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error fetching schedule: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async updateSchedule(id: string, updateData: Partial<ISchedule>): Promise<ISchedule> {
        try {
            const response = await api.doctor.patch(`/schedules/${id}`, { updateData })
            const { schedule } = response.data;
            return schedule;

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error updating schedule: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const scheduleService = new ScheduleService();
export default scheduleService;