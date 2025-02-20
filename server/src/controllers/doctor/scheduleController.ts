import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger';
import {
  IScheduleController,
  IScheduleService,
} from '../../interfaces/IDoctor';
import { BadRequestError } from '../../utils/errors';

class ScheduleController implements IScheduleController {
  private scheduleService: IScheduleService;

  constructor(scheduleService: IScheduleService) {
    this.scheduleService = scheduleService;
  }

  getSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Bad Request: Missing info');
      }

      const schedule = await this.scheduleService.getSchedule(id);
      res.status(200).json({ schedule });
    } catch (error) {
      logger.error('Failed to fetch schedule');
      next(error);
    }
  };

  updateSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { updateData } = req.body;

      if (!id || !updateData) {
        throw new BadRequestError('Bad Request: Missing info');
      }

      const schedule = await this.scheduleService.updateSchedule(
        id,
        updateData
      );

      res.status(200).json({ schedule });
    } catch (error) {
      logger.error('Failed to update doctor', error);
      next(error);
    }
  };
}

export default ScheduleController;
