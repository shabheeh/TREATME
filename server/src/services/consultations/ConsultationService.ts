import { IConsultationRepository } from "src/repositories/consultations/interface/IConsultationRepository";
import { IConsultationService } from "./interface/IConsultationService";
import {
  CreateConsultation,
  IConsultation,
} from "src/interfaces/IConsultation";
import { AppError } from "../../utils/errors";
import {
  ConsultationDTO,
  toConsultationDTO,
} from "../../dtos/consultation.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ConsultationService implements IConsultationService {
  private consultationRepo: IConsultationRepository;

  constructor(
    @inject(TYPES.IConsultationRepository)
    consultationRepo: IConsultationRepository
  ) {
    this.consultationRepo = consultationRepo;
  }

  async createConsultation(
    consultationData: CreateConsultation
  ): Promise<IConsultation> {
    return await this.consultationRepo.create(consultationData);
  }

  async getConsultationById(consultationId: string): Promise<IConsultation> {
    const consultation = await this.consultationRepo.findById(consultationId);
    if (!consultation) {
      throw new AppError("Document not found", 404);
    }
    return consultation;
  }

  async updateConsultation(
    id: string,
    consultationData: Partial<IConsultation>
  ): Promise<ConsultationDTO> {
    const consultation = await this.consultationRepo.update(
      id,
      consultationData
    );
    if (!consultation) {
      throw new AppError("Something went wrong");
    }

    return await this.getConsultationByAppointmentId(
      consultation.appointment.toString()
    );
  }

  async getConsultationByAppointmentId(
    appointmentId: string
  ): Promise<ConsultationDTO> {
    const consultation =
      await this.consultationRepo.getByAppointmentId(appointmentId);

    const consultationDTO = toConsultationDTO(consultation);
    return consultationDTO;
  }
}

export default ConsultationService;
