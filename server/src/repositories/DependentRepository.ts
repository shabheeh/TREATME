import { Model } from "mongoose";
import IDependentRepository from "./interfaces/IDependentRepository";
import IDependent from "../interfaces/IDependent";
import { AppError } from "../utils/errors";

class DependentRepository implements IDependentRepository {

    private readonly model: Model<IDependent>;

    constructor(model: Model<IDependent>) {
        this.model = model
    }

    async createDependent(dependent: Partial<IDependent>): Promise<IDependent> {
        try {
            const newDependent = await this.model.create(dependent);
            return newDependent.toObject();
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getDependents(primaryUserId: string): Promise<IDependent[] | []> {
        try {
            const dependents = await this.model.find({ primaryUserId }).lean();
            
            return dependents || []

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
}

export default DependentRepository