import { jwtDecode } from "jwt-decode";
import {
  setTokenCookie,
  getTokenFromCookie,
  clearTokens,
} from "@/utils/tokenHelpers";
import { api } from "@/lib/apiClient";
import { createTenderDraft } from "@/app/services/tenderService";

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
        return {
          success: false,
          error:
            response.data?.error ||
            response.data?.message ||
            "No access token received",
        };
      }

      // persist token
      setTokenCookie(accessToken);

      // pick user payload
      const user =
        response.data?.user ??
        (() => {
          const {
            accessToken: _,
            access_token: __,
            token: ___,
            success,
            ...rest
          } = response.data || {};
          return rest;
        })();

      // ✅ AUTO-CONVERT GUEST TENDER TO DRAFT
      try {
        const guestTender = localStorage.getItem("guestTender");
        if (guestTender) {
          console.log("🎯 Found guest tender, converting to draft...");

          const parsed: any = JSON.parse(guestTender);

          // Map to exact backend format
          const payload = {
            title: parsed.title?.trim() || "Untitled Tender",
            description: parsed.description?.trim() || "",
            location: parsed.location?.trim() || "",
            contactEmail: parsed.contactEmail?.trim() || email,
            deadline: parsed.deadline || null,
            estimatedBudget: parsed.estimatedBudget
              ? parseFloat(parsed.estimatedBudget)
              : null,
          };

          // Only proceed if minimal data exists
          if (payload.title && payload.description) {
            console.log("📤 Creating draft with payload:", payload);

            await createTenderDraft(payload);
            console.log("✅ Guest tender converted to draft successfully!");

            // Clean up localStorage
            localStorage.removeItem("guestTender");
          } else {
            console.log("⚠️ Guest tender missing required fields, discarding");
            localStorage.removeItem("guestTender");
          }
        }
      } catch (draftError) {
        console.error(
          "❌ Failed to convert guest tender to draft:",
          draftError
        );
        // Don't fail login - just log error
        // Guest tender remains in localStorage for manual recovery
      }

      return { success: true, user };
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
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
        errorMessage =
          "No response from server. Check your network connection.";
      } else {
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
