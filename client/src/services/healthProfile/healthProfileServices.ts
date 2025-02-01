import { IHealthHistory } from "../../types/patient/health.types";
import { api } from "../../utils/axiosInterceptor";

class HealthProfileService {

    async getHealthHistory(id: string): Promise<IHealthHistory> {
        try {
            const response = await api.shared.get(`/health-history/${id}`);
            
            const { healthHistory } = response.data;

            return healthHistory

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Failed to update health history: ${error.message}`, error);
                throw new Error(error.message)
            }

            console.error(`Unknown error occurred`, error);
            throw new Error("An unknown error occurred" )
    
        }
    }

    async updataHelathHistory(id: string,  updateData: Partial<IHealthHistory>): Promise<IHealthHistory> {
        try {
            const response = await api.shared.put(`/health-history/${id}`, { updateData });

            const { healthHistroy } = response.data;

            return healthHistroy;

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Failed to update health history: ${error.message}`, error);
                throw new Error(error.message)
            }

            console.error(`Unknown error occurred`, error);
            throw new Error("An unknown error occurred" )
    
        }
    }
}

const healthProfileService = new HealthProfileService();
export default healthProfileService;