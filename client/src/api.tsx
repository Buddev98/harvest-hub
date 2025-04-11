import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { logoutUser } from "./utils/logoutUser";

// Extend InternalAxiosRequestConfig to include _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: "https://harvest-hub-9s2d.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const toggleLoader = (display: string): void => {
  const mainloading = document.getElementById('mainloader');
  if (mainloading) {
    mainloading.style.display = display;
  }
};

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig | Promise<CustomAxiosRequestConfig> => {
    toggleLoader('flex');
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    toggleLoader('none');
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    toggleLoader('none');
    return response;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    toggleLoader('none');

    if (error.response?.status === 401) {
      logoutUser();
    }

    return Promise.reject(error);
  }
);

export default api;
