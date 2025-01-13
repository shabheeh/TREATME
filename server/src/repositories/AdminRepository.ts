import { Model } from 'mongoose';
import IAdmin from "../interfaces/IAdmin";
import IAdminRepository from "./interfaces/IAdminRepository";

class AdminRepository implements IAdminRepository {
    private readonly model: Model<IAdmin>;

    constructor(model: Model<IAdmin>) {
        this.model = model;
    }

    async createAdmin(admin: Partial<IAdmin>): Promise<void> {
        try {
            await this.model.create(admin);
        } catch (error) {
            throw new Error(`Error creating admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findAdminById(id: string): Promise<IAdmin | null> {
        try {
            const admin = await this.model.findById(id)
                .select('-password')
                .lean();
            return admin;
        } catch (error) {
            throw new Error(`Error finding admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        try {
            const admin = await this.model.findOne({ email })
                .lean();
            return admin;
        } catch (error) {
            throw new Error(`Error finding admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}


export default AdminRepository;