import log from "loglevel";
import { IPatient } from "../../types/patient/patient.types";
import { api } from "../../utils/axiosInterceptor";



class AcccountService {



    async updateProfile(patientData: IPatient): Promise<IPatient> {
        try {

            const response = await api.patient.put('/profile', patientData);

            const { patient } = response.data;

            return patient;

        } catch (error: unknown) {

            if (error instanceof Error) {
            log.error(`Update profile failed: ${error.message}`, error);
        
            throw new Error(error.message)
            }
    
        log.error(`Unknown error occurred during sign-in`, error);
        throw new Error("An unknown error occurred" );

        }
    }
}

const accountService = new AcccountService();
export default accountService;