import {
  IApplicant,
  IApplicantsFilter,
  IApplicantsFilterResult,
} from "src/interfaces/IApplicant";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

export default interface IApplicantRepository
  extends IBaseRepository<IApplicant> {
  findApplicantByEmail(email: string): Promise<IApplicant | null>;
  findApplicantById(applicantId: string): Promise<IApplicant | null>;
  getApplicants(filter: IApplicantsFilter): Promise<IApplicantsFilterResult>;
  deleteApplicant(applicantId: string): Promise<void>;
}
