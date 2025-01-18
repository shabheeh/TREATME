import { AppError, ConflictError } from "../../utils/errors";
import logger from "../../configs/logger";
import { IApplicant, IApplicantService, IApplicantsFilter, IApplicantsFilterResult } from "../../interfaces/IApplicant";
import IApplicantRepository from "../../repositories/interfaces/IApplicantRepository";


class ApplicantService implements IApplicantService {
    
    private applicantRepository: IApplicantRepository

    constructor(applicantRepository: IApplicantRepository) {
        this.applicantRepository = applicantRepository
    }

    async createApplicant(applicant: IApplicant): Promise<void> {
        try {

            const existingApplicant = await this.applicantRepository.findApplicantByEmail(applicant.email)

            if (existingApplicant) {
                throw new ConflictError('Alreeady Registerd Candidate')
            }

            await this.applicantRepository.createApplicant(applicant)
        } catch (error) {
            logger.error('error creating applicant', error.message)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getApplicants(params: IApplicantsFilter): Promise<IApplicantsFilterResult> {
        try {
            const filter = {
                page: Math.max(1, params.page || 1),
                limit: Math.min(50, Math.max(1, params.limit || 5)),
                search: params.search?.trim() || ''
            }

            return this.applicantRepository.getApplicants(filter)

        } catch (error) {
            logger.error('error', error.message)
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

export default ApplicantService