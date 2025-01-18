import { Model } from "mongoose";
import IApplicantRepository from "./interfaces/IApplicantRepository";
import { IApplicant } from "src/interfaces/IDoctor";
import { AppError } from "../utils/errors";


class ApplicantRepository implements IApplicantRepository {

    private readonly model: Model<IApplicant>

    constructor(model: Model<IApplicant>) {
        this.model = model;
    }

    async createApplicant(applicant: IApplicant): Promise<void> {
        try {
            await this.model.create(applicant)
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async findApplicantByEmail(email: String): Promise<IApplicant | null> {
        try {
            return this.model.findOne({ email })
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
            
        }
    }
}

export default ApplicantRepository; 