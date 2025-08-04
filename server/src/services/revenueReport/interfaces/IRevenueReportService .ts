import {
  AllDoctorsRevenueResponse,
  RevenueReportData,
  TimeFilter,
} from "src/repositories/revenueReport/interfaces/IRevenueReportRepository";

export interface IRevenueReportService {
  getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number,
    doctorId?: string
  ): Promise<RevenueReportData>;
  getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number
  ): Promise<AllDoctorsRevenueResponse>;
  generateRevenueReportPDF(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number,
    doctorId?: string
  ): Promise<Buffer>;
  generateDoctorsSummaryPDF(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number
  ): Promise<Buffer>;
}
