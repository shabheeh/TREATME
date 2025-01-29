
import { IDoctor } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

interface UrlQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface ResponseData {
    doctors: IDoctor[] | [];
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}


class DoctorsService {


    
    async addDoctor(doctor: FormData): Promise<void> {
        try {
            
            await api.admin.post('/doctors', doctor)


        } catch (error: unknown) {
        
            if (error instanceof Error) {
              console.error(`error creating Doctor: ${error.message}`, error);
              throw new Error(error.message)
            }
        
            console.error(`Unknown error `, error);
            throw new Error(`Something went error`)
            
        }
    }



    async getDoctors({ page, limit, search }: UrlQuery): Promise<ResponseData> {
        try {
            const response = await api.admin.get(`/doctors?page=${page}&limit=${limit}&search=${search}`);

            const { result } = response.data;

            return result

        } catch (error: unknown) {
        
            if (error instanceof Error) {
              console.error(`error fetching patients data: ${error.message}`, error);
              throw new Error(error.message)
            }
        
            console.error(`Unknown error durin fetching patents list`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const doctorsService = new DoctorsService()

export default doctorsService