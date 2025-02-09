import { IDoctor, ISchedule } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";


export interface getDoctorsQuery {
    specialization: string,
    gender: 'male' | 'female' | 'all';
    language: string;
    selectedDate: Date;
    page: string
}


export interface IDoctorWithSchedule extends IDoctor {
    availability: ISchedule,
}

export interface getDoctorsResult {
    doctors: IDoctorWithSchedule[]
    currentPage: number;
    totalPages: number;
}

class AppointmentService {

    async getDoctors({specialization, gender, selectedDate, page, language}: getDoctorsQuery): Promise<getDoctorsResult> {
        try {
            const response = await api.patient.get(`/doctors?spec=${specialization}&gen=${gender}&page=${page}&date=${selectedDate}&lan=${language}`)

            const { result } = response.data
            return result;
        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error updating schedule: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const appointmentService = new AppointmentService()
export default appointmentService;
