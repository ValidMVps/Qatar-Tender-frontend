import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

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

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshTokenFromCookie();
        if (!refreshToken) {
          authService.logout();
          return Promise.reject(error);
        }

        const response = await api.post("/api/users/refresh-token", {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (accessToken) {
          setTokenCookie(accessToken);
          if (newRefreshToken) {
            setRefreshTokenCookie(newRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Cookie helpers
function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;

  try {
    const decoded = jwtDecode(token);
    const expiresIn = decoded.exp! * 1000 - Date.now();
    const maxAge = Math.floor(expiresIn / 1000);

    document.cookie = `auth_token=${encodeURIComponent(
      token
    )}; max-age=${maxAge}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error("Error setting token cookie:", error);
  }
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; auth_token=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
}

function removeTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; max-age=0; path=/; secure; samesite=strict";
  document.cookie =
    "refresh_token=; max-age=0; path=/; secure; samesite=strict";
}

function setRefreshTokenCookie(refreshToken: string) {
  if (typeof document === "undefined") return;

  // Set refresh token for 7 days (longer than access token)
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  document.cookie = `refresh_token=${encodeURIComponent(
    refreshToken
  )}; max-age=${maxAge}; path=/; secure; samesite=strict`;
}

function getRefreshTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; refresh_token=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
}

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
      const { accessToken, refreshToken, ...userData } = response.data;

      if (accessToken) {
        setTokenCookie(accessToken);

        // Store refresh token if provided (when not using backend cookies)
        if (refreshToken) {
          setRefreshTokenCookie(refreshToken);
        }

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
      const refreshToken = getRefreshTokenFromCookie();
      if (refreshToken) {
        await api.post("/api/users/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeTokenCookie();
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
}

export const authService = new AuthService();
export { api };
