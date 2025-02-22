import { api } from "../../utils/axiosInterceptor";
import TokenManager from "../../utils/TokenMangager";
import { store } from "../../redux/app/store";
import { signIn } from "../../redux/features/auth/authSlice";

class AuthServiceAdmin {
  private tokenManager: TokenManager;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const response = await api.admin.post("/auth/signin", {
        email,
        password,
      });

      const { admin, accessToken } = response.data;

      this.tokenManager.setToken(accessToken);

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

const tokenManager = new TokenManager();
const authServiceAdmin = new AuthServiceAdmin(tokenManager);

export default authServiceAdmin;
