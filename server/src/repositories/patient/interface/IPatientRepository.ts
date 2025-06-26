import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";
import IPatient from "../../../interfaces/IPatient";
import {
  IPatientsFilter,
  IPatientsFilterResult,
} from "../../../interfaces/IPatient";

interface IPatientRepository extends IBaseRepository<IPatient> {
  findPatientByEmail(email: string): Promise<IPatient | null>;
  findPatientById(id: string): Promise<IPatient | null>;
  updatePatient(
    userId: string,
    patientData: Partial<IPatient>
  ): Promise<IPatient | null>;
  getPatients(filter: IPatientsFilter): Promise<IPatientsFilterResult>;
  getPatientWithPassword(userId: string): Promise<IPatient>;
  getPatientsAges(): Promise<{ age: number }[]>;
}

export default IPatientRepository;
