import logger from "../../configs/logger";
import {Availability, IScheduleService } from "../../interfaces/IDoctor";
import IDoctorRepository from "../../repositories/doctor/interfaces/IDoctorRepository";
import { AppError } from "../../utils/errors";

class ScheduleService implements IScheduleService {
    
    private doctorRepo: IDoctorRepository;

    constructor(doctorRepo: IDoctorRepository) {
        this.doctorRepo = doctorRepo
    }

    async updateAvailability(doctorId: string, updateData: Availability): Promise<Availability> {
        try {
            const availabilily = await this.doctorRepo.updateDoctor(doctorId, updateData);
            return availabilily;

        } catch (error) {
            logger.error('Failed to update doctor availabilily');
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