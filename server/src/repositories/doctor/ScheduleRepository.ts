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
          console.log('called update');
  
        
          const updateResult = await this.model.updateOne(
              { 
                  doctorId: doctorId,
                  'availability._id': dayId,
                  'availability.slots._id': slotId 
              },
              { 
                  $set: { 'availability.$.slots.$[slot].isBooked': true } 
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