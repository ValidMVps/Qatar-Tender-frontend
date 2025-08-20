// lib/apiClient.ts
import axios from "axios";
import {
  getTokenFromCookie,
  setTokenCookie,
  clearTokens,
} from "@/utils/tokenHelpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // important for cookie-based refresh
});

// Request: attach token if present
apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: try refresh once on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh endpoint directly using axios (no interceptors)
        const refreshRes = await axios.post(
          `${API_BASE_URL}/api/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshRes.data?.accessToken) {
          setTokenCookie(refreshRes.data.accessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
