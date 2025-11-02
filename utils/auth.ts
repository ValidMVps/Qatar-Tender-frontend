import { jwtDecode } from "jwt-decode";
import {
  setTokenCookie,
  getTokenFromCookie,
  clearTokens,
} from "@/utils/tokenHelpers";
import { api } from "@/lib/apiClient";

export interface User {
  _id: string;
  email: string;
  userType: "individual" | "business" | "admin";
  isVerified: boolean;
  adminType?: string;
  permissions?: string[];
  isDocumentVerified?: string;
  documentRejectionReason?: string;
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
      console.log("📦 Login Response:", response.data);

      // If server returns a structured failure in a 200-ish response
      if (response.data && response.data.success === false) {
        return {
          success: false,
          error: response.data.error || response.data.message || "Login failed",
        };
      }

      // normalize token field names
      const accessToken =
        response.data?.accessToken ??
        response.data?.access_token ??
        response.data?.token;

      if (!accessToken) {
        // server didn't return a token (explicitly fail with server message if present)
        return {
          success: false,
          error:
            response.data?.error ||
            response.data?.message ||
            "No access token received",
        };
      }

      // persist token (your helper)
      setTokenCookie(accessToken);

      // pick user payload (prefer explicit `user` field)
      const user =
        response.data?.user ??
        (() => {
          // remove known fields and return the rest as user data
          const { accessToken: _, access_token: __, token: ___, success, ...rest } =
            response.data || {};
          return rest;
        })();

      return { success: true, user };
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        // backend responded with non-2xx
        const body = error.response.data || {};
        errorMessage =
          body.error ||
          body.message ||
          (error.response.status === 401
            ? "Invalid credentials or account not verified."
            : error.response.status >= 500
              ? "Server error. Please try again later."
              : `Request failed (${error.response.status})`);
      } else if (error.request) {
        // request made but no response
        errorMessage = "No response from server. Check your network connection.";
      } else {
        // something else happened
        errorMessage = error.message || errorMessage;
      }

      return { success: false, error: errorMessage };
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
    } catch {
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

  async refreshToken(): Promise<boolean> {
    try {
      const response = await api.post(
        "/api/users/refresh-token",
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
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.patch("/api/users/change-password", {
        currentPassword,
        newPassword,
      });

      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to change password",
      };
    }
  }
}

export const authService = new AuthService();
