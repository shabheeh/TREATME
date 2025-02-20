import IAdmin from 'src/interfaces/IAdmin';

interface IAdminRepository {
  findAdminById(id: string): Promise<IAdmin | null>;
  findAdminByEmail(email: string): Promise<IAdmin | null>;
}

export default IAdminRepository;
