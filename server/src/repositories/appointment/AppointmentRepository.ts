import { Model } from "mongoose";
import IAppointment from "../../interfaces/IAppointment";
import IAppointmentRepository from "./interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";

class AppointmentRepository implements IAppointmentRepository {

    private readonly model: Model<IAppointment>

    constructor(model: Model<IAppointment>) {
        this.model = model
    }

    async createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {

            

            const appointment = await this.model.create(appointmentData);

            if (!appointment) {
                throw new AppError('Something went wrong')
            }

            return appointment

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getAppointmentById(id: string): Promise<Partial<IAppointment>> {
        try {
            const appointment = await this.model.findById(id)
            .populate({
                path: 'specialization',
                select: 'name'
            })
            .populate({
                path: 'patientId',
                select: 'firstName lastName profilePicture'
            })
            .populate({
                path: 'doctorId',
                select: 'firstName lastName profilePicture'
            })

            if (!appointment) {
                throw new AppError('Somethig went Wrong')
            }
            return appointment
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {


            const appointment = await this.model.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { new: true }
            )

            if (!appointment) {
                throw new AppError('Something went wrong')
            }
            return appointment;

        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
}

export default AppointmentRepository