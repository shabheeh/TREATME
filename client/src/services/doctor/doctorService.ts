import { getDoctorsWithSchedulesResult, getDoctorWithScheduleQuery } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";


class DoctorService {

    async getDoctorsWithSchedules({specialization, gender, selectedDate, page, language}: getDoctorWithScheduleQuery): Promise<getDoctorsWithSchedulesResult> {
        try {
            const response = await api.doctor.get(`/doctors?spec=${specialization}&gen=${gender}&page=${page}&date=${selectedDate}&lan=${language}`)

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

const doctorService = new DoctorService;
export default doctorService;