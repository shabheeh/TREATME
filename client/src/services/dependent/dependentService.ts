
import { store } from "../../redux/app/store";
import { setCurrentPatient } from "../../redux/features/user/userSlice";
import { IDependent } from "../../types/patient/patient.types";
import { api } from "../../utils/axiosInterceptor";



class DependentService {


    async addDependent(dependentData: FormData): Promise<void> {
        try {
            await api.patient.post(`/dependents`, dependentData);

            // const { dependent } = response.data;

            // store.dispatch(addDependent(dependent))

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

    async deleteDependent(dependentId: string): Promise<void> {
        try {

            await api.patient.delete(`/dependents/${dependentId}`);

        } catch (error: unknown) {
    
            if (error instanceof Error) {
                console.error(`failed delete dependent: ${error.message}`, error);
        
                throw new Error(error.message)
            }
        
            console.error(`Unknown error occurred during sign-in`, error);
            throw new Error("An unknown error occurred" )
        }
    }

    async updateProfile(id: string, patientData: FormData): Promise<void> {
            try {
    
                const response = await api.patient.put(`/dependents/${id}`, patientData);
    
                const { dependent } = response.data;
                
                store.dispatch(setCurrentPatient(dependent))
    
            } catch (error: unknown) {
    
                if (error instanceof Error) {
                console.error(`Update dependent failed: ${error.message}`, error);
            
                throw new Error(error.message)
                }
        
            console.error(`Unknown error occurred during sign-in`, error);
            throw new Error("An unknown error occurred" );
    
            }
        }


}

const dependentService = new DependentService();
export default dependentService;