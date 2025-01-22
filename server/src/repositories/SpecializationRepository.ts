import { Model } from "mongoose";
import ISpecialization from "../interfaces/ISpecilazation";
import ISpecializationRepository from "./interfaces/ISpecializationRepository";
import { AppError } from "../utils/errors";

class SpecializationRepository implements ISpecializationRepository {

    private readonly model: Model<ISpecialization>

    constructor(model: Model<ISpecialization>) {
        this.model = model
    }


    async createSpecialization(specialization: Partial<ISpecialization>): Promise<void> {
        try {

            await this.model.create(specialization);

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getSpecializations(): Promise<ISpecialization[]> {
        try {
            const specializations = await this.model.find()
            return specializations
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getSpecializationById(id: string): Promise<ISpecialization | null> {
        try {
            const specialization = await this.model.findById(id)
                .lean();

            return specialization;

        } catch (error) {

            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateSpecialization(id: string, updateData: Partial<ISpecialization>): Promise<ISpecialization | null> {
        try {

            const updatedData = await this.model.findByIdAndUpdate(
                id,
                { $set: updateData },
                { 
                    new: true,
                    runValidators: true,
                    lean: true
                }
            )
            
            if (!updatedData) {
                throw new AppError('Specialization not found', 404);
            }

            return updatedData;

        } catch (error) {
            if (error instanceof AppError) throw error;
            
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    



    
}

export default SpecializationRepository