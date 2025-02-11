import IAppointment from "src/interfaces/IAppointment";

interface IAppointmentRepository {
    createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    getAppointmentById(id: string): Promise<Partial<IAppointment>>;
    updateAppointment(id: string, appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    
}


export default IAppointmentRepository;