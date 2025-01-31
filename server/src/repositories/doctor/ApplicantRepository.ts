import { Model } from "mongoose";
import IApplicantRepository from "./interfaces/IApplicantRepository";
import { IApplicant } from "src/interfaces/IApplicant";
import { AppError } from "../../utils/errors";
import { IApplicantsFilter, IApplicantsFilterResult } from "src/interfaces/IApplicant";


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

    async findApplicantByEmail(email: string): Promise<IApplicant | null> {
        try {
            const applicant = await this.model.findOne({ email }).populate('specialization');
            return applicant;
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
            
        }
    }

    async getApplicants(filter: IApplicantsFilter): Promise<IApplicantsFilterResult> {
        try {
            const { page, limit, search } = filter;
            const skip = (page - 1) * limit;

            const query: any = {}

            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }

            ]

            const applicants = await this.model.find(query)
                .populate('specialization')
                .skip(skip)
                .limit(limit)
            const total = await this.model.countDocuments(query)

            return {
                applicants,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async findApplicantById(id: string): Promise<IApplicant | null> {
        try {
            const applicant = await this.model.findById(id).populate('specialization');
            return applicant;
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
            
        }
    }
}

export default ApplicantRepository; 