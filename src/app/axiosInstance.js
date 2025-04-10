import axios from 'axios';
import { fetchCSRFAccess, fetchCSRFToken } from './actions/actions';
// https://medium.com/@velja/token-refresh-with-axios-interceptors-for-a-seamless-authentication-experience-854b06064bde
let isRefreshing = false;
let refreshSubscribers = [];

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);

const onTokenRefreshed = (token) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};
axiosInstance.interceptors.request.use(async (request) => {
  const csrfToken = await fetchCSRFAccess();
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
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers['X-CSRF-TOKEN'] = token;
                        resolve(axiosInstance(originalRequest));
                    });
                });
              }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const csrfRefreshToken = await fetchCSRFToken();
                const refreshInstance = axios.create({
                    withCredentials: true,
                    baseURL: process.env.NEXT_PUBLIC_API_URL
                });
                refreshInstance.defaults.headers.common['X-CSRF-TOKEN'] = csrfRefreshToken;
                try{
                    await refreshInstance.post("/token/refresh", {});
                } catch (refreshError) {
                    if (refreshError.response?.status === 401) {
                      localStorage.clear();
                      window.location.href = "/auth/login";
                      return Promise.reject(new Error("Session expired. Please login again."))
                    }
                    throw refreshError
                }
                // set instance header to new access token
                const newCsrfAccess = await fetchCSRFAccess();
                axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = newCsrfAccess;
                onTokenRefreshed(newCsrfAccess);
                
                originalRequest.headers['X-CSRF-TOKEN'] = newCsrfAccess;
                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem("isLoggedIn");
                window.location.href = "/auth/login";
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;