import { IApplicant } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";


interface UrlQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface ResponseData {
    applicants: IApplicant[] | [];
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}

class ApplicantService {

    async createApplicant(applicant: IApplicant): Promise<{message: string}> {
        try {
            const response = await api.doctor.post('/applicants', { applicant })

            return response.data;

        } catch (error: unknown) {
        
            if (error instanceof Error) {
              console.error(`error creating applicant: ${error.message}`, error);
              throw new Error(`Error Sending application ${ error.message}`)
            }
        
            console.error(`Unknown creating applicant`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async getApplicants({ page, limit, search }: UrlQuery): Promise<ResponseData> {
        try {
            const response = await api.doctor.get(`/applicants?page=${page}&limit=${limit}&search=${search}`)

            const { result } = response.data

            console.log('resykttt',result)

            return result

        } catch (error: unknown) {
        
            if (error instanceof Error) {
              console.error(`Error creating applicant: ${error.message}`, error);
              throw new Error(`Error Sending application ${ error.message}`)
            }
        
            console.error(`Unknown creating applicant`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const applicantService = new ApplicantService()

export default applicantService;