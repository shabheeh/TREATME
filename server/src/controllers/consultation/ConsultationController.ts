import { IConsultationService } from "src/services/consultations/interface/IConsultationService";
import { IConsultationController } from "./interface/IConsultationController";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";
import { ResponseMessage } from "../../constants/responseMessages";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import logger from "../../configs/logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ConsultationController implements IConsultationController {
  private consultationService: IConsultationService;

  constructor(
    @inject(TYPES.IConsultationService)
    consultationService: IConsultationService
  ) {
    this.consultationService = consultationService;
  }

  getConsultationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { consultationId } = req.params;
      if (!consultationId) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const consultation =
        await this.consultationService.getConsultationById(consultationId);
      res.status(HttpStatusCode.OK).json(consultation);
    } catch (error) {
      logger.error("Failed to get consultation by id", error);
      next(error);
    }
  };

  updateConsultation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { consultationId } = req.params;
      const { consultationData } = req.body;
      if (!consultationId || !consultationData) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const consultation = await this.consultationService.updateConsultation(
        consultationId,
        consultationData
      );
      res.status(HttpStatusCode.OK).json(consultation);
    } catch (error) {
      logger.error("Failed to update consultation", error);
      next(error);
    }
  };

  getConsultationByAppointmentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId } = req.params;
      if (!appointmentId) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }
      const consultation =
        await this.consultationService.getConsultationByAppointmentId(
          appointmentId
        );
      res.status(HttpStatusCode.OK).json(consultation);
    } catch (error) {
      logger.error("Failed to get consultation by appoitnment id", error);
      next(error);
    }
  };
}

export default ConsultationController;
