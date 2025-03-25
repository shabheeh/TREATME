import IDashboardService from "src/services/dashboard/interface/IDashboardService";
import IDashboardController from "./interface/IDashboardController";
import { Request, Response, NextFunction } from "express";
import logger from "src/configs/logger";

class DashboardController implements IDashboardController {
  private dashboardService: IDashboardService;

  constructor(dashboardService: IDashboardService) {
    this.dashboardService = dashboardService;
  }

  getDashboardData = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dashboardData = await this.dashboardService.getDashboardStats();

      res.status(200).json(dashboardData);
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: error getting dashaboard data"
      );
      next(error);
    }
  };
}

export default DashboardController;
