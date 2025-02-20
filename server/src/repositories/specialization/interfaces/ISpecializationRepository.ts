import ISpecialization from 'src/interfaces/ISpecilazation';

interface ISpecializationRepository {
  createSpecialization(specialization: ISpecialization): Promise<void>;
  getSpecializationByName(name: string): Promise<ISpecialization | null>;
  getSpecializations(): Promise<ISpecialization[]>;
  getSpecializationById(id: string): Promise<ISpecialization | null>;
  updateSpecialization(
    id: string,
    updateData: Partial<ISpecialization>
  ): Promise<ISpecialization>;
}

export default ISpecializationRepository;
