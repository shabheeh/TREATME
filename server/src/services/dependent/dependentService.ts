import IDependent, { IDependentService } from "../../interfaces/IDependent";
import IDependentRepository from "../../repositories/interfaces/IDependentRepository";
import logger from "../../configs/logger";
import { uploadToCloudinary } from "../../utils/uploadImage";
import { AppError } from "../../utils/errors";

class DependentService implements IDependentService {

    private dependentRepository: IDependentRepository;

    constructor(dependentRepository: IDependentRepository) {
        this.dependentRepository = dependentRepository
    }

    async createDependent(dependent: IDependent, imageFile: Express.Multer.File | undefined): Promise<IDependent> {
        try {

            if(imageFile) {
                const cloudinaryResponse = await uploadToCloudinary(imageFile, 'ProfilePictures/Patients');
                dependent.profilePicture = cloudinaryResponse.url;
                dependent.imagePublicId = cloudinaryResponse.publicId
            }

            const newDependent = await this.dependentRepository.createDependent(dependent);
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
            const dependents = await this.dependentRepository.getDependents(primaryUserId)
            return dependents
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
}

export default DependentService; 