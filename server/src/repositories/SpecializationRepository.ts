import { Model } from "mongoose";
import ISpecialization from "../interfaces/ISpecilazation";
import ISpecializationRepository from "./interfaces/ISpecializationRepository";
import { AppError } from "../utils/errors";

class SpecializationRepository implements ISpecializationRepository {

    private readonly model: Model<ISpecialization>

    constructor(model: Model<ISpecialization>) {
        this.model = model
    }


    async createSpecialization(specialization: ISpecialization): Promise<void> {
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

    
}

export default SpecializationRepository