import {
  getDoctorsQuery,
  getDoctorsResult,
  getDoctorsWithSchedulesResult,
  getDoctorWithScheduleQuery,
  IDoctor,
} from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

class DoctorService {
  async getDoctor(id: string): Promise<IDoctor> {
    try {
      const response = await api.doctor.get(`/doctors/${id}`);
      const { doctor } = response.data;
      return doctor;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching doctor: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getDoctorsWithSchedules({
    specialization,
    gender,
    selectedDate,
    page,
    language,
  }: getDoctorWithScheduleQuery): Promise<getDoctorsWithSchedulesResult> {
    try {
      const response = await api.doctor.get(
        `/doctors/schedules?spec=${specialization}&gen=${gender}&page=${page}&date=${selectedDate}&lan=${language}`
      );

      const { result } = response.data;
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error fetching doctors with schedule: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getDoctors({
    specialization,
    gender,
    search,
    page,
    limit,
  }: getDoctorsQuery): Promise<getDoctorsResult> {
    try {
      const response = await api.doctor.get(
        `/doctors?spec=${specialization}&gender=${gender}&page=${page}&limit=${limit}&search=${search}`
      );

      const { result } = response.data;
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error fetching doctors with schedule: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const doctorService = new DoctorService();
export default doctorService;
