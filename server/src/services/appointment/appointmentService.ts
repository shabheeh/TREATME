import logger from "../../configs/logger";
import IAppointment, { IAppointmentService } from "../../interfaces/IAppointment";
import IAppointmentRepository from "../../repositories/appointment/interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";


class AppointmentService implements IAppointmentService {

    private appointmentRepo: IAppointmentRepository;

    constructor(appointmentRepo: IAppointmentRepository) {
        this.appointmentRepo = appointmentRepo
    }

    async createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {
            const appointment = await this.appointmentRepo.createAppointment(appointmentData);

            return appointment;

        } catch (error) {
            logger.error('error creating appointment', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {
            const appointment = await this.appointmentRepo.updateAppointment(id, updateData)

            return appointment;
        } catch (error) {
            logger.error('error updating appointment', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
}

export default AppointmentService;