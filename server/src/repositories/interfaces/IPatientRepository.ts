import IPatient from "../../interfaces/IPatient";
import { IPatientsFilter, IPatientsFilterResult } from "../../interfaces/IPatient";

interface IPatientRepository {
    createPatient(user: Partial<IPatient>): Promise<IPatient>;
    findPatientByEmail(email: string): Promise<IPatient | null>;
    findPatientById(id: string): Promise<IPatient | null>;
    updatePatient(id: string,  updateData: Partial<IPatient>): Promise<IPatient | null>;
    getPatients(filter: IPatientsFilter): Promise<IPatientsFilterResult>
}

export default IPatientRepository


