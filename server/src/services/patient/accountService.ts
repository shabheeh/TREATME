import IPatientRepository from "src/repositories/patient/interface/IPatientRepository";
import IPatient, { IPatientAccountService } from "../../interfaces/IPatient";
import { AppError, handleTryCatchError } from "../../utils/errors";
import logger from "../../configs/logger";
import {
  updateCloudinaryFile,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import ILifestyleRepository from "src/repositories/healthProfile/interface/ILifestyleRepository";
import IHealthHistoryRepository from "src/repositories/healthProfile/interface/IHealthHistoryRepository";
import IBehaviouralHealthRepository from "src/repositories/healthProfile/interface/IBehaviouralHealthRepository";
import { IBehaviouralHealth } from "src/interfaces/IBehaviouralHealth";
import { IHealthHistory } from "src/interfaces/IHealthHistory";
import { ILifestyle } from "src/interfaces/ILifestyle";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class PatientAcccountService implements IPatientAccountService {
  private patientRepository: IPatientRepository;
  private healthHistoryRepo: IHealthHistoryRepository;
  private behaviouralHealthRepo: IBehaviouralHealthRepository;
  private lifestyleRepo: ILifestyleRepository;

  constructor(
    @inject(TYPES.IPatientRepository) patientRepository: IPatientRepository,
    @inject(TYPES.IHealthHistoryRepository)
    healthHistoryRepo: IHealthHistoryRepository,
    @inject(TYPES.IBehavouralHealthRepository)
    behaviouralHealthRepo: IBehaviouralHealthRepository,
    @inject(TYPES.ILifestyleRepository) lifestyleRepo: ILifestyleRepository
  ) {
    this.patientRepository = patientRepository;
    this.healthHistoryRepo = healthHistoryRepo;
    this.behaviouralHealthRepo = behaviouralHealthRepo;
    this.lifestyleRepo = lifestyleRepo;
  }

  async updateProfile(
    identifier: string,
    patientData: IPatient,
    imageFile: Express.Multer.File | undefined
  ): Promise<IPatient | null> {
    try {
      const patient =
        await this.patientRepository.findPatientByEmail(identifier);

      let imageUrl: string;
      let imageId: string;

      if (imageFile) {
        if (patient?.profilePicture && patient.imagePublicId) {
          const cloudinaryResponse = await updateCloudinaryFile(
            patient.imagePublicId,
            imageFile,
            "ProfilePictures/Patient"
          );
          imageUrl = cloudinaryResponse.url;
          imageId = cloudinaryResponse.publicId;
        } else {
          const cloudinaryResponse = await uploadToCloudinary(
            imageFile,
            "ProfilePictures/Patients"
          );
          imageUrl = cloudinaryResponse.url;
          imageId = cloudinaryResponse.publicId;
        }

        patientData.profilePicture = imageUrl;
        patientData.imagePublicId = imageId;
      }

      const result = await this.patientRepository.updatePatient(
        identifier,
        patientData
      );

      return result;
    } catch (error) {
      logger.error("error updating profile", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async getHealthProfile(id: string): Promise<{
    healtHistory: IHealthHistory | null;
    behaviouralHealth: IBehaviouralHealth | null;
    lifestyle: ILifestyle | null;
  }> {
    try {
      const [healtHistory, behaviouralHealth, lifestyle] = await Promise.all([
        this.healthHistoryRepo.findHealthHistory(id),
        this.behaviouralHealthRepo.findBehaviouralHealth(id),
        this.lifestyleRepo.findLifestyle(id),
      ]);

      return {
        healtHistory,
        behaviouralHealth,
        lifestyle,
      };
    } catch (error) {
      logger.error("error fetching health profile", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default PatientAcccountService;
