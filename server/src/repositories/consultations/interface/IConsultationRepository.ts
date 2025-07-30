import {
  IConsultation,
  IConsultationPopulated,
} from "src/interfaces/IConsultation";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

export interface IConsultationRepository
  extends IBaseRepository<IConsultation> {
  getByAppointmentId(appointmentId: string): Promise<IConsultationPopulated>;
}
