import { api } from "../../utils/axiosInterceptor";
import { IUser } from "../../types/user/authTypes";
import TokenManager from "../../utils/TokenMangager";
import log from 'loglevel'
import { store } from "../../redux/app/store";
import { signIn } from "../../redux/features/user/authSlice";

type SignInResult = { user: IUser } | { error: string };
type SignOutResult = void | { error: string }
type MockSignUpResult = { message: string } | { error: string}
export type googleSignInResult = { isPartialUser: boolean, user: IUser | Partial<IUser> } | { error: string }

interface IAuthServiceUser {
    mockSignUpUser(credentials: { email: string, password: string }): Promise<MockSignUpResult>
    signInUser(credentials: { email: string; password: string }): Promise<SignInResult>;
    signOutUser(): Promise<SignOutResult>;
}

class AuthServiceUser implements IAuthServiceUser {
  private tokenManager: TokenManager;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  async mockSignUpUser(credentials: { email: string; password: string; }): Promise<MockSignUpResult> {
      try {
        const response = await api.user.post('/auth/send-otp/', credentials)
        const { message } = response.data;
        return message
        
    } catch (error: unknown) {

        if (error instanceof Error) {
          log.error(`SignInUser failed: ${error.message}`, error);
    
          return { error: error.message };
        }
    
        log.error(`Unknown error occurred during sign-in`, error);
        return { error: "An unknown error occurred" };
      }
  }

  async verifyEmail(email: string, otp: string) {
    try {
      await api.user.post("/auth/forgot-password/verify-otp")
      
    } catch (error) {
      
    }
  }


  async signInUser(credentials: { email: string; password: string }): Promise<SignInResult> {
    try {

      const response = await api.user.post("/auth/signin", credentials);

      const { accessToken, user } = response.data;

      this.tokenManager.setToken("user", accessToken);

      store.dispatch(signIn({
        user,
        isAuthenticated: true
      }))

      return user;

    } catch (error: unknown) {

        if (error instanceof Error) {
          log.error(`SignInUser failed: ${error.message}`, error);
    
          return { error: error.message };
        }
    
        log.error(`Unknown error occurred during sign-in`, error);
        return { error: "An unknown error occurred" };
      }
    }


  async signOutUser(): Promise<SignOutResult> {
    try {

      await api.user.post("/auth/signout");

      this.tokenManager.clearToken("user");

      window.location.href = "/user/signin";

    } catch (error: unknown) {

        if (error instanceof Error) {

          log.error(`SignInUser failed: ${error.message}`, error);
    
          return { error: error.message };
        }

        log.error(`Unknown error occurred during sign-in`, error);
        return { error: "An unknown error occurred" };
      }
    }

    async googleSignIn(): Promise<googleSignInResult> {
      try {
        const response = await api.user.get('/auth/google')

        if(response.data.partialUser) {
          return {
            isPartialUser: true,
            user: response.data.partialUser
          }
        }

        const { accessToken, googleUser } = response.data;

        this.tokenManager.setToken("user", accessToken);

        store.dispatch(signIn({
          user: googleUser,
          isAuthenticated: true
        }))

          return {
            isPartialUser: false,
            user: response.data.googleUser
          }


        } catch (error: unknown) {

          if (error instanceof Error) {
  
            log.error(`google sign in failed: ${error.message}`, error);
      
            return { error: error.message };
          }
  
          log.error(`Unknown error occurred during google sign-in`, error);
          return { error: "An unknown error occurred" };
        }
      }

      async verifyEmail (email: string) {
        try {
          await api.user.post('/auth/forgot-password/verify-email', email);

        } catch (error: unknown) {

          if (error instanceof Error) {
  
            log.error(`Error when otp sending: ${error.message}`, error);
      
            return { error: error.message };
          }
  
          log.error(`Unknown error occurred during sending otp`, error);
          return { error: "An unknown error occurred" };
        }
      }


}

const tokenManager = new TokenManager()
const authServiceUser = new AuthServiceUser(tokenManager)

export default authServiceUser;
