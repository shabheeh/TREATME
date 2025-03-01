import axios, { AxiosError } from "axios";
import TokenManager from "./TokenMangager";
import log from "loglevel";
// import { store } from '../redux/app/store';
// import { signOut } from '../redux/features/auth/authSlice';
// import { clearUser } from '../redux/features/user/userSlice';

const tokenManager = new TokenManager();

const API_URLS = {
  patient: import.meta.env.VITE_API_PATIENT,
  doctor: import.meta.env.VITE_API_DOCTOR,
  admin: import.meta.env.VITE_API_ADMIN,
  shared: import.meta.env.VITE_API_SHARED,
};

type UserRole = "patient" | "doctor" | "admin";

const createAxiosInstance = (role?: UserRole) => {
  const instance = axios.create({
    baseURL: role ? API_URLS[role] : API_URLS.shared,
    timeout: 10000,
    withCredentials: true,
  });

  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SHARED}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      tokenManager.setToken(accessToken);

      return accessToken;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        log.error(error.message);
      }
      tokenManager.clearToken();
      if (role === "patient") {
        window.location.href = "/signin";
      } else {
        window.location.href = `/${role}/signin`;
      }

      return null;
    }
  };

  instance.interceptors.request.use(
    async (config) => {
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.request.use(
    async (config) => {
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(new Error("Network error, please try again."));
      }

      const { status, data } = error.response;

      // Handle 403 Forbidden (RBAC Redirect)
      if (status === 403) {
        // store.dispatch(signOut());
        // store.dispatch(clearUser());

        window.location.href =
          role === "patient" ? "/signin" : `/${role}/signin`;

        return Promise.reject(new Error("Forbidden: Permission denied"));
      }

      // Handle 401 Unauthorized
      if (status === 401) {
        const errorCode = data?.error || data?.message;

        // If login failed (Invalid Credentials), do NOT retry
        if (
          errorCode !== "Token has expired" &&
          errorCode !== "Invalid or expired token"
        ) {
          return Promise.reject(new Error("Token has expired"));
        }

        if (originalRequest._retry) {
          return Promise.reject(new Error("Unauthorized: Access denied."));
        }

        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAuthToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      const errorMessage =
        data?.error ||
        data?.message ||
        error.message ||
        "An unexpected error occurred";

      return Promise.reject(new Error(errorMessage));
    }
  );

  return instance;
};

export const api = Object.assign(createAxiosInstance(), {
  patient: createAxiosInstance("patient"),
  doctor: createAxiosInstance("doctor"),
  admin: createAxiosInstance("admin"),
});
