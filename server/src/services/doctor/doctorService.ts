import logger from "../../configs/logger";
import IDoctor, {
  IDoctorService,
  IDoctorsFilter,
  IDoctorsFilterResult,
} from "../../interfaces/IDoctor";
import IDoctorRepository, {
  getDoctorsWithSchedulesQuery,
  getDoctorsWithSchedulesResult,
} from "src/repositories/doctor/interfaces/IDoctorRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class DoctorService implements IDoctorService {
  private doctorRepo: IDoctorRepository;

  constructor(@inject(TYPES.IDoctorRepository) doctorRepo: IDoctorRepository) {
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
      logger.error("error checking doctor status", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult> {
    return await this.doctorRepo.getDoctors(filter);
  }
}

export default DoctorService;
