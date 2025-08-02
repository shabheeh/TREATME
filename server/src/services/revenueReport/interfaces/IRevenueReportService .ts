import {
  AllDoctorsRevenueResponse,
  RevenueReportData,
} from "src/repositories/revenueReport/interfaces/IRevenueReportRepository";

export interface IRevenueReportService {
  getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom",
    page: number,
    doctorId?: string
  ): Promise<RevenueReportData>;
  getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom",
    page: number
  ): Promise<AllDoctorsRevenueResponse>;
}
