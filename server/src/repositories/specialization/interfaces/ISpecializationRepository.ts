import ISpecialization from "src/interfaces/ISpecilazation";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

interface ISpecializationRepository extends IBaseRepository<ISpecialization> {
  getSpecializationByName(name: string): Promise<ISpecialization | null>;
  getSpecializations(): Promise<ISpecialization[]>;
  getSpecializationById(
    specializationId: string
  ): Promise<ISpecialization | null>;
  updateSpecialization(
    specializationId: string,
    updateData: Partial<ISpecialization>
  ): Promise<ISpecialization>;
}

export default ISpecializationRepository;
