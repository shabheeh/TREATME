import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IAppointmentController,
  IAppointmentService,
} from "../../interfaces/IAppointment";
import { BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class AppointmentController implements IAppointmentController {
  private appointmentService: IAppointmentService;

  constructor(
    @inject(TYPES.IAppointmentService) appointmentService: IAppointmentService
  ) {
    this.appointmentService = appointmentService;
  }

  createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentData, timeZone } = req.body;

      if (!appointmentData || !timeZone) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const appointment = await this.appointmentService.createAppointment(
        appointmentData,
        timeZone
      );

      res.status(HttpStatusCode.CREATED).json({ appointment });
    } catch (error) {
      logger.error("Failed to create appointment", error);
      next(error);
    }
  };

  getAppointmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const appointment =
        await this.appointmentService.getAppointmentById(appointmentId);

      res.status(HttpStatusCode.OK).json({ appointment });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "failed to get appointment"
      );
      next(error);
    }
  };

  updateAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId } = req.params;
      const { updateData, timeZone } = req.body;

      if (!appointmentId || !updateData || !timeZone) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      if (updateData.status === "cancelled") {
        const appointment = await this.appointmentService.cancelAppointment(
          appointmentId,
          timeZone
        );

        res.status(HttpStatusCode.OK).json({ appointment });
      }

      const appointment = await this.appointmentService.updateAppointment(
        appointmentId,
        updateData,
        timeZone
      );

      res.status(HttpStatusCode.OK).json({ appointment });
    } catch (error) {
      logger.error("Failed to update appointment");
      next(error);
    }
  };

  cancelAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId } = req.params;
      const { updateData, timeZone } = req.body;

      if (!appointmentId || !updateData || !timeZone) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const appointment = await this.appointmentService.cancelAppointment(
        appointmentId,
        timeZone
      );

      res.status(HttpStatusCode.OK).json({ appointment });
    } catch (error) {
      logger.error("Failed to update appointment");
      next(error);
    }
  };

  getAppointmentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const role = (req.user as ITokenPayload).role;

      if (!userId || !role) {
        throw new BadRequestError("Bad Request: Missing information");
      }

      const appointments =
        await this.appointmentService.getAppointmentsByUserId(userId, role);

      res.status(HttpStatusCode.OK).json({ appointments });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller Error: getAppointmentByUserId"
      );
      next(error);
    }
  };

  getAppointments = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const appointments = await this.appointmentService.getAppointments();
      res.status(HttpStatusCode.OK).json({ appointments });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller Error: getAppointments"
      );
      next(error);
    }
  };

  getAppointmentByPaymentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const appointment =
        await this.appointmentService.getAppointmentByPaymentId(paymentId);

      res.status(HttpStatusCode.OK).json({ appointment });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "failed to get appointment"
      );
      next(error);
    }
  };

  getPatientsForDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctorId = (req.user as ITokenPayload).id;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const searchQuery = String(req.query.searchTerm) || "";

      const { patients, totalPatients } =
        await this.appointmentService.getPatientsByDoctor(
          doctorId,
          page,
          limit,
          searchQuery
        );

      res.status(HttpStatusCode.OK).json({ patients, totalPatients });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "failed to fetch patients"
      );
      next(error);
    }
  };
  updateAppointmentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        throw new BadRequestError("Missing appointment id in the request");
      }

      await this.appointmentService.updateAppointmentStatus(appointmentId);

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Appointment status updated successfully" });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Error updating appointment status"
      );
      next(error);
    }
  };
}

export default AppointmentController;
