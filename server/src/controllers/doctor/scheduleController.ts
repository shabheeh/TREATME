import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import {
  IScheduleController,
  IScheduleService,
} from "../../interfaces/ISchedule";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class ScheduleController implements IScheduleController {
  private scheduleService: IScheduleService;

  constructor(
    @inject(TYPES.IScheduleService) scheduleService: IScheduleService
  ) {
    this.scheduleService = scheduleService;
  }

  getSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const schedule = await this.scheduleService.getSchedule(doctorId);
      res.status(HttpStatusCode.OK).json({ schedule });
    } catch (error) {
      logger.error("Failed to fetch schedule");
      next(error);
    }
  };

  updateSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { updateData } = req.body;

      if (!doctorId || !updateData) {
        throw new BadRequestError(ResponseMessage.WARNING.INCOMPLETE_DATA);
      }

      const schedule = await this.scheduleService.updateSchedule(
        doctorId,
        updateData
      );

      res.status(HttpStatusCode.OK).json({ schedule });
    } catch (error) {
      logger.error("Failed to update schedule", error);
      next(error);
    }
  };

  addTimeSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { date, startTime, durationInMinutes, timeZone } = req.body;

      const updatedSchedule = await this.scheduleService.addTimeSlot({
        doctorId,
        date,
        startTime,
        timeZone,
        durationInMinutes,
      });

      res.status(HttpStatusCode.OK).json(updatedSchedule);
    } catch (error) {
      logger.error("Failed to add time slot", error);
      next(error);
    }
  };

  removeTimeSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { date, slotId } = req.query as { date: string; slotId: string };

      console.log(doctorId, date, slotId, "dfasd");

      const updatedSchedule = await this.scheduleService.removeTimeSlot({
        doctorId,
        date,
        slotId,
      });

      res.status(200).json({
        success: true,
        data: updatedSchedule,
        message: "Time slot removed successfully",
      });
    } catch (error) {
      logger.error("Failed to remove time slot", error);
      next(error);
    }
  };

  getAvailableSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!date || typeof date !== "string") {
        res.status(400).json({
          success: false,
          message: "Date query parameter is required",
        });
        return;
      }

      const availableSlots = await this.scheduleService.getAvailableSlots(
        doctorId,
        date
      );

      res.status(200).json({
        success: true,
        data: availableSlots,
        message: "Available slots retrieved successfully",
      });
    } catch (error) {
      logger.error("Failed to get available slots", error);
      next(error);
    }
  };

  bulkUpdateSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { updates } = req.body;

      const updatedSchedule = await this.scheduleService.bulkUpdateSlots({
        doctorId,
        updates,
      });

      res.status(200).json({
        success: true,
        data: updatedSchedule,
        message: "Bulk update completed successfully",
      });
    } catch (error) {
      logger.error("Failed to update bulk slots", error);
      next(error);
    }
  };

  getScheduleSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;

      const summary = await this.scheduleService.getScheduleSummary(doctorId);

      res.status(200).json({
        success: true,
        data: summary,
        message: "Schedule summary retrieved successfully",
      });
    } catch (error) {
      logger.error("Failed to get schedule summary", error);
      next(error);
    }
  };

  generateSlotsForDateRange = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate, timeSlots, excludeWeekends } = req.body;

      const updatedSchedule =
        await this.scheduleService.generateSlotsForDateRange(
          doctorId,
          startDate,
          endDate,
          timeSlots,
          excludeWeekends
        );

      res.status(201).json({
        success: true,
        data: updatedSchedule,
        message: "Slots generated successfully for date range",
      });
    } catch (error) {
      logger.error("Failed to generate slots for date range", error);
      next(error);
    }
  };
}

export default ScheduleController;
