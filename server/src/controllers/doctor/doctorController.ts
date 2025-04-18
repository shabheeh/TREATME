import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorController, IDoctorService } from "../../interfaces/IDoctor";
import { getDoctorsWithSchedulesQuery } from "../../repositories/doctor/interfaces/IDoctorRepository";
import { Types } from "mongoose";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class DoctorController implements IDoctorController {
  private doctorService: IDoctorService;

  constructor(@inject(TYPES.IDoctorService) doctorService: IDoctorService) {
    this.doctorService = doctorService;
  }

  getDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const doctor = await this.doctorService.getDoctor(doctorId);

      res.status(HttpStatusCode.OK).json({ doctor });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Controller: getDoctor"
      );
      next(error);
    }
  };

  getDoctorsWithSchedules = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = {
        specialization: new Types.ObjectId(req.query.spec as string),
        gender: req.query.gen === "any" ? null : (req.query.gen as string),
        language: req.query.lan === "any" ? null : (req.query.lan as string),
        page: Number(req.query.page),
        selectedDate: (req.query.date as string) || new Date(),
      } as unknown as getDoctorsWithSchedulesQuery;

      const result = await this.doctorService.getDoctorsWithSchedules(query);

      res.status(HttpStatusCode.OK).json({ result });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Failed to fetch Doctors"
      );
      next(error);
    }
  };

  getDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = {
        specialization: req.query.spec as string,
        gender: req.query.gender as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string),
      };

      const result = await this.doctorService.getDoctors(query);
      res.status(HttpStatusCode.OK).json({ result });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: Failed to getDoctors"
      );
      next(error);
    }
  };
}

export default DoctorController;
