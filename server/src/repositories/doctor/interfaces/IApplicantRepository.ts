import {
  IApplicant,
  IApplicantsFilter,
  IApplicantsFilterResult,
} from "src/interfaces/IApplicant";

export default interface IApplicantRepository {
  createApplicant(applicant: IApplicant): Promise<void>;
  findApplicantByEmail(email: string): Promise<IApplicant | null>;
  findApplicantById(applicantId: string): Promise<IApplicant | null>;
  getApplicants(filter: IApplicantsFilter): Promise<IApplicantsFilterResult>;
  deleteApplicant(applicantId: string): Promise<void>;
}
