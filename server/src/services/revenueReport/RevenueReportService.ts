import { inject, injectable } from "inversify";
import { IRevenueReportService } from "./interfaces/IRevenueReportService ";
import {
  AllDoctorsRevenueResponse,
  IRevenueReportRepository,
  RevenueReportData,
  TimeFilter,
} from "src/repositories/revenueReport/interfaces/IRevenueReportRepository";
import { TYPES } from "../../types/inversifyjs.types";
import { IPDFReportService } from "./interfaces/IPDFReportService";

@injectable()
class RevenueReportService implements IRevenueReportService {
  private readonly revenueReportRepo: IRevenueReportRepository;
  private pdfReportService: IPDFReportService;

  constructor(
    @inject(TYPES.IRevenueReportRepository)
    revenueReportRepostiory: IRevenueReportRepository,
    @inject(TYPES.IPDFReportService) pdfReportService: IPDFReportService
  ) {
    this.revenueReportRepo = revenueReportRepostiory;
    this.pdfReportService = pdfReportService;
  }

  async getRevenueReport(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter = "monthly",
    page: number,
    doctorId?: string
  ): Promise<RevenueReportData> {
    return this.revenueReportRepo.getRevenueReport(
      startDate,
      endDate,
      timeFilter,
      page,
      false,
      doctorId
    );
  }

  async getAllDoctorsRevenueSummary(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter = "monthly",
    page: number
  ): Promise<AllDoctorsRevenueResponse> {
    return this.revenueReportRepo.getAllDoctorsRevenueSummary(
      startDate,
      endDate,
      timeFilter,
      page,
      false
    );
  }

  async generateRevenueReportPDF(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter = "monthly",
    page: number,
    doctorId?: string
  ): Promise<Buffer> {
    const revenueData = await this.revenueReportRepo.getRevenueReport(
      startDate,
      endDate,
      timeFilter,
      page,
      true,
      doctorId
    );
    const reportType = doctorId ? "doctor" : "admin";

    return await this.pdfReportService.generateRevenueReportPDF(
      revenueData,
      reportType
    );
  }

  async generateDoctorsSummaryPDF(
    startDate: Date,
    endDate: Date,
    timeFilter: TimeFilter,
    page: number
  ): Promise<Buffer> {
    const revenueSummary =
      await this.revenueReportRepo.getAllDoctorsRevenueSummary(
        startDate,
        endDate,
        timeFilter,
        page,
        true
      );
    return this.pdfReportService.generateDoctorsSummaryPDF(revenueSummary);
  }
}

export default RevenueReportService;
