import { store } from "../../redux/app/store";
import { signIn, signOut } from "../../redux/features/auth/authSlice";
import { clearUser, setDoctor } from "../../redux/features/user/userSlice";
import { IDoctor } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

class DoctorAuthService {
  async signIn(email: string, password: string): Promise<IDoctor> {
    try {
      const response = await api.doctor.post("/auth/signin", {
        email,
        password,
      });

      const { doctor, accessToken } = response.data;

      store.dispatch(
        signIn({
          email: doctor.email,
          role: "doctor",
          token: accessToken,
        })
      );

      store.dispatch(setDoctor(doctor));

      return doctor;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error Signin doctor: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async signOut(): Promise<void> {
    try {
      await api.doctor.post("/auth/signout");

      store.dispatch(signOut());
      store.dispatch(clearUser());
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error Signout doctor: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const doctorAuthService = new DoctorAuthService();
export default doctorAuthService;
