import { IApplicant } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

interface UrlQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface ResponseData {
  applicants: IApplicant[] | [];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

class ApplicantService {
  async createApplicant(applicant: FormData): Promise<{ message: string }> {
    try {
      const response = await api.doctor.post("/applicants", applicant);

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`error creating applicant: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown creating applicant`, error);
      throw new Error(`Something went error`);
    }
  }

  async getApplicants({
    page,
    limit,
    search,
  }: UrlQuery): Promise<ResponseData> {
    try {
      const response = await api.doctor.get(
        `/applicants?page=${page}&limit=${limit}&search=${search}`
      );

      const { result } = response.data;

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching applicants: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown creating applicant`, error);
      throw new Error(`Something went error`);
    }
  }

  async getApplicant(id: string): Promise<IApplicant> {
    try {
      const response = await api.doctor.get(`/applicants/${id}`);

      const { applicant } = response.data;

      return applicant;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching applicant: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async rejectApplicant(id: string): Promise<void> {
    try {
      await api.doctor.delete(`/applicants/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error removing applicant: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const applicantService = new ApplicantService();

export default applicantService;
