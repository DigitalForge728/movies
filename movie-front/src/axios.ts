import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = new URL(window.location.href).pathname;
        if (currentPath !== "/auth") {
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
