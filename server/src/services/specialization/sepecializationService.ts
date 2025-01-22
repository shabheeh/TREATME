import ISpecialization, { ISpecializationService } from "../../interfaces/ISpecilazation";
import ISpecializationRepository from "../../repositories/interfaces/ISpecializationRepository";
import logger from "../../configs/logger";
import { AppError } from "../../utils/errors";

class SpecializationService implements ISpecializationService {

    private specializationRepository: ISpecializationRepository;

    constructor(specializationRepository: ISpecializationRepository) {
        this.specializationRepository = specializationRepository
    }

    async createSpecialization(specialization: ISpecialization): Promise<void> {
        try {
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