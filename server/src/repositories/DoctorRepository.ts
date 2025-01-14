import { Model } from "mongoose";
import IDoctorRepository from "./interfaces/IDoctorRepository";
import IDoctor from "src/interfaces/IDoctor";



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
}

export default DoctorRepository;