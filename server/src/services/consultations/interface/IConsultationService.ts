import { ConsultationDTO } from "src/dtos/consultation.dto";
import {
  CreateConsultation,
  IConsultation,
} from "src/interfaces/IConsultation";

export interface IConsultationService {
  createConsultation(
    consultationData: CreateConsultation
  ): Promise<IConsultation>;
  getConsultationById(consultationId: string): Promise<IConsultation>;
  updateConsultation(
    id: string,
    consultationData: Partial<IConsultation>
  ): Promise<ConsultationDTO>;
  getConsultationByAppointmentId(
    appointmentId: string
  ): Promise<ConsultationDTO>;
}
