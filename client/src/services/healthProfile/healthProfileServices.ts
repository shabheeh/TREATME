import {
  IBehaviouralHealth,
  IHealthHistory,
  ILifestyle,
} from "../../types/patient/health.types";
import { api } from "../../utils/axiosInterceptor";

class HealthProfileService {
  async getHealthHistory(id: string): Promise<IHealthHistory> {
    try {
      const response = await api.get(`/health-history/${id}`);

      const { healthHistory } = response.data;

      return healthHistory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to fetch health history: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async updateHealthHistory(
    patientId: string,
    field: keyof IHealthHistory,
    newValue: IHealthHistory[typeof field]
  ) {
    try {
      const response = await api.patch(`/health-history/${patientId}`, {
        [field]: newValue,
      });

      const { healthHistory } = response.data;

      return healthHistory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to update health history: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async getLifestyle(patientId: string): Promise<ILifestyle> {
    try {
      const response = await api.get(`/lifestyle/${patientId}`);
      const { lifestyle } = response.data;
      return lifestyle;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to get lifestyle: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async updateLifestyle(
    patientId: string,
    updateData: Partial<ILifestyle>
  ): Promise<ILifestyle> {
    try {
      const response = await api.patch(`/lifestyle/${patientId}`, updateData);

      const { lifestyle } = response.data;
      return lifestyle;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to update lifestyle: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async getBehaviouralHealth(patientId: string): Promise<IBehaviouralHealth> {
    try {
      const response = await api.get(`/behavioural-health/${patientId}`);
      const { behavioralHealth } = response.data;
      return behavioralHealth;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to get behavioural health: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async updateBehavioualHealth(
    patientId: string,
    updateData: Partial<IBehaviouralHealth>
  ): Promise<IBehaviouralHealth> {
    try {
      const response = await api.patch(`/behavioural-health/${patientId}`, {
        updateData,
      });

      const { behavioralHealth } = response.data;
      return behavioralHealth;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to update Behavioual health: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }
}

const healthProfileService = new HealthProfileService();
export default healthProfileService;
