import IDashboardService from "src/services/dashboard/interface/IDashboardService";
import IDashboardController from "./interface/IDashboardController";
import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { ITokenPayload } from "src/utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class DashboardController implements IDashboardController {
  private dashboardService: IDashboardService;

  constructor(
    @inject(TYPES.IDashboardService) dashboardService: IDashboardService
  ) {
    this.dashboardService = dashboardService;
  }

  getAdminDashboardData = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dashboardData =
        await this.dashboardService.getAdminDashboardStats();

      res.status(HttpStatusCode.OK).json(dashboardData);
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: error getting dashaboard data"
      );
      next(error);
    }
  };

  getDoctorDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctorId = (req.user as ITokenPayload).id;

      const dashboardData =
        await this.dashboardService.getDoctorDashboardStats(doctorId);
      res.status(HttpStatusCode.OK).json(dashboardData);
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: error getting dashaboard data for doctor"
      );
      next(error);
    }
  };
}

export default DashboardController;
