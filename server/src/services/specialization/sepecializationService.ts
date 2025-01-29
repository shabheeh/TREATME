import ISpecialization, { ISpecializationService } from "../../interfaces/ISpecilazation";
import ISpecializationRepository from "../../repositories/specialization/interfaces/ISpecializationRepository";
import logger from "../../configs/logger";
import { AppError, ConflictError } from "../../utils/errors";
import { uploadToCloudinary, updateCloudinaryImage } from "../../utils/uploadImage";
class SpecializationService implements ISpecializationService {

    private specializationRepository: ISpecializationRepository;

    constructor(specializationRepository: ISpecializationRepository) {
        this.specializationRepository = specializationRepository
    }
 
    async createSpecialization(specialization: ISpecialization, imageFile: Express.Multer.File): Promise<void> {
        try {

            const existingSpecialization = await this.specializationRepository.getSpecializationByName(specialization.name)

            if (existingSpecialization) {
                throw new ConflictError('Specailization with this name is exists')
            }

            const cloudinaryResponse = await uploadToCloudinary(imageFile, 'Specializations');
            const imageUrl = cloudinaryResponse.url;
            const imagePublicId = cloudinaryResponse.publicId

            specialization.image = imageUrl;
            specialization.imagePublicId = imagePublicId

            await this.specializationRepository.createSpecialization(specialization);

        } catch (error) {
            logger.error('Error creating specialization', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }

    async getSpecializations(): Promise<ISpecialization[]> {
        try {

            return await this.specializationRepository.getSpecializations();

        } catch (error) {
            logger.error('Error creating specialization', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }

    async getSpecializationById(id: string): Promise<ISpecialization | null> {
        try {
            const specialization = await this.specializationRepository.getSpecializationById(id);

            return specialization

        } catch (error) {
            logger.error('Error creating specialization', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }

    async updateSpecialization(id: string, updateData: Partial<ISpecialization>, imageFile: Express.Multer.File | undefined): Promise<ISpecialization | null> {
        try {

            if(updateData.name) {
                const existingSpecialization = await this.specializationRepository.getSpecializationByName(updateData.name)

                if (existingSpecialization) {
  
                    const existingId = (existingSpecialization as ISpecialization)._id;
                    
                    if (existingId && existingId.toString() !== id.toString()) {
                        throw new AppError('A specialization with this name already exists.');
                    }
                }
            }

            const specialization = await this.specializationRepository.getSpecializationById(id)

            if(imageFile && specialization?.imagePublicId) {
                const newImage = await updateCloudinaryImage(specialization.imagePublicId, imageFile, `specializations`)
                updateData.image = newImage.url
                updateData.imagePublicId = newImage.publicId
            }

            const result = await this.specializationRepository.updateSpecialization(id, updateData);

            return result;

        } catch (error) {
            logger.error('Error upadate specialization', error)
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

export default SpecializationService