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
  shared: import.meta.env.VITE_API_SHARED
};

type userRole = "patient" | "doctor" | "admin" | "shared";

const createAxiosInstance = (role: userRole) => {
  const instance = axios.create({
    baseURL: API_URLS[role],
    timeout: 10000,
    withCredentials: true
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
      if (role === "patient" || role === "shared") {
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

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 403) {
        // store.dispatch(signOut())
        // store.dispatch(clearUser())
        if (role === "patient" || role === "shared") {
          window.location.href = "/signin";
        } else {
          window.location.href = `/${role}/signin`;
        }
        return Promise.reject(new Error("Forbidden: Permission denied"));
      }

      if (error.response?.status !== 401 || originalRequest._retry) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";

        return Promise.reject(new Error(errorMessage));
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
  );

  return instance;
};

export const api = {
  patient: createAxiosInstance("patient"),
  doctor: createAxiosInstance("doctor"),
  admin: createAxiosInstance("admin"),
  shared: createAxiosInstance("shared")
};
