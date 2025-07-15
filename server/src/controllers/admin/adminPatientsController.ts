import { Request, Response, NextFunction } from "express";
import {
  IAdminPatientsController,
  IAdminPatientsService,
} from "../../interfaces/IAdmin";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class AdminPatientsController implements IAdminPatientsController {
  private adminPatientsService: IAdminPatientsService;

  constructor(
    @inject(TYPES.IAdminPatientsService)
    adminPatientsService: IAdminPatientsService
  ) {
    this.adminPatientsService = adminPatientsService;
  }

  getPatients = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params = {
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string),
        search: req.query.search as string,
      };

      const result = await this.adminPatientsService.getPatients(params);

      res.status(HttpStatusCode.OK).json({ result });
    } catch (error) {
      logger.error("controller:error fetching patients data ", error);
      next(error);
    }
  };

  togglePatientActivityStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { isActive } = req.body;
      const { patientId } = req.params;

      await this.adminPatientsService.togglePatientActivityStatus(
        patientId,
        isActive
      );

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
      });
    } catch (error) {
      logger.error("controller: Error block or unblock patient:", error);
      next(error);
    }
  };
}

export default AdminPatientsController;
