import { Model } from "mongoose";
import IDependentRepository from "./interface/IDependentRepository";
import IDependent from "../../interfaces/IDependent";
import { AppError } from "../../utils/errors";

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

    async findDependentById(id: string): Promise<IDependent | null> {
           try {
               const dependent = await this.model.findById(id)
                   .lean();
               return dependent;
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

    async deleteDependent(id: string): Promise<void> {
        try {
            await this.model.findByIdAndDelete(id)
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateDependent(id: string, updateData: Partial<IDependent>): Promise<IDependent> {
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
                    throw new AppError('Dependent not found', 404);
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

export default DependentRepository