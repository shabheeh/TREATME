import { api } from "../../utils/axiosInterceptor";
import { IUser } from "../../types/user/authTypes";
import TokenManager from "../../utils/TokenMangager";
import log from 'loglevel'
import { store } from "../../redux/app/store";
import { setAuthState, signIn } from "../../redux/features/user/authSlice";
import { setTempUser } from "../../redux/features/user/tempSlice";


type SignInResult = { user: IUser } | { error: string };
type SignOutResult = void | { error: string }
type MockSignUpResult = { status: number, message: string } | { error: string}
type GoogleSignInResult = { PartialUser: boolean } | { error: string }
type VerifyOtpSignUpResult = void | { error: string}
type verifyEmailResult = { user: IUser } | { error: string }
type verifyOtpForgotPasswordResult = { email: string } | { error: string }
// type completeProfileResult = { user: Partial<IUser>} | { error: string }


interface IAuthServiceUser {
    sendOtp(credentials: { email: string, password: string }): Promise<MockSignUpResult>
    signIn(credentials: { email: string; password: string }): Promise<SignInResult>;
    signOut(): Promise<SignOutResult>;
    verifyOtpSignUp(email: string, otp: string): Promise<VerifyOtpSignUpResult>
    googleSignIn(credential: string): Promise<GoogleSignInResult>
    verifyEmail(email: string): Promise<verifyEmailResult>
    verifyOtpForgotPassword(email: string, otp: string): Promise<verifyOtpForgotPasswordResult>
    resetPassword(id: string, password: string): Promise<void | { error: string}>;
    signUp(userData: Partial<IUser>): Promise<void | { error: string}>;
    completeProfile(userData: Partial<IUser>): Promise<void | { error: string}>;
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
        const { message, status } = response.data;
        return { message, status}
        
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

  async signUp(userData: Partial<IUser>): Promise<void | { error: string}> {
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


  async signIn(credentials: { email: string; password: string }): Promise<SignInResult> {
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


  async signOut(): Promise<SignOutResult> {
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

    async googleSignIn(credential: string): Promise<GoogleSignInResult> {
      try {
        const response = await api.user.post('/auth/google', { credential })

        const { user, accessToken, partialUser  } = response.data;

        this.tokenManager.setToken("user", accessToken);

        console.log(response.data)

        if(partialUser) {
          store.dispatch(setAuthState())
          store.dispatch(setTempUser({
            tempUser: user
          }))
          return partialUser
        }

        store.dispatch(signIn({
          user: user,
          isAuthenticated: true
        }))

        return partialUser


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

          console.log(email)

          const response = await api.user.post('/auth/forgot-password/verify-email', { email });
          
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


      async completeProfile(userData: Partial<IUser>): Promise<void | { error: string; }> {
        try {
          const response = api.user.post('/auth/complete-profile', { userData })

          const { user } = (await response).data

          store.dispatch(signIn({
            user: user,
            isAuthenticated: true
          }))

        } catch (error) {
          console.error(`Unknown error occurred during completing profile`, error);
          return { error: "An unknown error occurred" };
        }
      }

}

const tokenManager = new TokenManager()
const authServiceUser = new AuthServiceUser(tokenManager)

export default authServiceUser;
