
import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import IAppointment, { IAppointmentService } from "../../interfaces/IAppointment";
import IAppointmentRepository from "../../repositories/appointment/interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";
import { ObjectId } from "mongoose";



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

    async updateAppointment(id: string, updateData: Partial<IAppointment>, dayId?: ObjectId, slotId?: ObjectId): Promise<Partial<IAppointment>> {
        try {
            

            if (updateData.doctor && slotId && dayId) {
                await this.scheduleRepo.updateBookingStatus(updateData.doctor, dayId, slotId);
            }

            const appointment = await this.appointmentRepo.updateAppointment(id, updateData);
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

    async getAppointmentsByUserId(id: string, role: string): Promise<IAppointment[]> {
        try {
            let appointments: IAppointment[] = []

            if (role === 'patient') {
                appointments = await this.appointmentRepo.getAppointmentsByPatientId(id)
            } else if (role === 'doctor') {
                appointments = await this.appointmentRepo.getAppointmentsByDoctorId(id)
            }

            return appointments;

        } catch (error) {
            logger.error(`Error getting appointments with ${role} id`, error);
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }

    async getAppointments(): Promise<IAppointment[]> {
        try {
            const appointments = await this.appointmentRepo.getAppointments();

            return appointments;
        } catch (error) {
            logger.error(`Error getting appointments for admin`, error);
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