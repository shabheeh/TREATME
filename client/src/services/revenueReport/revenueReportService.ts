import { buildQueryParams } from "../../helpers/buildRevenueQuery";
import {
  AllDoctorsRevenueResponse,
  getRevenueReportQuery,
  RevenueReportData,
} from "../../types/revenueReport/revenueReport.types";
import { api } from "../../utils/axiosInterceptor";

const blobToDownload = (blob: Blob, filename: string) => {
  if (!(blob instanceof Blob)) {
    throw new Error("Invalid blob data received");
  }

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};

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
        console.error(`Error getting revenue report: ${error.message}`, error);
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
          `Error fetching all doctors revenue: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async downloadRevenueReportPdf(query: getRevenueReportQuery) {
    try {
      const queryString = buildQueryParams(query);

      const response = await api.admin.get<Blob>(
        `/pdf/reports?${queryString}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      let blob: Blob;
      if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        blob = new Blob([response.data], { type: "application/pdf" });
      }

      if (blob.size === 0) {
        throw new Error("Empty PDF received from server");
      }

      const fileName = `${query.doctorId ? "doctor" : "admin"}_revenue_report_${new Date().toISOString().split("T")[0]}.pdf`;
      blobToDownload(blob, fileName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error  downloading revenue report pdf: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async downloadDoctorsSummaryPdf(query: getRevenueReportQuery) {
    try {
      const queryString = buildQueryParams(query);
      const response = await api.admin.get<Blob>(
        `/pdf/reports/doctors?${queryString}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      let blob: Blob;
      if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        blob = new Blob([response.data], { type: "application/pdf" });
      }

      if (blob.size === 0) {
        throw new Error("Empty PDF received from server");
      }

      const fileName = `doctors_revenue_report_${new Date().toISOString().split("T")[0]}.pdf`;
      blobToDownload(blob, fileName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error  downloading revenue report pdf: ${error.message}`,
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
