import type { AxiosError } from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const axiosInterceptor = axios.create({
  withCredentials: true,
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get("_csrf");
    const method = config.method?.toLowerCase();

    if (csrfToken && ["post", "put", "patch", "delete"].includes(method || "")) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInterceptor.interceptors.response.use(
  (response) => {
    const tokenFromHeader = response.headers["x-csrf-token"];
    if (tokenFromHeader) {
      Cookies.set("_csrf", tokenFromHeader);
    }
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status;
    const resData = error.response?.data;

    const message =
      resData?.message ||
      (statusCode === 401 ? "Sesi telah berakhir" : "Terjadi kesalahan");

    toast.error(message);

    return Promise.reject(error);
  },
);

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  retry_after?: number;
}
