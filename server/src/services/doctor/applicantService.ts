import logger from "../../configs/logger";
import { IApplicant, IApplicantService } from "../../interfaces/IDoctor";
import IApplicantRepository from "../../repositories/interfaces/IApplicantRepository";


class ApplicantService implements IApplicantService {
    
    private applicantRepository: IApplicantRepository

    constructor(applicantRepository: IApplicantRepository) {
        this.applicantRepository = applicantRepository
    }

    async createApplicant(applicant: IApplicant): Promise<void> {
        try {
            await this.applicantRepository.createApplicant(applicant)
        } catch (error) {
            logger.error('error creating applicant', error.message)
            throw new Error(`error creating applicant ${error.message}`)
        }
    }
}

export default ApplicantService