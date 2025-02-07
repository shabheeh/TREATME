import { Model } from "mongoose";
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
}


export default ScheduleRepository;