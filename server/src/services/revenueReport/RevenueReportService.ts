import { inject, injectable } from "inversify";
import { IRevenueReportService } from "./interfaces/IRevenueReportService ";
import {
  AllDoctorsRevenueResponse,
  IRevenueReportRepository,
  RevenueReportData,
} from "src/repositories/revenueReport/interfaces/IRevenueReportRepository";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class RevenueReportService implements IRevenueReportService {
  private readonly revenueReportRepo: IRevenueReportRepository;

  constructor(
    @inject(TYPES.IRevenueReportRepository)
    revenueReportRepostiory: IRevenueReportRepository
  ) {
    this.revenueReportRepo = revenueReportRepostiory;
  }

  async getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom" = "monthly",
    page: number,
    doctorId?: string
  ): Promise<RevenueReportData> {
    return this.revenueReportRepo.getRevenueReport(
      startDate,
      endDate,
      timeFilter,
      page,
      doctorId
    );
  }

  async getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: "weekly" | "monthly" | "yearly" | "custom" = "monthly",
    page: number
  ): Promise<AllDoctorsRevenueResponse> {
    return this.revenueReportRepo.getAllDoctorsRevenueSummary(
      startDate,
      endDate,
      timeFilter,
      page
    );
  }
}

export default RevenueReportService;
