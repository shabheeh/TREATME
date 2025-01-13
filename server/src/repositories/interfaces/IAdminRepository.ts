import IAdmin from "src/interfaces/IAdmin";


interface IAdminRepository {
    createAdmin(admin: Partial<IAdmin>): Promise<void>;
    findAdminById(id: string): Promise<IAdmin | null>
    findAdminByEmail(email: string): Promise<IAdmin | null>
    
}

export default IAdminRepository