import { Model, ObjectId, Types } from 'mongoose';
import IScheduleRepository from './interfaces/IScheduleRepository';
import { ISchedule } from '../../interfaces/IDoctor';
import { AppError } from '../../utils/errors';

class ScheduleRepository implements IScheduleRepository {
  private readonly model: Model<ISchedule>;

  constructor(model: Model<ISchedule>) {
    this.model = model;
  }

  async findSchedule(doctorId: string): Promise<ISchedule | null> {
    try {
      const date = new Date();

      const schedule = await this.model.aggregate([
        {
          $match: {
            doctorId: new Types.ObjectId(doctorId),
            'availability.date': { $gte: date },
          },
        },
        {
          $project: {
            doctorId: 1,
            availability: {
              $filter: {
                input: '$availability',
                as: 'av',
                cond: { $gte: ['$$av.date', date] },
              },
            },
          },
        },
      ]);

      return schedule[0];
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
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
        throw new AppError('Something went wrong');
      }

      return updatedSchedule;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  async updateBookingStatus(
    doctorId: ObjectId,
    dayId: ObjectId,
    slotId: ObjectId
  ): Promise<void> {
    try {
      const document = await this.model.findOne({
        doctorId: doctorId,
        'availability._id': dayId,
        'availability.slots._id': slotId,
      });

      if (!document) {
        throw new AppError('Something went wrong');
      }

      const day = document.availability.find(
        (day) => day._id && day._id.toString() === dayId.toString()
      );

      if (!day) {
        throw new AppError('Day not found');
      }

      const slot = day.slots.find(
        (slot) => slot._id && slot._id.toString() === slotId.toString()
      );

      if (!slot) {
        throw new AppError('Something went wrong');
      }

      const currentIsBooked = slot.isBooked;
      if (currentIsBooked === true) {
        throw new AppError('Slot is Already Booked');
      }

      const updateResult = await this.model.updateOne(
        {
          doctorId: doctorId,
          'availability._id': dayId,
        },
        {
          $set: { 'availability.$[day].slots.$[slot].isBooked': true },
        },
        {
          arrayFilters: [{ 'day._id': dayId }, { 'slot._id': slotId }],
        }
      );

      if (updateResult.matchedCount === 0) {
        throw new AppError('Unknown error');
      }
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  async toggleBookingStatus(
    doctorId: ObjectId,
    dayId: ObjectId,
    slotId: ObjectId
  ): Promise<void> {
    try {
      const document = await this.model.findOne({
        doctorId: doctorId,
        'availability._id': dayId,
        'availability.slots._id': slotId,
      });

      if (!document) {
        throw new AppError('Something went wrong');
      }

      const day = document.availability.find(
        (day) => day._id && day._id.toString() === dayId.toString()
      );

      if (!day) {
        throw new AppError('Day not found');
      }

      const slot = day.slots.find(
        (slot) => slot._id && slot._id.toString() === slotId.toString()
      );

      if (!slot) {
        throw new AppError('Something went wrong');
      }

      const currentIsBooked = slot.isBooked;
      if (currentIsBooked === undefined) {
        throw new AppError('Someting went wrong');
      }

      const updateResult = await this.model.updateOne(
        {
          doctorId: doctorId,
          'availability._id': dayId,
        },
        {
          $set: {
            'availability.$[day].slots.$[slot].isBooked': !currentIsBooked,
          },
        },
        {
          arrayFilters: [{ 'day._id': dayId }, { 'slot._id': slotId }],
        }
      );

      if (updateResult.matchedCount === 0) {
        throw new AppError('Unknown error');
      }
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }
}

export default ScheduleRepository;
