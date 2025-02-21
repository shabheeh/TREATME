import { IAdminPatientsService } from "src/interfaces/IAdmin";
import {
  IPatientsFilter,
  IPatientsFilterResult,
} from "src/interfaces/IPatient";
import IPatientRepository from "../../repositories/patient/interface/IPatientRepository";
import logger from "../../configs/logger";
import { AppError } from "../../utils/errors";

class AdminPatientsService implements IAdminPatientsService {
  private patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  async getPatients(params: IPatientsFilter): Promise<IPatientsFilterResult> {
    try {
      const filter = {
        page: Math.max(1, params.page || 1),
        limit: Math.min(50, Math.max(1, params.limit || 5)),
        search: params.search?.trim() || "",
      };

      return await this.patientRepository.getPatients(filter);
    } catch (error) {
      logger.error("error fetching patients data", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async togglePatientActivityStatus(
    id: string,
    isActive: boolean
  ): Promise<void> {
    try {
      await this.patientRepository.updatePatient(id, { isActive: !isActive });
    } catch (error) {
      logger.error("error re-sending otp", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default AdminPatientsService;
