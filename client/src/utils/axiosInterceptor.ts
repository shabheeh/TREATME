import axios, { AxiosError} from 'axios';
import TokenManager, { TOKEN_KEYS } from './TokenMangager';
import log from 'loglevel'

const tokenManager = new TokenManager()

const API_URLS = {
    user: 'http://localhost:5000/api/user',
    doctor: 'http://localhost:5000/api/doctor',
    admin: 'http://localhost:5000/api/admin'
}

const createAxiosInstance = (role: keyof typeof TOKEN_KEYS) => {
    
    const instance = axios.create({
        baseURL: API_URLS[role],
        timeout: 10000,
    });

    const refreshAuthToken = async () => {
        try {
            
            const response = await axios.post(`${API_URLS[role]}/auth/refresh-token`)
    
            const { accessToken } = response.data;
            tokenManager.setToken(role, accessToken);
    
            return accessToken;
        } catch (error: unknown) {
            if(error instanceof AxiosError ) {
                log.error(error.message)
            }
            tokenManager.clearToken(role);
            if(role === 'user') {
                window.location.href = '/signin'
                return null
            }
            window.location.href = `${role}/signin`;
            return null;
        }
    }
    
    instance.interceptors.request.use(
        async (config) => {
            const token = tokenManager.getAccessToken(role);
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
    
          if (error.response?.status !== 401 || originalRequest._retry) {
            
            const errorMessage = error.response?.data?.error 
              || error.response?.data?.message 
              || error.message 
              || 'An unexpected error occurred';
            
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
}

export const api = {
    user: createAxiosInstance('user'),
    doctor: createAxiosInstance('doctor'),
    admin: createAxiosInstance('admin')
}





