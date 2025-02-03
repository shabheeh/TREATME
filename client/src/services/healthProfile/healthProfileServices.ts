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
                console.error(`Failed to fetch health history: ${error.message}`, error);
                throw new Error(error.message)
            }

            console.error(`Unknown error occurred`, error);
            throw new Error("An unknown error occurred" )
    
        }
    }

    async updateHealthHistory(
        patientId: string,
        field: keyof IHealthHistory,
        newValue: IHealthHistory[typeof field] 
      ) {
        try {
          const response = await api.shared.patch(`/health-history/${patientId}`, {
            [field]: newValue
          });

          const { healthHistory } = response.data;

          console.log(healthHistory, 'serv')

          return healthHistory;
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