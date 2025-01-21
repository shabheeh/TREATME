
import { ISpecialization } from "../../types/specialization/specialization.types";
import { api } from "../../utils/axiosInterceptor";



class SpecializationService {

    async addSepcialization(specialization: FormData): Promise<void> {
        try {

            await api.admin.post('/specializations', specialization);

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error Adding Specialization: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }

    async getSpecializations(): Promise<ISpecialization[]> {
        try {

            const response = await api.admin.get('/specializations');

            const { specializations } = response.data

            return specializations

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error Fetching Specialization: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const specializationService = new SpecializationService()
export default specializationService