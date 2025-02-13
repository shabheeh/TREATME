
import IAppointment from "src/interfaces/IAppointment";

interface IAppointmentRepository {
    createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    getAppointmentById(id: string): Promise<Partial<IAppointment>>;
    updateAppointment(id: string, appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]>
    getAppointmentsByDoctorId(doctorId: string): Promise<IAppointment[]>
    getAppointments(): Promise<IAppointment[]>
}


export default IAppointmentRepository;