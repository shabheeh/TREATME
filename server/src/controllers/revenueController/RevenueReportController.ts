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
          timeFilter as "weekly" | "monthly" | "yearly" | "custom",
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
          timeFilter as "weekly" | "monthly" | "yearly" | "custom",
          parsedPage
        );

      res.status(HttpStatusCode.OK).json(revenueSummary);
    } catch (error) {
      logger.error("Falied to get revenue summary of all doctors");
      next(error);
    }
  };
}

export default RevenueReportController;
