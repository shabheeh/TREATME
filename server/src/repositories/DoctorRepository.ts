import { Model } from "mongoose";
import IDoctorRepository from "./interfaces/IDoctorRepository";
import IDoctor, { IDoctorsFilter, IDoctorsFilterResult} from "src/interfaces/IDoctor";



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
            throw new Error(`Failed to create doctor: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                throw new Error(`Failed to fetch doctors data: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
       }
}

export default DoctorRepository;