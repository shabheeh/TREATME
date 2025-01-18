import { AxiosError } from "axios";
import { IUser } from "../../types/user/authTypes";
import { api } from "../../utils/axiosInterceptor";


interface UrlQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface ResponseData {
    users: IUser[] | [];
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}


class PatientsService {


    async getPatients({ page, limit, search }: UrlQuery): Promise<ResponseData> {
        try {
            const response = await api.admin.get(`/patients?page=${page}&limit=${limit}&search=${search}`)

            const { result } = response.data;

            return result;

        } catch (error: unknown) {
        
            if (error instanceof AxiosError) {
              console.error(`error fetching patients data: ${error.message}`, error);
              throw new Error(`Error fetching patients data ${ error.message}`)
            }
        
            console.error(`Unknown error durin fetching patents list`, error);
            throw new Error(`Something went error`)
            
        }
    }    
}


const patientsService = new PatientsService()

export default patientsService