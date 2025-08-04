import { inject, injectable } from "inversify";
import { IRevenueReportController } from "./interfaces/IRevenueReportController";
import { IRevenueReportService } from "src/services/revenueReport/interfaces/IRevenueReportService ";
import { TYPES } from "../../types/inversifyjs.types";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";
import { ResponseMessage } from "../../constants/responseMessages";
import {
  AllDoctorsRevenueResponse,
  RevenueReportData,
  TimeFilter,
} from "../../repositories/revenueReport/interfaces/IRevenueReportRepository";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { Types } from "mongoose";
import logger from "../../configs/logger";

@injectable()
class RevenueReportController implements IRevenueReportController {
  private revenueService: IRevenueReportService;

  constructor(
    @inject(TYPES.IRevenueReportService)
    revenueReportService: IRevenueReportService
  ) {
    this.revenueService = revenueReportService;
  }

  getRevenueReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        startDate,
        endDate,
        timeFilter = "monthly",
        page = "1",
        doctorId,
      } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date();
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (start > end) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const parsedPage = parseInt(page as string, 10);

      if (isNaN(parsedPage) || parsedPage < 1) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (doctorId) {
        if (!Types.ObjectId.isValid(doctorId as string)) {
          throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
        }
      }

      const reportData: RevenueReportData =
        await this.revenueService.getRevenueReport(
          start,
          end,
          timeFilter as TimeFilter,
          parsedPage,
          doctorId as string
        );

      res.status(HttpStatusCode.OK).json(reportData);
    } catch (error) {
      logger.error("Failed to get revenue summary");
      next(error);
    }
  };

  getAllDoctorsRevenueSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        startDate,
        endDate,
        timeFilter = "monthly",
        page = "1",
      } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date();
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (start > end) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const parsedPage = parseInt(page as string, 10);

      if (isNaN(parsedPage) || parsedPage < 1) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const revenueSummary: AllDoctorsRevenueResponse =
        await this.revenueService.getAllDoctorsRevenueSummary(
          start,
          end,
          timeFilter as TimeFilter,
          parsedPage
        );

      res.status(HttpStatusCode.OK).json(revenueSummary);
    } catch (error) {
      logger.error("Falied to get revenue summary of all doctors");
      next(error);
    }
  };

  generateRevenueReportPDF = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        startDate,
        endDate,
        timeFilter = "monthly",
        page = "1",
        doctorId,
      } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date();
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (start > end) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const parsedPage = parseInt(page as string, 10);

      if (isNaN(parsedPage) || parsedPage < 1) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (doctorId) {
        if (!Types.ObjectId.isValid(doctorId as string)) {
          throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
        }
      }
      const revenuReportPDF =
        await this.revenueService.generateRevenueReportPDF(
          start,
          end,
          timeFilter as TimeFilter,
          parsedPage,
          doctorId as string
        );

      const fileName = `${doctorId ? "doctor" : "admin"}_revenue_report_${new Date().toISOString().split("T")[0]}.pdf`;

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": revenuReportPDF.length.toString(),
      });

      res.send(revenuReportPDF);
    } catch (error) {
      logger.error("Failed to generate revenue report pdf", error);
      next(error);
    }
  };

  generateDoctorsSummaryPDF = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        startDate,
        endDate,
        timeFilter = "monthly",
        page = "1",
      } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date();
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      if (start > end) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const parsedPage = parseInt(page as string, 10);

      if (isNaN(parsedPage) || parsedPage < 1) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const revenueSummaryPDF =
        await this.revenueService.generateDoctorsSummaryPDF(
          start,
          end,
          timeFilter as TimeFilter,
          parsedPage
        );

      const fileName = `doctors_revenue_summary_${new Date().toISOString().split("T")[0]}.pdf`;

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": revenueSummaryPDF.length.toString(),
      });

      res.send(revenueSummaryPDF);
    } catch (error) {
      logger.error("Failed to generate doctors revenue pdf", error);
      next(error);
    }
  };
}

export default RevenueReportController;
