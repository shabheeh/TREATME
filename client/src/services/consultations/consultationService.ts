import {
  IConsultation,
  IConsultationPopulated,
} from "../../types/consultations/consultation.types";
import { api } from "../../utils/axiosInterceptor";

class ConsultationService {
  async getConsultationById(id: string): Promise<IConsultation> {
    try {
      const response = await api.get(`/consultations/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching dashboard data: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async updateConsultation(
    id: string,
    consultationData: Partial<IConsultation>
  ) {
    try {
      const response = await api.post(`/consultations/${id}`, {
        consultationData,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching dashboard data: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getConsultationByAppointmentId(
    id: string
  ): Promise<IConsultationPopulated> {
    try {
      const response = await api.get(`/${id}/consultations`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching dashboard data: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const consultationService = new ConsultationService();
export default consultationService;
