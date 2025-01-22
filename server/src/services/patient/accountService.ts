import IPatientRepository from "src/repositories/interfaces/IPatientRepository";
import IPatient, { IPatientAccountService } from "../../interfaces/IPatient";
import { AppError } from "../../utils/errors";
import logger from "../../configs/logger";


class PatientAcccountService implements IPatientAccountService {

    private patientReposiory: IPatientRepository;

    constructor(patientRepository: IPatientRepository) {
        this.patientReposiory = patientRepository
    }


    async updateProfile(identifier: string, patientData: IPatient): Promise<IPatient | null> {
        try {


            
            const result = await this.patientReposiory.updatePatient(identifier, patientData)

            return result;

        } catch (error) {
            logger.error('error google signin', error)
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

export default PatientAcccountService;