import { api } from "../../utils/axiosInterceptor";
import { IUser } from "../../types/user/authTypes";
import TokenManager from "../../utils/TokenMangager";
import log from 'loglevel'
import { store } from "../../redux/app/store";
import { signIn } from "../../redux/features/user/authSlice";
import { setTempUser } from "../../redux/features/user/tempSlice";

type SignInResult = { user: IUser } | { error: string };
type SignOutResult = void | { error: string }
type MockSignUpResult = { message: string } | { error: string}
type GoogleSignInResult = { isPartialUser: boolean, user: IUser | Partial<IUser> } | { error: string }
type VerifyOtpSignUpResult = void | { error: string}
type verifyEmailResult = { user: IUser } | { error: string }
type verifyOtpForgotPasswordResult = { email: string } | { error: string }
// type resetPasswordResult = {}


interface IAuthServiceUser {
    sendOtp(credentials: { email: string, password: string }): Promise<MockSignUpResult>
    signInUser(credentials: { email: string; password: string }): Promise<SignInResult>;
    signOutUser(): Promise<SignOutResult>;
    verifyOtpSignUp(email: string, otp: string): Promise<VerifyOtpSignUpResult>
    googleSignIn(): Promise<GoogleSignInResult>
    verifyEmail(email: string): Promise<verifyEmailResult>
    verifyOtpForgotPassword(email: string, otp: string): Promise<verifyOtpForgotPasswordResult>
    resetPassword(id: string, password: string): Promise<void | { error: string}>;
    signUpUser(userData: Partial<IUser>): Promise<void | { error: string}>
}

class AuthServiceUser implements IAuthServiceUser {
  private tokenManager: TokenManager;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  async sendOtp(credentials: { email: string; password: string; }): Promise<MockSignUpResult> {
      try {
        const response = await api.user.post('/auth/send-otp/', credentials)
        const tempUser = {
          email: credentials.email
        }
        store.dispatch(setTempUser({ tempUser }))
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

  async verifyOtpSignUp(email: string, otp: string): Promise<VerifyOtpSignUpResult> {
    try {
      await api.user.post("/auth/verify-otp", { email, otp })

      const tempUser = {
        email
      }

      store.dispatch(setTempUser({tempUser}))

    } catch (error: unknown) {

      if (error instanceof Error) {
        log.error(`otp verification failed: ${error.message}`, error);
  
        return { error: error.message };
      }
  
      log.error(`Unknown error occurred during otp verification`, error);
      return { error: "An unknown error occurred" };
    }
  }

  async signUpUser(userData: Partial<IUser>): Promise<void | { error: string}> {
    try {
      await api.user.post('/auth/signup', userData)

    } catch (error: unknown) {

      if (error instanceof Error) {
        log.error(`error user signup: ${error.message}`, error);
  
        return { error: error.message };
      }
  
      log.error(`Unknown error occurred during otp verification`, error);
      return { error: "An unknown error occurred" };
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

    async googleSignIn(): Promise<GoogleSignInResult> {
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

      async verifyEmail (email: string): Promise<verifyEmailResult> {
        try {

          const response = await api.user.post('/auth/forgot-password/verify-email', email);
          
          store.dispatch(setTempUser({ tempUser: response.data.user }))

          return { user: response.data.user };
      
        } catch (error: unknown) {

          if (error instanceof Error) {
  
            log.error(`Error when otp sending: ${error.message}`, error);
      
            return { error: error.message };
          }
  
          log.error(`Unknown error occurred during sending otp`, error);
          return { error: "An unknown error occurred" };
        }
      }

      async verifyOtpForgotPassword(email: string, otp: string): Promise<verifyOtpForgotPasswordResult> {
        try {
          await api.user.post("/auth/forgot-password/verify-otp", { email, otp })
    
          return {
            email
          }
    
        } catch (error: unknown) {
    
          if (error instanceof Error) {
            log.error(`otp verification failed: ${error.message}`, error);
      
            return { error: error.message };
          }
      
          log.error(`Unknown error occurred during otp verification`, error);
          return { error: "An unknown error occurred" };
        }
      }

      async resetPassword(id: string, password: string): Promise<void | {error: string }> {
        try {
          await api.user.put('/auth/reset-password', {id, password})
        } catch (error) {
          if (error instanceof Error) {
            log.error(`otp verification failed: ${error.message}`, error);
      
            return { error: error.message };
          }
      
          log.error(`Unknown error occurred during otp verification`, error);
          return { error: "An unknown error occurred" };
        }
      }


}

const tokenManager = new TokenManager()
const authServiceUser = new AuthServiceUser(tokenManager)

export default authServiceUser;
