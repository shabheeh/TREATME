
import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import IAppointment, { IAppointmentService } from "../../interfaces/IAppointment";
import IAppointmentRepository from "../../repositories/appointment/interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";



class AppointmentService implements IAppointmentService {

    private appointmentRepo: IAppointmentRepository;
    private  scheduleRepo: IScheduleRepository;

    constructor(
        appointmentRepo: IAppointmentRepository,
        scheduleRepo: IScheduleRepository
    ) {
        this.appointmentRepo = appointmentRepo;
        this.scheduleRepo = scheduleRepo;
    }

    async createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        const appointment = await this.appointmentRepo.createAppointment(appointmentData);
        return appointment;
    }

    async getAppointmentById(id: string): Promise<Partial<IAppointment>> {
        const appointment = await this.appointmentRepo.getAppointmentById(id);
        return appointment;
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {
            
            const { dayId, slotId, ...updateFields } = updateData;

            if (updateFields.doctorId && slotId && dayId) {
                await this.scheduleRepo.updateBookingStatus(updateFields.doctorId, dayId, slotId);
            }

            const appointment = await this.appointmentRepo.updateAppointment(id, updateFields);
            return appointment;

        } catch (error) {
            logger.error('Error updating appointment', error);
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