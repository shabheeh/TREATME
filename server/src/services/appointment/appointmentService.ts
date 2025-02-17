
import IScheduleRepository from "src/repositories/doctor/interfaces/IScheduleRepository";
import logger from "../../configs/logger";
import IAppointment, { IAppointmentPopulated, IAppointmentService } from "../../interfaces/IAppointment";
import IAppointmentRepository from "../../repositories/appointment/interfaces/IAppointmentService";
import { AppError } from "../../utils/errors";
import { generateBookingConfirmationHtml } from "../../helpers/bookingConfirmationHtml";
import { extractDate, extractTime } from "../../utils/dateUtils";
import { sendEmail } from "../../utils/mailer";



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

    async getAppointmentById(id: string): Promise<Partial<IAppointmentPopulated>> {
        const appointment = await this.appointmentRepo.getAppointmentById(id);
        return appointment;
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {


            if (updateData.doctor && updateData.slotId && updateData.dayId) {
                const existingAppointment = await this.appointmentRepo.getAppointmentById(id)
                if(existingAppointment.dayId && existingAppointment.slotId) {
                    await this.scheduleRepo.updateBookingStatus(updateData.doctor, existingAppointment.dayId, existingAppointment.slotId);
                }
                await this.scheduleRepo.updateBookingStatus(updateData.doctor,  updateData.dayId, updateData.slotId);
            }

            const appointment = await this.appointmentRepo.updateAppointment(id, updateData);

            if (appointment.status === 'confirmed') {
                const appointmentData = await this.getAppointmentById(id)
                if (appointmentData && appointmentData.doctor && appointmentData.patient && appointmentData.date) {
                    const doctor = appointmentData.doctor?.firstName + appointmentData.doctor?.lastName;
                    const patient = appointmentData.patient.firstName + appointmentData.patient.lastName;
                    const date = extractDate(appointmentData.date)
                    const time = extractTime(appointmentData.date)
                    const html = generateBookingConfirmationHtml(doctor, patient, date, time)
                    await sendEmail(appointmentData.patient.email, 'Booking Confirmation', undefined, html)
                }
            } else if (appointment.status === 'cancelled') {
                const appointmentData = await this.getAppointmentById(id)
                if (appointmentData && appointmentData.doctor && appointmentData.dayId && appointmentData.slotId) {
                    await this.scheduleRepo.updateBookingStatus(appointmentData.doctor._id, appointmentData.dayId, appointmentData.slotId)
                }
            }

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