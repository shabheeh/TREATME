import { Model } from "mongoose";
import IDoctorRepository from "./interfaces/IDoctorRepository";
import IDoctor, { IDoctorsFilter, IDoctorsFilterResult} from "src/interfaces/IDoctor";
import { AppError } from "../../utils/errors";


class DoctorRepository implements IDoctorRepository {
    
    private readonly model: Model<IDoctor>

    constructor(model: Model<IDoctor>) {
        this.model = model
    }

    async createDoctor(doctor: Partial<IDoctor>): Promise<IDoctor> {
        try {
            const newDoctor = await this.model.create(doctor)
            return newDoctor.toObject()
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async findDoctorByEmail(email: string): Promise<IDoctor | null> {
        try {
            const doctor = await this.model.findOne({ email })
                .lean();
            return doctor;
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult> {
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
    
                const doctors = await this.model.find(query)
                    .skip(skip)
                    .limit(limit)
                const total = await this.model.countDocuments(query)
    
                return {
                    doctors,
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
}

export default DoctorRepository;