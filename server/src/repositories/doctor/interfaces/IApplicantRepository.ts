import { IApplicant, IApplicantsFilter, IApplicantsFilterResult } from "src/interfaces/IApplicant";


export default interface IApplicantRepository {
    createApplicant(applicant: IApplicant): Promise<void>
    findApplicantByEmail(email: String): Promise<IApplicant | null>
    getApplicants(filter: IApplicantsFilter): Promise<IApplicantsFilterResult>
}  