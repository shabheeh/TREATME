import log from "loglevel";
import { api } from "../../utils/axiosInterceptor";
import { store } from "../../redux/app/store";
import { setPatient } from "../../redux/features/user/userSlice";



class AcccountService {



    async updateProfile(patientData: FormData): Promise<void> {
        try {

            const response = await api.patient.put('/profile', patientData);

            const { patient } = response.data;


            store.dispatch(setPatient(patient))



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