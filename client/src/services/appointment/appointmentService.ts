import IAppointment, {
  IAppointmentPopulated,
} from "../../types/appointment/appointment.types";
import { IPatientForDoctor } from "../../types/patient/patient.types";
import { api } from "../../utils/axiosInterceptor";

class AppointmentService {
  async createAppointment(
    appointmentData: IAppointment,
    timeZone: string
  ): Promise<IAppointment> {
    try {
      const response = await api.post("/appointments", {
        appointmentData,
        timeZone,
      });
      const { appointment } = response.data;
      return appointment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error creating appointment: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getAppointment(id: string): Promise<IAppointmentPopulated> {
    try {
      const response = await api.get(`/appointment/${id}`);

      const { appointment } = response.data;
      return appointment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching appointment: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getAppointments(): Promise<IAppointmentPopulated[]> {
    try {
      const response = await api.get(`/appointments`);

      const { appointments } = response.data;

      return appointments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching appointments: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getAppointmentsForUser(id: string): Promise<IAppointmentPopulated[]> {
    try {
      const response = await api.get(`/appointments/${id}`);
      const { appointments } = response.data;
      return appointments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching appointments: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async updateAppointment(
    id: string,
    updateData: Partial<IAppointment>
  ): Promise<IAppointment> {
    try {
      const response = await api.put(`/appointments/${id}`, {
        updateData,
      });
      const { appointment } = response.data;
      return appointment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error updating appointment: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getAppointmentByPaymentId(id: string): Promise<IAppointmentPopulated> {
    try {
      const response = await api.get(`/appointment/payment/${id}`);

      const { appointment } = response.data;
      return appointment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching appointment: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getPatientsByDoctor(
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<{
    patients: IPatientForDoctor[];
    totalPatients: number;
  }> {
    try {
      const response = await api.get(
        `/appointments/patients?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching patients for doctor: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async updateAppointmentStatus(appointmentId: string): Promise<void> {
    try {
      await api.patch(`/appointments/${appointmentId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching patients for doctor: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
