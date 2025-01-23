import ISpecialization, { ISpecializationService } from "../../interfaces/ISpecilazation";
import ISpecializationRepository from "../../repositories/interfaces/ISpecializationRepository";
import logger from "../../configs/logger";
import { AppError, ConflictError } from "../../utils/errors";

class SpecializationService implements ISpecializationService {

    private specializationRepository: ISpecializationRepository;

    constructor(specializationRepository: ISpecializationRepository) {
        this.specializationRepository = specializationRepository
    }
 
    async createSpecialization(specialization: ISpecialization): Promise<void> {
        try {

            const existingSpecialization = await this.specializationRepository.getSpecializationByName(specialization.name)

            if (existingSpecialization) {
                throw new ConflictError('Specailization with this name is exists')
            }

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

    async updateSpecialization(id: string, updateData: Partial<ISpecialization>): Promise<ISpecialization | null> {
        try {

            if(updateData.name) {
                const existingSpecialization = await this.specializationRepository.getSpecializationByName(updateData.name)

                if (existingSpecialization) {
  
                    const existingId = (existingSpecialization as ISpecialization)._id;
                    
                    if (existingId && existingId.toString() !== id.toString()) {
                        throw new ConflictError('A specialization with this name already exists.');
                    }
                }
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