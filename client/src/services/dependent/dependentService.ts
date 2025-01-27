import { store } from "../../redux/app/store";
import { addDependent } from "../../redux/features/user/userSlice";
import { IDependent } from "../../types/patient/patient.types";
import { api } from "../../utils/axiosInterceptor";



class DependentService {


    async addDependent(dependentData: FormData): Promise<void> {
        try {
            const response = await api.patient.post(`/dependents`, dependentData);

            const { dependent } = response.data;

            store.dispatch(addDependent(dependent))

        } catch (error: unknown) {
    
            if (error instanceof Error) {
                console.error(`failed to add dependent: ${error.message}`, error);
        
                throw new Error(error.message)
            }
        
            console.error(`Unknown error occurred during sign-in`, error);
            throw new Error("An unknown error occurred" )
    
        }
    }

    async getDependents(id: string): Promise<IDependent[] | []> {
        try {
            const response = await api.patient.get(`/dependents/${id}`);

            const { dependents } = response.data;

            return dependents
        } catch (error: unknown) {
    
            if (error instanceof Error) {
                console.error(`failed fetch dependents: ${error.message}`, error);
        
                throw new Error(error.message)
            }
        
            console.error(`Unknown error occurred during sign-in`, error);
            throw new Error("An unknown error occurred" )
    
        }
    }
}

const dependentService = new DependentService();
export default dependentService;