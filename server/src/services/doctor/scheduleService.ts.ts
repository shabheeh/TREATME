import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import {
  AddTimeSlotRequest,
  BulkUpdateSlotsRequest,
  ISchedule,
  IScheduleService,
  ISlot,
  RemoveTimeSlotRequest,
} from "../../interfaces/ISchedule";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import dayjs from "dayjs";

@injectable()
class ScheduleService implements IScheduleService {
  private scheduleRepo: IScheduleRepository;

  constructor(
    @inject(TYPES.IScheduleRepository) scheduleRepo: IScheduleRepository
  ) {
    this.scheduleRepo = scheduleRepo;
  }

  async getSchedule(doctorId: string): Promise<ISchedule | null> {
    try {
      const schedule = await this.scheduleRepo.findSchedule(doctorId);
      return schedule;
    } catch (error) {
      logger.error("Failed to update doctor Shedule");
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async updateSchedule(
    doctorId: string,
    updateData: Partial<ISchedule>
  ): Promise<ISchedule> {
    try {
      const arrangeUpdateData = updateData.availability?.filter(
        (slot) => slot.slots.length > 0
      );

      const updatedData: Partial<ISchedule> = {
        ...updateData,
        availability: arrangeUpdateData,
      };

      const updatedSchedule = await this.scheduleRepo.updateSchedule(
        doctorId,
        updatedData
      );

      return updatedSchedule;
    } catch (error) {
      logger.error("Failed to update doctor Shedule");
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async addTimeSlot(request: AddTimeSlotRequest): Promise<ISchedule> {
    const {
      doctorId,
      date,
      startTime,
      timeZone,
      durationInMinutes = 30,
    } = request;

    if (!doctorId || !date || !startTime) {
      throw new AppError("Doctor ID, date, and start time are required");
    }

    if (durationInMinutes <= 0 || durationInMinutes > 480) {
      throw new AppError("Duration must be between 1 and 480 minutes");
    }

    if (!dayjs(date).isValid()) {
      throw new AppError("Invalid date format");
    }

    if (!dayjs(startTime).isValid()) {
      throw new AppError("Invalid start time format");
    }

    return await this.scheduleRepo.addTimeSlot(
      doctorId,
      date,
      startTime,
      durationInMinutes,
      timeZone
    );
  }

  async removeTimeSlot(request: RemoveTimeSlotRequest): Promise<ISchedule> {
    const { doctorId, date, slotId } = request;

    if (!doctorId || !date || !slotId) {
      throw new AppError("Doctor ID, date, and slot ID are required");
    }

    if (!dayjs(date).isValid()) {
      throw new AppError("Invalid date format");
    }

    return await this.scheduleRepo.removeTimeSlot(doctorId, date, slotId);
  }

  async updateBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void> {
    await this.scheduleRepo.updateBookingStatus(doctorId, dayId, slotId);
  }

  async toggleBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void> {
    await this.scheduleRepo.toggleBookingStatus(doctorId, dayId, slotId);
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<ISlot[]> {
    if (!doctorId || !date) {
      throw new AppError("Doctor ID and date are required");
    }

    if (!dayjs(date).isValid()) {
      throw new AppError("Invalid date format");
    }

    return await this.scheduleRepo.getAvailableSlots(doctorId, date);
  }

  async bulkUpdateSlots(request: BulkUpdateSlotsRequest): Promise<ISchedule> {
    const { doctorId, updates } = request;

    if (!doctorId || !updates || !Array.isArray(updates)) {
      throw new AppError("Doctor ID and updates array are required");
    }

    for (const update of updates) {
      if (!update.date || !Array.isArray(update.slots)) {
        throw new AppError(
          "Each update must have a valid date and slots array"
        );
      }

      if (!dayjs(update.date).isValid()) {
        throw new AppError(`Invalid date format: ${update.date}`);
      }

      for (const slot of update.slots) {
        if (!slot.startTime || !slot.endTime) {
          throw new AppError("Each slot must have start time and end time");
        }

        if (
          !dayjs(slot.startTime).isValid() ||
          !dayjs(slot.endTime).isValid()
        ) {
          throw new AppError("Invalid time format in slot");
        }

        if (dayjs(slot.endTime).isBefore(dayjs(slot.startTime))) {
          throw new AppError("End time must be after start time");
        }
      }
    }

    return await this.scheduleRepo.bulkUpdateSlots(doctorId, updates);
  }

  async getScheduleSummary(doctorId: string): Promise<{
    totalDays: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    upcomingDates: string[];
  }> {
    if (!doctorId) {
      throw new AppError("Doctor ID is required");
    }

    const schedule = await this.scheduleRepo.findSchedule(doctorId);

    if (!schedule) {
      return {
        totalDays: 0,
        totalSlots: 0,
        bookedSlots: 0,
        availableSlots: 0,
        upcomingDates: [],
      };
    }

    const totalDays = schedule.availability.length;
    let totalSlots = 0;
    let bookedSlots = 0;

    const upcomingDates = schedule.availability
      .map((day) => dayjs(day.date).format("YYYY-MM-DD"))
      .sort();

    for (const day of schedule.availability) {
      totalSlots += day.slots.length;
      bookedSlots += day.slots.filter((slot) => slot.isBooked).length;
    }

    return {
      totalDays,
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots,
      upcomingDates,
    };
  }

  async generateSlotsForDateRange(
    doctorId: string,
    startDate: string,
    endDate: string,
    timeSlots: Array<{
      start: string;
      duration: number;
    }>,
    excludeWeekends: boolean = false
  ): Promise<ISchedule> {
    if (!doctorId || !startDate || !endDate || !timeSlots.length) {
      throw new AppError("All parameters are required");
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new AppError("Invalid date format");
    }

    if (end.isBefore(start)) {
      throw new AppError("End date must be after start date");
    }

    const updates: BulkUpdateSlotsRequest["updates"] = [];
    let currentDate = start;

    while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
      if (
        excludeWeekends &&
        (currentDate.day() === 0 || currentDate.day() === 6)
      ) {
        currentDate = currentDate.add(1, "day");
        continue;
      }

      const slots = timeSlots.map((timeSlot) => {
        const [hours, minutes] = timeSlot.start.split(":").map(Number);
        const startTime = currentDate.hour(hours).minute(minutes);
        const endTime = startTime.add(timeSlot.duration, "minute");

        return {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isBooked: false,
        };
      });

      updates.push({
        date: currentDate.format("YYYY-MM-DD"),
        slots,
      });

      currentDate = currentDate.add(1, "day");
    }

    return await this.bulkUpdateSlots({ doctorId, updates });
  }
}

export default ScheduleService;
