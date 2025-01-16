import { Model } from "mongoose";
import IApplicantRepository from "./interfaces/IApplicantRepository";
import { IApplicant } from "src/interfaces/IDoctor";



class ApplicantRepository implements IApplicantRepository {

    private readonly model: Model<IApplicant>

    constructor(model: Model<IApplicant>) {
        this.model = model;
    }

    async createApplicant(applicant: IApplicant): Promise<void> {
        try {
            await this.model.create(applicant)
        } catch (error) {
            throw new Error(`Failed to create applicant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default ApplicantRepository;