import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger';
import { IDoctorController, IDoctorService } from '../../interfaces/IDoctor';
import { getDoctorsWithSchedulesQuery } from '../../repositories/doctor/interfaces/IDoctorRepository';
import { Types } from 'mongoose';
import { BadRequestError } from '../../utils/errors';

class DoctorController implements IDoctorController {
  private doctorService: IDoctorService;

  constructor(doctorService: IDoctorService) {
    this.doctorService = doctorService;
  }

  getDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Bad Request: Missing info');
      }

      const doctor = await this.doctorService.getDoctor(id);

      res.status(200).json({ doctor });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : 'Controller: getDoctor'
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
        gender: req.query.gen === 'any' ? null : (req.query.gen as string),
        language: req.query.lan === 'any' ? null : (req.query.lan as string),
        page: Number(req.query.page),
        selectedDate: (req.query.date as string) || new Date(),
      } as unknown as getDoctorsWithSchedulesQuery;

      const result = await this.doctorService.getDoctorsWithSchedules(query);

      res.status(200).json({ result });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : 'Failed to fetch Doctors'
      );
      next(error);
    }
  };
}

export default DoctorController;
