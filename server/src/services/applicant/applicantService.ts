import { AppError, ConflictError } from "../../utils/errors";
import logger from "../../configs/logger";
import { IApplicant, IApplicantService, IApplicantsFilter, IApplicantsFilterResult } from "../../interfaces/IApplicant";
import IApplicantRepository from "../../repositories/doctor/interfaces/IApplicantRepository";
import { uploadToCloudinary } from "../../utils/uploadImage";


class ApplicantService implements IApplicantService {
    
    private applicantRepository: IApplicantRepository

    constructor(applicantRepository: IApplicantRepository) {
        this.applicantRepository = applicantRepository
    }

    async createApplicant(applicantData: IApplicant, idProofFile: Express.Multer.File, resumeFile: Express.Multer.File): Promise<void> {
        try {

            const existingApplicant = await this.applicantRepository.findApplicantByEmail(applicantData.email)

            if (existingApplicant) {
                throw new ConflictError('Alreeady Registerd Candidate')
            }

            const uplodIdProof = await uploadToCloudinary(idProofFile, 'Applicants');
            const uploadResume = await uploadToCloudinary(resumeFile, 'Applicants');
            
            applicantData.idProof = uplodIdProof.url;
            applicantData.resume = uploadResume.url;


            await this.applicantRepository.createApplicant(applicantData)

        } catch (error) {
            logger.error('error creating applicant', error)
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
            logger.error('error getting applicants', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getApplicant(id: string): Promise<IApplicant> {
        try {
            
            const applicant = await this.applicantRepository.findApplicantById(id)

            if(!applicant) {
                throw new AppError('Applicant not found')
            }

            return applicant

        } catch (error) {
            logger.error('error getting applicant', error)
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