import logger from '../../configs/logger';
import IDoctor, { IDoctorService } from '../../interfaces/IDoctor';
import IDoctorRepository, {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
} from 'src/repositories/doctor/interfaces/IDoctorRepository';
import { AppError } from '../../utils/errors';

class DoctorService implements IDoctorService {
  private doctorRepo: IDoctorRepository;

  constructor(doctorRepo: IDoctorRepository) {
    this.doctorRepo = doctorRepo;
  }

  async getDoctor(id: string): Promise<IDoctor> {
    const doctor = await this.doctorRepo.findDoctorById(id);
    return doctor;
  }

  async getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult> {
    try {
      const result = await this.doctorRepo.getDoctorsWithSchedules(query);
      return result;
    } catch (error) {
      logger.error('error checking doctor status', error);
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
