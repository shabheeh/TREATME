import { Model, Types } from "mongoose";
import IScheduleRepository from "./interfaces/IScheduleRepository";
import { ISchedule, IDaySchedule, ISlot } from "../../interfaces/ISchedule";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

@injectable()
class ScheduleRepository implements IScheduleRepository {
  private readonly model: Model<ISchedule>;

  constructor(@inject(TYPES.ScheduleModel) model: Model<ISchedule>) {
    this.model = model;
  }

  async findSchedule(doctorId: string): Promise<ISchedule | null> {
    try {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const schedule = await this.model.aggregate([
        {
          $match: {
            doctorId: new Types.ObjectId(doctorId),
          },
        },
        {
          $project: {
            doctorId: 1,
            availability: {
              $map: {
                input: {
                  $filter: {
                    input: "$availability",
                    as: "day",
                    cond: {
                      $gte: ["$$day.date", startOfToday],
                    },
                  },
                },
                as: "day",
                in: {
                  date: "$$day.date",
                  slots: {
                    $filter: {
                      input: "$$day.slots",
                      as: "slot",
                      cond: {
                        $gt: ["$$slot.endTime", now],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            doctorId: 1,
            availability: {
              $filter: {
                input: "$availability",
                as: "day",
                cond: { $gt: [{ $size: "$$day.slots" }, 0] },
              },
            },
          },
        },
      ]);

      return schedule[0] || null;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async updateSchedule(
    doctorId: string,
    updateData: Partial<ISchedule>
  ): Promise<ISchedule> {
    try {
      const updatedSchedule = await this.model.findOneAndUpdate(
        { doctorId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      if (!updatedSchedule) {
        throw new AppError("Something went wrong");
      }

      return updatedSchedule;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async addTimeSlot(
    doctorId: string,
    date: string,
    startTime: string,
    durationInMinutes: number = 30
  ): Promise<ISchedule> {
    try {
      const slotDate = dayjs.utc(date).startOf("day");
      const slotStartTime = dayjs.utc(startTime);
      const slotEndTime = slotStartTime.add(durationInMinutes, "minute");

      if (slotDate.isSame(dayjs(), "day") && slotStartTime.isBefore(dayjs())) {
        throw new AppError("Cannot set a slot time that has passed today");
      }

      const existingSchedule = await this.model.findOne({ doctorId });

      if (!existingSchedule) {
        const newSchedule: Partial<ISchedule> = {
          doctorId: new Types.ObjectId(doctorId),
          availability: [
            {
              date: slotDate.toDate(),
              slots: [
                {
                  startTime: slotStartTime.toDate(),
                  endTime: slotEndTime.toDate(),
                  isBooked: false,
                },
              ],
            },
          ],
        };

        return await this.updateSchedule(doctorId, newSchedule);
      }

      const dayIndex = existingSchedule.availability.findIndex((day) =>
        dayjs.utc(day.date).isSame(slotDate, "day")
      );

      const updatedAvailability = [...existingSchedule.availability];

      if (dayIndex === -1) {
        updatedAvailability.push({
          date: slotDate.toDate(),
          slots: [
            {
              startTime: slotStartTime.toDate(),
              endTime: slotEndTime.toDate(),
              isBooked: false,
            },
          ],
        } as IDaySchedule);
      } else {
        const existingDay = updatedAvailability[dayIndex];

        const isDuplicateStartTime = existingDay.slots.some((slot) =>
          dayjs.utc(slot.startTime).isSame(slotStartTime)
        );

        if (isDuplicateStartTime) {
          throw new AppError("A time slot with this start time already exists");
        }

        const isOverlapping = existingDay.slots.some((slot) => {
          const existingStart = dayjs.utc(slot.startTime);
          const existingEnd = dayjs.utc(slot.endTime);

          return (
            slotStartTime.isBefore(existingEnd) &&
            slotEndTime.isAfter(existingStart)
          );
        });

        if (isOverlapping) {
          throw new AppError("Time slot overlaps with an existing slot");
        }

        const newSlot = {
          startTime: slotStartTime.toDate(),
          endTime: slotEndTime.toDate(),
          isBooked: false,
        };

        updatedAvailability[dayIndex] = {
          ...existingDay,
          slots: [...existingDay.slots, newSlot].sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
          ),
        };
      }

      const scheduleDoc = await this.model.findOne({ doctorId });

      if (!scheduleDoc) {
        throw new AppError("Schedule not found");
      }

      scheduleDoc.availability = updatedAvailability;
      scheduleDoc.markModified("availability");
      await scheduleDoc.save();

      const schedule = await this.findSchedule(doctorId);
      if (!schedule) {
        throw new AppError("Schedule not found", 404);
      }
      return schedule;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async removeTimeSlot(
    doctorId: string,
    date: string,
    slotId: string
  ): Promise<ISchedule> {
    try {
      const targetDate = dayjs.utc(date).startOf("day");

      const scheduleDoc = await this.model.findOne({ doctorId });

      if (!scheduleDoc) {
        throw new AppError("No schedule found for this doctor");
      }

      const dayIndex = scheduleDoc.availability.findIndex((day) =>
        dayjs.utc(day.date).isSame(targetDate, "day")
      );

      if (dayIndex === -1) {
        throw new AppError("No availability found for the selected date");
      }

      const daySchedule = scheduleDoc.availability[dayIndex];

      const slotIndex = daySchedule.slots.findIndex(
        (slot) => slot._id?.toString() === slotId
      );

      if (slotIndex === -1) {
        throw new AppError("Time slot not found");
      }

      const slot = daySchedule.slots[slotIndex];

      if (slot.isBooked) {
        throw new AppError("Cannot remove a booked slot");
      }

      daySchedule.slots.splice(slotIndex, 1);

      if (daySchedule.slots.length === 0) {
        scheduleDoc.availability.splice(dayIndex, 1);
      }

      scheduleDoc.markModified("availability");
      await scheduleDoc.save();

      const schedule = await this.findSchedule(doctorId);
      if (!schedule) {
        throw new AppError("Something went wrong");
      }
      return schedule;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async updateBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void> {
    try {
      const document = await this.model.findOne({
        doctorId: new Types.ObjectId(doctorId),
        "availability._id": new Types.ObjectId(dayId),
        "availability.slots._id": new Types.ObjectId(slotId),
      });

      if (!document) {
        throw new AppError("Schedule not found");
      }

      const day = document.availability.find(
        (day) => day._id && day._id.toString() === dayId.toString()
      );

      if (!day) {
        throw new AppError("Day not found");
      }

      const slot = day.slots.find(
        (slot) => slot._id && slot._id.toString() === slotId.toString()
      );

      if (!slot) {
        throw new AppError("Slot not found");
      }

      if (slot.isBooked === true) {
        throw new AppError("Slot is already booked");
      }

      const updateResult = await this.model.updateOne(
        {
          doctorId: doctorId,
          "availability._id": dayId,
        },
        {
          $set: { "availability.$[day].slots.$[slot].isBooked": true },
        },
        {
          arrayFilters: [{ "day._id": dayId }, { "slot._id": slotId }],
        }
      );

      if (updateResult.matchedCount === 0) {
        throw new AppError("Failed to update booking status");
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async toggleBookingStatus(
    doctorId: string,
    dayId: string,
    slotId: string
  ): Promise<void> {
    try {
      const document = await this.model.findOne({
        doctorId: new Types.ObjectId(doctorId),
        "availability._id": new Types.ObjectId(dayId),
        "availability.slots._id": new Types.ObjectId(slotId),
      });

      if (!document) {
        throw new AppError("Schedule not found");
      }

      const day = document.availability.find(
        (day) => day._id && day._id.toString() === dayId.toString()
      );

      if (!day) {
        throw new AppError("Day not found");
      }

      const slot = day.slots.find(
        (slot) => slot._id && slot._id.toString() === slotId.toString()
      );

      if (!slot) {
        throw new AppError("Slot not found");
      }

      if (slot.isBooked === undefined) {
        throw new AppError("Current booking status couldn't be retrieved");
      }

      const updateResult = await this.model.updateOne(
        {
          doctorId: doctorId,
          "availability._id": dayId,
        },
        {
          $set: {
            "availability.$[day].slots.$[slot].isBooked": !slot.isBooked,
          },
        },
        {
          arrayFilters: [{ "day._id": dayId }, { "slot._id": slotId }],
        }
      );

      if (updateResult.matchedCount === 0) {
        throw new AppError("Failed to toggle booking status");
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<ISlot[]> {
    try {
      const targetDate = dayjs(date).startOf("day");

      const schedule = await this.model.findOne({ doctorId });

      if (!schedule) {
        return [];
      }

      const day = schedule.availability.find((day) =>
        dayjs(day.date).isSame(targetDate, "day")
      );

      if (!day) {
        return [];
      }

      return day.slots.filter((slot) => !slot.isBooked);
    } catch (error) {
      handleTryCatchError("Database", error);
      return [];
    }
  }

  async bulkUpdateSlots(
    doctorId: string,
    updates: Array<{
      date: string;
      slots: Array<{
        startTime: string;
        endTime: string;
        isBooked: boolean;
      }>;
    }>
  ): Promise<ISchedule> {
    try {
      const existingSchedule = await this.model.findOne({ doctorId });
      const updatedAvailability: IDaySchedule[] =
        existingSchedule?.availability || [];

      for (const update of updates) {
        const targetDate = dayjs.utc(update.date).startOf("day");
        const dayIndex = updatedAvailability.findIndex((day) =>
          dayjs.utc(day.date).isSame(targetDate, "day")
        );

        const formattedNewSlots = update.slots
          .map((slot) => ({
            startTime: dayjs.utc(slot.startTime).toDate(),
            endTime: dayjs.utc(slot.endTime).toDate(),
            isBooked: slot.isBooked,
          }))
          .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)));

        if (dayIndex === -1) {
          updatedAvailability.push({
            date: targetDate.toDate(),
            slots: formattedNewSlots,
          });
        } else {
          const existingDay = updatedAvailability[dayIndex];
          const existingSlotsDayjs = existingDay.slots.map((slot) => ({
            ...slot,
            startTime: dayjs.utc(slot.startTime),
            endTime: dayjs.utc(slot.endTime),
          }));

          const mergedSlots = [...existingDay.slots];

          for (const newSlot of formattedNewSlots) {
            const newStart = dayjs.utc(newSlot.startTime);
            const newEnd = dayjs.utc(newSlot.endTime);

            const isOverlapping = existingSlotsDayjs.some(
              (existing) =>
                newStart.isBefore(existing.endTime) &&
                newEnd.isAfter(existing.startTime)
            );

            if (!isOverlapping) {
              mergedSlots.push(newSlot);
            }
          }

          mergedSlots.sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
          );

          updatedAvailability[dayIndex] = {
            ...existingDay,
            slots: mergedSlots,
          };
        }
      }

      updatedAvailability.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      return await this.updateSchedule(doctorId, {
        availability: updatedAvailability,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }
}

export default ScheduleRepository;
