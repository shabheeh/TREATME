import { ISpecialization } from "../../types/specialization/specialization.types";
import { api } from "../../utils/axiosInterceptor";

class SpecializationService {
  async addSepcialization(specialization: FormData): Promise<void> {
    try {
      await api.post("/specializations", specialization);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error Adding Specialization: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getSpecializations(): Promise<ISpecialization[]> {
    try {
      const response = await api.get("/specializations");

      const { specializations } = response.data;

      return specializations;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error Fetching Specializations: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getSpecializationsPublic(): Promise<ISpecialization[]> {
    try {
      const response = await api.get("/specializations/public");

      const { specializations } = response.data;

      return specializations;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error Fetching Specializations: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async getSpecializationById(id: string): Promise<ISpecialization> {
    try {
      const response = await api.get(`/specializations/${id}`);

      const { specialization } = response.data;

      return specialization;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error Fetching Specialization: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async updateSpecialization(id: string, updateData: FormData): Promise<void> {
    try {
      const response = await api.put(`/specializations/${id}`, updateData);

      console.log(response.status);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error updating Specialization: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const specializationService = new SpecializationService();
export default specializationService;
