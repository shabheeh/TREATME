import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IAppointmentController,
  IAppointmentService,
} from "../../interfaces/IAppointment";
import { BadRequestError } from "../../utils/errors";
import { ITokenPayload } from "src/utils/jwt";

class AppointmentController implements IAppointmentController {
  private appointmentService: IAppointmentService;

  constructor(appointmentService: IAppointmentService) {
    this.appointmentService = appointmentService;
  }

  createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentData } = req.body;

      const appointment =
        await this.appointmentService.createAppointment(appointmentData);

      res.status(201).json({ appointment });
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

      res.status(200).json({ appointment });
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
      const { updateData } = req.body;

      if (!appointmentId || !updateData) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      if (updateData.status === "cancelled") {
        const appointment =
          await this.appointmentService.cancelAppointment(appointmentId);

        res.status(200).json({ appointment });
      }

      const appointment = await this.appointmentService.updateAppointment(
        appointmentId,
        updateData
      );

      res.status(200).json({ appointment });
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
      const { updateData } = req.body;

      if (!appointmentId || !updateData) {
        throw new BadRequestError("Bad Request: Missing info");
      }

      const appointment =
        await this.appointmentService.cancelAppointment(appointmentId);

      res.status(200).json({ appointment });
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

      res.status(200).json({ appointments });
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
      res.status(200).json({ appointments });
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

      res.status(200).json({ appointment });
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

      res.status(200).json({ patients, totalPatients });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "failed to fetch patients"
      );
      next(error);
    }
  };
}

export default AppointmentController;
