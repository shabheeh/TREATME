
import { IPatient } from "../../types/patient/patient.types";
import { api } from "../../utils/axiosInterceptor";


interface UrlQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface ResponseData {
    patients: IPatient[] | [];
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
        
            if (error instanceof Error) {
              console.error(`error fetching patients data: ${error.message}`, error);
              throw new Error(error.message)
            }
        
            console.error(`Unknown error durin fetching patents list`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async toggleIsActive(id: string, isActive: boolean) {
        try {
            await api.admin.patch(`/patients/${ id }`, { isActive });

        } catch (error: unknown) {
        
            if (error instanceof Error) {
              console.error(`error block or unblock patient: ${error.message}`, error);
              throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
}


const patientsService = new PatientsService()

export default patientsService