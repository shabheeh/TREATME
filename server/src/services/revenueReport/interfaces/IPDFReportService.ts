import {
  AllDoctorsRevenueResponse,
  RevenueReportData,
} from "../../../repositories/revenueReport/interfaces/IRevenueReportRepository";

export interface IPDFReportService {
  generateRevenueReportPDF(
    data: RevenueReportData,
    reportType: "admin" | "doctor"
  ): Promise<Buffer>;
  generateDoctorsSummaryPDF(data: AllDoctorsRevenueResponse): Promise<Buffer>;
}
