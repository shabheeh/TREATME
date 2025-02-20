import IDependent from '../../../interfaces/IDependent';

interface IDependentRepository {
  createDependent(dependent: Partial<IDependent>): Promise<IDependent>;
  findDependentById(id: string): Promise<IDependent | null>;
  updateDependent(
    id: string,
    updateData: Partial<IDependent>
  ): Promise<IDependent>;
  getDependents(primaryUserId: string): Promise<IDependent[] | []>;
  deleteDependent(id: string): Promise<void>;
}

export default IDependentRepository;
