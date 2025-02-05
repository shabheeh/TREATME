import logger from "src/configs/logger";
import IDoctor, { IDoctorService } from "src/interfaces/IDoctor";
import IDoctorRepository from "src/repositories/doctor/interfaces/IDoctorRepository";
import { AppError } from "src/utils/errors";

class DoctorService implements IDoctorService {
    
    private doctorRepo: IDoctorRepository;

    constructor(doctorRepo: IDoctorRepository) {
        this.doctorRepo = doctorRepo
    }

    async updateAvailability(id: string, updateData: Partial<IDoctor>): Promise<IDoctor> {
        try {
            const doctor = await this.doctorRepo.updateDoctor(id, updateData);
            return doctor
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

export default DoctorService;