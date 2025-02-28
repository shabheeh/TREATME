import { AppError, ConflictError } from "../../utils/errors";
import logger from "../../configs/logger";
import {
  IApplicant,
  IApplicantService,
  IApplicantsFilter,
  IApplicantsFilterResult,
} from "../../interfaces/IApplicant";
import IApplicantRepository from "../../repositories/doctor/interfaces/IApplicantRepository";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { sendEmail } from "../../utils/mailer";
import ISpecialization from "src/interfaces/ISpecilazation";

class ApplicantService implements IApplicantService {
  private applicantRepository: IApplicantRepository;

  constructor(applicantRepository: IApplicantRepository) {
    this.applicantRepository = applicantRepository;
  }

  async createApplicant(
    applicantData: IApplicant,
    idProofFile: Express.Multer.File,
    resumeFile: Express.Multer.File
  ): Promise<void> {
    try {
      const existingApplicant =
        await this.applicantRepository.findApplicantByEmail(
          applicantData.email
        );

      if (existingApplicant) {
        throw new ConflictError("Alreeady Registerd Candidate");
      }

      const uplodIdProof = await uploadToCloudinary(idProofFile, "Applicants");
      const uploadResume = await uploadToCloudinary(resumeFile, "Applicants");

      applicantData.idProof = uplodIdProof.url;
      applicantData.resume = uploadResume.url;

      await this.applicantRepository.createApplicant(applicantData);
    } catch (error) {
      logger.error("error creating applicant", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getApplicants(
    params: IApplicantsFilter
  ): Promise<IApplicantsFilterResult> {
    try {
      const filter = {
        page: Math.max(1, params.page || 1),
        limit: Math.min(50, Math.max(1, params.limit || 5)),
        search: params.search?.trim() || "",
      };

      return this.applicantRepository.getApplicants(filter);
    } catch (error) {
      logger.error("error getting applicants", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getApplicant(id: string): Promise<IApplicant> {
    try {
      const applicant = await this.applicantRepository.findApplicantById(id);

      if (!applicant) {
        throw new AppError("Applicant not found");
      }

      return applicant;
    } catch (error) {
      logger.error("error getting applicant", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async deleteApplicant(id: string): Promise<void> {
    try {
      const applicant = await this.getApplicant(id);

      const mailContent = `
                <p>Dear ${applicant.firstName},</p>
                

                <p>Thank you for taking the time to apply for the ${(applicant.specialization as ISpecialization).name} position at Treatme.</p>

                <p>After careful consideration, we regret to inform you that we do not find you fit for the position at this time.</p>

                <p>We appreciate your interest in our organization and wish you all the best in your future endeavors.</p>

                <p>Warm regards,<br/> 
                <strong>Treatme</strong></p>
            `;

      await sendEmail(
        applicant.email,
        "Update on Your Application Status",
        undefined,
        mailContent
      );

      await this.applicantRepository.deleteApplicant(id);
    } catch (error) {
      logger.error("error deleting applicant", error);
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

export default ApplicantService;
