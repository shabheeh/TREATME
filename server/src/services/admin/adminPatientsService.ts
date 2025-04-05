import { IAdminPatientsService } from "src/interfaces/IAdmin";
import {
  IPatientsFilter,
  IPatientsFilterResult,
} from "src/interfaces/IPatient";
import IPatientRepository from "../../repositories/patient/interface/IPatientRepository";
import logger from "../../configs/logger";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class AdminPatientsService implements IAdminPatientsService {
  private patientRepository: IPatientRepository;

  constructor(
    @inject(TYPES.IPatientRepository) patientRepository: IPatientRepository
  ) {
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
      handleTryCatchError("Service", error);
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
      handleTryCatchError("Service", error);
    }
  }
}

export default AdminPatientsService;
