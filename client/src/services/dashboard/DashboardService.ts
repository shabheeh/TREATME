import {
  AdminDashboardData,
  DoctorDashboardData,
} from "../../types/dashboard/dashboard.types";
import { api } from "../../utils/axiosInterceptor";

class DashboardService {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    try {
      const response = await api.get("/dashboard");
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

  async getDoctorDashboard(filter: string): Promise<DoctorDashboardData> {
    try {
      const response = await api.get(`/dashboard/doctor?filter=${filter}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error fetching dashboard data for doctor: ${error.message}`
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
