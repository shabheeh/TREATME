import { api } from "../../utils/axiosInterceptor";
import { store } from "../../redux/app/store";
import { signIn } from "../../redux/features/auth/authSlice";

class AuthServiceAdmin {
  async signIn(email: string, password: string): Promise<void> {
    try {
      const response = await api.admin.post("/auth/signin", {
        email,
        password,
      });

      const { admin, accessToken } = response.data;

      store.dispatch(
        signIn({
          email: admin.email,
          role: "admin",
          token: accessToken,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`error admin signin: ${error.message}`);
        throw new Error(error.message);
      }

      console.error(`Unknown error occurred during otp verification`, error);
      throw new Error(`Something went error`);
    }
  }
}

const authServiceAdmin = new AuthServiceAdmin();

export default authServiceAdmin;
