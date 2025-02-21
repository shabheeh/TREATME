import { api } from "../../utils/axiosInterceptor";

class SharedService {
  async checkUserStatus() {
    try {
      const response = await api.get("/auth/status");

      return response.data.success;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error checking user status: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const sharedService = new SharedService();
export default sharedService;
