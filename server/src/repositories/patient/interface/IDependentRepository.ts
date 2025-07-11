import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";
import IDependent from "../../../interfaces/IDependent";

interface IDependentRepository extends IBaseRepository<IDependent> {
  findDependentById(id: string): Promise<IDependent | null>;
  updateDependent(
    id: string,
    updateData: Partial<IDependent>
  ): Promise<IDependent>;
  getDependents(primaryUserId: string): Promise<IDependent[] | []>;
  deleteDependent(id: string): Promise<void>;
  getDependentAges(): Promise<{ age: number }[]>;
}

export default IDependentRepository;
