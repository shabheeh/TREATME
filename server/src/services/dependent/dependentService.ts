import IDependent, { IDependentService } from '../../interfaces/IDependent';
import IDependentRepository from '../../repositories/patient/interface/IDependentRepository';
import logger from '../../configs/logger';
import {
  uploadToCloudinary,
  updateCloudinaryImage,
} from '../../utils/uploadImage';
import { AppError } from '../../utils/errors';

class DependentService implements IDependentService {
  private dependentRepository: IDependentRepository;

  constructor(dependentRepository: IDependentRepository) {
    this.dependentRepository = dependentRepository;
  }

  async createDependent(
    dependent: IDependent,
    imageFile: Express.Multer.File | undefined
  ): Promise<IDependent> {
    try {
      if (imageFile) {
        const cloudinaryResponse = await uploadToCloudinary(
          imageFile,
          'ProfilePictures/Patients'
        );
        dependent.profilePicture = cloudinaryResponse.url;
        dependent.imagePublicId = cloudinaryResponse.publicId;
      }

      const newDependent =
        await this.dependentRepository.createDependent(dependent);
      return newDependent;
    } catch (error) {
      logger.error('Error creating dependent', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  async getDependents(primaryUserId: string): Promise<IDependent[] | []> {
    try {
      const dependents =
        await this.dependentRepository.getDependents(primaryUserId);
      return dependents;
    } catch (error) {
      logger.error('Error fetching dependents', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  async deleteDependent(id: string): Promise<void> {
    try {
      await this.dependentRepository.deleteDependent(id);
    } catch (error) {
      logger.error('Error deleting dependent', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  async updateDependent(
    id: string,
    updateData: Partial<IDependent>,
    imageFile: Express.Multer.File | undefined
  ): Promise<IDependent> {
    try {
      const dependent = await this.dependentRepository.findDependentById(id);

      if (imageFile) {
        if (dependent?.profilePicture && dependent.imagePublicId) {
          const cloudinaryResponse = await updateCloudinaryImage(
            dependent.imagePublicId,
            imageFile,
            'ProfilePictures/Patient'
          );
          updateData.profilePicture = cloudinaryResponse.url;
          updateData.imagePublicId = cloudinaryResponse.publicId;
        } else {
          const cloudinaryResponse = await uploadToCloudinary(
            imageFile,
            'ProfilePictures/Patients'
          );
          updateData.profilePicture = cloudinaryResponse.url;
          updateData.profilePicture = cloudinaryResponse.publicId;
        }
      }

      const result = await this.dependentRepository.updateDependent(
        id,
        updateData
      );

      return result;
    } catch (error) {
      logger.error('error updating dependent profile', error);
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

export default DependentService;
