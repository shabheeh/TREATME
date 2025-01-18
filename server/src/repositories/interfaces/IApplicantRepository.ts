import { IApplicant } from "src/interfaces/IDoctor";


export default interface IApplicantRepository {
    createApplicant(applicant: IApplicant): Promise<void>
    findApplicantByEmail(email: String): Promise<IApplicant | null>
}  