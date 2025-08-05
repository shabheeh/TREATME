import {
  AllDoctorsRevenueResponse,
  RevenueReportData,
} from "../../../repositories/revenueReport/interfaces/IRevenueReportRepository";

export interface IHTMLTemplateService {
  generateRevenueReportHTML(
    data: RevenueReportData,
    reportType: "admin" | "doctor"
  ): string;
  generateDoctorsSummaryHTML(data: AllDoctorsRevenueResponse): string;
}
