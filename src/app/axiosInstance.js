import axios from 'axios';
import { fetchCSRFAccess, fetchCSRFToken } from './actions/actions';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (request) => {
  const csrfToken = await fetchCSRFAccess();
  console.log("intercept request setting header token: ", csrfToken);
  if (csrfToken) {
    request.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return request;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("intercepted 401");
            originalRequest._retry = true;
            try {
                const csrfRefreshToken = await fetchCSRFToken();
                const refreshInstance = axios.create({
                    withCredentials: true,
                    baseURL: process.env.NEXT_PUBLIC_API_URL
                });
            refreshInstance.defaults.headers.common['X-CSRF-TOKEN'] = csrfRefreshToken;
            console.log("refresh endpoint being hit, ", csrfRefreshToken);
            let response = await refreshInstance.post("/token/refresh", {});
            console.log(response);
            console.log("retrying original request...");
            return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("isLoggedIn");
                // window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;