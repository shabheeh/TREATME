import { IApplicant } from "../../types/doctor/authTypes";
import { api } from "../../utils/axiosInterceptor";


class ApplicantService {

    async createApplicant(applicant: IApplicant): Promise<{message: string}> {
        try {
            const response = await api.doctor.post('/applicant', { applicant })

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
}

const applicantService = new ApplicantService()

export default applicantService;