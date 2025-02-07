import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import { ISchedule, IScheduleService } from "../../interfaces/IDoctor";
import { AppError } from "../../utils/errors";

class ScheduleService implements IScheduleService {
    
    private scheduleRepo: IScheduleRepository;

    constructor(scheduleRepo: IScheduleRepository) {
        this.scheduleRepo = scheduleRepo
    }

    async getSchedule(doctorId: string): Promise<ISchedule | null> {
        try {
            const schedule = await this.scheduleRepo.findSchedule(doctorId)
            return schedule;
        } catch (error) {
            logger.error('Failed to update doctor Shedule');
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }

    async updateSchedule(doctorId: string, updateData: Partial<ISchedule>): Promise<ISchedule> {
        try {

            const arrangeUpdateData = updateData.availability?.filter(slot => slot.slots.length > 0);

            const updatedData: Partial<ISchedule> = {
                ...updateData,
                availability: arrangeUpdateData
              };
            
            const updatedSchedule = await this.scheduleRepo.updateSchedule(doctorId, updatedData);

            return updatedSchedule


        } catch (error) {
            logger.error('Failed to update doctor Shedule');
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }
}

export default ScheduleService