import IAppointment from "src/interfaces/IAppointment";

interface IAppointmentRepository {
    createAppointment(apointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    updateAppointment(id: string, appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>>
    
}


export default IAppointmentRepository;