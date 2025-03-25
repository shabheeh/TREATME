import { DashboardData } from "../../types/dashboard/dashboard.types";
import { api } from "../../utils/axiosInterceptor";

class DashboardService {
  async getAdminDashboard(): Promise<DashboardData> {
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
}

const dashboardService = new DashboardService();
export default dashboardService;
