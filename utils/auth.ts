// utils/auth.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  setTokenCookie,
  getTokenFromCookie,
  clearTokens,
} from "@/utils/tokenHelpers";

export interface User {
  _id: string;
  email: string;
  userType: "individual" | "business" | "admin";
  isVerified: boolean;
  adminType?: string;
  permissions?: string[];
  profile?: any;
}

export interface RegisterData {
  email: string;
  password: string;
  userType: "individual" | "business";
  phone: string;
  fullName?: string;
  companyName?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance with credentials to send cookies
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This enables cookies
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simplified response interceptor (auth instance)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // Only attempt refresh once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use axios.post directly with withCredentials to preserve cookie refresh behavior
        const response = await axios.post(
          `${API_BASE_URL}/api/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.data.accessToken) {
          setTokenCookie(response.data.accessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Only clear tokens, don't redirect here
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  async register(userData: RegisterData) {
    try {
      const response = await api.post("/api/users/register", userData);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await api.post("/api/users/login", { email, password });
      const { accessToken, ...userData } = response.data;

      if (accessToken) {
        setTokenCookie(accessToken);
        return { success: true, user: userData };
      }

      return { success: false, error: "No access token received" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }

  async logout() {
    try {
      await api.post("/api/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get("/api/users/profile");
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await api.post("/api/users/forgot-password", { email });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Request failed",
      };
    }
  }

  async verifyResetCode(email: string, code: string) {
    try {
      const response = await api.post("/api/users/verify-reset-code", {
        email,
        code,
      });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Invalid code",
      };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      const response = await api.put("/api/users/reset-password", {
        email,
        code,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Reset failed",
      };
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const response = await api.post("/api/users/resend-verification", {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Resend failed",
      };
    }
  }

  isAuthenticated(): boolean {
    const token = getTokenFromCookie();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp! > now;
    } catch {
      return false;
    }
  }

  // Simple refresh method for manual use
  async refreshToken(): Promise<boolean> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (response.data.accessToken) {
        setTokenCookie(response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
export { api };
