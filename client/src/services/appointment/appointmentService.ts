import IAppointment, { IAppointmentPopulated } from "../../types/appointment/appointment.types";
import { api } from "../../utils/axiosInterceptor";



class AppointmentService {

    async getAppointment(id: string): Promise<Partial<IAppointmentPopulated>> {
        try {
            const response = await api.shared.get(`/appointments/:${id}`)

            const { appointment } = response.data;
            return appointment
        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error fetching appointment: ${error.message}`);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async createAppointment(appointmentData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {
            const response = await api.shared.post('/appointments', { appointmentData });
            const { appointment } = response.data;
            return appointment;

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error creating appointment: ${error.message}`);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<Partial<IAppointment>> {
        try {

            const response = await api.shared.put(`/appointments/${id}`, { updateData })
            const { appointment } = response.data;
            return appointment;

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error updating appointment: ${error.message}`);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
    
}

const appointmentService = new AppointmentService()
export default appointmentService;
