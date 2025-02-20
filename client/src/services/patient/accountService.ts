import log from "loglevel";
import { api } from "../../utils/axiosInterceptor";
import { store } from "../../redux/app/store";
import { setPatient } from "../../redux/features/user/userSlice";
import { IDependent, IPatient } from "../../types/patient/patient.types";
import {
  IBehaviouralHealth,
  IHealthHistory,
  ILifestyle
} from "../../types/patient/health.types";

export interface IHealthProfile {
  patient: IPatient | IDependent;
  healthHistory: IHealthHistory;
  behaviouralHealth: IBehaviouralHealth;
  lifestyle: ILifestyle;
}

class AcccountService {
  async updateProfile(patientData: FormData): Promise<void> {
    try {
      const response = await api.patient.put("/profile", patientData);

      const { patient } = response.data;

      store.dispatch(setPatient(patient));
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`Update profile failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async getHealthProfile(id: string): Promise<IHealthProfile> {
    try {
      const response = await api.patient.get(`/health/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`Update profile failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }
}

const accountService = new AcccountService();
export default accountService;
