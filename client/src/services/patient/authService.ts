import { api } from "../../utils/axiosInterceptor";
// import {  } from "../../types/auth/auth.types";
import { IPatient } from "../../types/patient/patient.types";
import log from "loglevel";
import { store } from "../../redux/app/store";
import { signIn, signOut } from "../../redux/features/auth/authSlice";
import { setTempUser } from "../../redux/features/auth/tempSlice";
import {
  clearUser,
  setCurrentPatient,
  setPatient,
} from "../../redux/features/user/userSlice";

type SignInResult = { patient: IPatient };
type MockSignUpResult = { status: number; message: string };
type GoogleSignInResult = { PartialUser: boolean };
type VerifyOtpSignUpResult = void;
type verifyEmailResult = { patient: IPatient };
type verifyOtpForgotPasswordResult = { email: string };

interface IAuthServicePatient {
  sendOtp(credentials: {
    email: string;
    password: string;
  }): Promise<MockSignUpResult>;
  signIn(credentials: {
    email: string;
    password: string;
  }): Promise<SignInResult>;
  signOut(): Promise<void>;
  verifyOtpSignUp(email: string, otp: string): Promise<VerifyOtpSignUpResult>;
  googleSignIn(credential: string): Promise<GoogleSignInResult>;
  verifyEmail(email: string): Promise<verifyEmailResult>;
  verifyOtpForgotPassword(
    email: string,
    otp: string
  ): Promise<verifyOtpForgotPasswordResult>;
  resetPassword(id: string, password: string): Promise<void>;
  signUp(patientData: Partial<IPatient>): Promise<void>;
  completeProfile(patientData: Partial<IPatient>): Promise<void>;
  resendOtpForgotPassword(email: string): Promise<void>;
}

class AuthServicePatient implements IAuthServicePatient {
  async sendOtp(credentials: {
    email: string;
    password: string;
  }): Promise<MockSignUpResult> {
    try {
      const response = await api.patient.post("/auth/send-otp/", credentials);
      const tempUser = {
        email: credentials.email,
      };

      store.dispatch(setTempUser({ tempUser }));
      const { message, status } = response.data;
      return { message, status };
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`SignInUser failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async verifyOtpSignUp(
    email: string,
    otp: string
  ): Promise<VerifyOtpSignUpResult> {
    try {
      await api.patient.post("/auth/verify-otp", { email, otp });

      const tempUser = {
        email,
      };

      store.dispatch(setTempUser({ tempUser }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`otp verification failed: ${error.message}`, error);
        throw new Error("invlid otp");
      }

      log.error(`Unknown error occurred during otp verification`, error);
      throw new Error("invlid otp");
    }
  }

  async signUp(patientData: Partial<IPatient>): Promise<void> {
    try {
      await api.patient.post("/auth/signup", patientData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`error user signup: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during otp verification`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<SignInResult> {
    try {
      const response = await api.patient.post("/auth/signin", credentials);

      const { accessToken, patient } = response.data;

      store.dispatch(
        signIn({
          email: patient.email,
          role: "patient",
          token: accessToken,
        })
      );

      store.dispatch(setPatient(patient));

      store.dispatch(setCurrentPatient(patient));

      return patient;
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`SignInUser failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async signOut(): Promise<void> {
    try {
      await api.patient.post("/auth/signout");
      store.dispatch(clearUser());
      store.dispatch(signOut());
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`SignInUser failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async googleSignIn(credential: string): Promise<GoogleSignInResult> {
    try {
      const response = await api.patient.post("/auth/google", { credential });

      const { patient, accessToken, partialUser } = response.data;

      if (partialUser) {
        store.dispatch(
          setTempUser({
            tempUser: patient,
          })
        );

        store.dispatch(
          signIn({
            email: patient.email,
            role: "patient",
            token: accessToken,
            isAuthenticated: false,
          })
        );

        return partialUser;
      }

      store.dispatch(
        signIn({
          email: patient.email,
          role: "patient",
          token: accessToken,
        })
      );

      store.dispatch(setPatient(patient));

      return partialUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`google sign in failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during google sign-in`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async verifyEmail(email: string): Promise<verifyEmailResult> {
    try {
      const response = await api.patient.post(
        "/auth/forgot-password/verify-email",
        { email }
      );

      const { patient } = response.data;

      store.dispatch(setTempUser({ tempUser: patient }));

      return patient;
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`Error when otp sending: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during sending otp`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async verifyOtpForgotPassword(
    email: string,
    otp: string
  ): Promise<verifyOtpForgotPasswordResult> {
    try {
      await api.patient.post("/auth/forgot-password/verify-otp", {
        email,
        otp,
      });

      return {
        email,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`otp verification failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during otp verification`, error);
      throw new Error("something went wrong");
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    try {
      await api.patient.patch("/auth/reset-password", { id, password });
    } catch (error) {
      if (error instanceof Error) {
        log.error(`otp verification failed: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred during otp verification`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async completeProfile(patientData: Partial<IPatient>): Promise<void> {
    try {
      const response = await api.patient.post("/auth/complete-profile", {
        patientData,
      });

      const { patient, accessToken } = response.data;

      store.dispatch(
        signIn({
          email: patient.email,
          role: "patient",
          token: accessToken,
        })
      );
      store.dispatch(setPatient(patient));
    } catch (error) {
      console.error(`Unknown error occurred during completing profile`, error);
      throw new Error("An unknown error occurred");
    }
  }

  async resendOtp(email: string): Promise<void> {
    try {
      await api.patient.post("/auth/resend-otp", { email });
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`otp sending failed: ${error.message}`, error);
      }

      log.error(`Unknown error occurred durin resenging otp`, error);
    }
  }

  async resendOtpForgotPassword(email: string): Promise<void> {
    try {
      await api.patient.post("/auth/forgot-password/resend-otp", { email });
    } catch (error) {
      if (error instanceof Error) {
        log.error(`otp sending failed: ${error.message}`, error);
      }

      log.error(`Unknown error occurred durin resenging otp`, error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      await api.patient.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`error changing password: ${error.message}`, error);

        throw new Error(error.message);
      }

      log.error(`Unknown error occurred`, error);
      throw new Error("An unknown error occurred");
    }
  }
}

const authServicePatient = new AuthServicePatient();

export default authServicePatient;