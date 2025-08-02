import { buildQueryParams } from "../../helpers/buildRevenueQuery";
import {
  AllDoctorsRevenueResponse,
  getRevenueReportQuery,
  RevenueReportData,
} from "../../types/revenueReport/revenueReport.types";
import { api } from "../../utils/axiosInterceptor";

class RevenueReportService {
  async getRevenueReport(
    query: getRevenueReportQuery
  ): Promise<RevenueReportData> {
    try {
      const queryString = buildQueryParams(query);
      const response = await api.admin.get(`/reports?${queryString}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error adding or updating review: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getAllDoctorsRevenueSummary(
    query: getRevenueReportQuery
  ): Promise<AllDoctorsRevenueResponse> {
    try {
      const queryString = buildQueryParams(query);
      const response = await api.admin.get(`/reports/doctors?${queryString}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error adding or updating review: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const revenueReportService = new RevenueReportService();
export default revenueReportService;
