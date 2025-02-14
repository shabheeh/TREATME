import { Model, ObjectId } from "mongoose";
import IScheduleRepository from "./interfaces/IScheduleRepository";
import { ISchedule } from "../../interfaces/IDoctor";
import { AppError } from "../../utils/errors";

class ScheduleRepository implements IScheduleRepository {

    private readonly model: Model<ISchedule>

    constructor(model: Model<ISchedule>) {
        this.model = model
    }

    async findSchedule(doctorId: string): Promise<ISchedule | null> {
        try {
            const schedule = await this.model.findOne({ doctorId })

            return schedule

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateSchedule(doctorId: string, updateData: Partial<ISchedule>): Promise<ISchedule> {
        try {


            const updatedSchedule = await this.model.findOneAndUpdate(
                { doctorId },
                { $set: updateData },
                { new: true, upsert: true }
            ) 

            if (!updatedSchedule) {
                throw new AppError('Something went wrong')
            }

            return updatedSchedule

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateBookingStatus(doctorId: ObjectId, dayId: ObjectId, slotId: ObjectId): Promise<void> {
        try {

            const document = await this.model.findOne(
                {
                    doctorId: doctorId,
                    'availability._id': dayId,
                    'availability.slots._id': slotId
                },
                { 'availability.$.slots.$': 1 }
            );
    
            if (!document) {
                throw new AppError('No matching document found to update');
            }
    
            const slotIndex = document.availability[0].slots.findIndex(slot => slot._id === slotId);

            if (slotIndex === -1) {
              throw new AppError('Slot not found');
            }
        
            const currentIsBooked = document.availability[0].slots[slotIndex].isBooked;
    
            if (currentIsBooked === undefined) {
                throw new AppError('Slot not found');
            }

            const updateResult = await this.model.updateOne(
                {
                    doctorId: doctorId,
                    'availability._id': dayId,
                    'availability.slots._id': slotId
                },
                {
                    $set: { 'availability.$.slots.$[slot].isBooked': !currentIsBooked }
                },
                {
                    arrayFilters: [
                        { 'slot._id': slotId }
                    ]
                }
            );
    
            if (updateResult.matchedCount === 0) {
                throw new AppError('No matching document found to update');
            }
    
            console.log('Slot updated successfully');
    
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
    
}


export default ScheduleRepository;