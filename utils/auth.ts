// lib/auth.ts
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

export interface JWTPayload {
  id: string;
  exp: number;
  iat: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "user_data";
  private readonly REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

  // Helper: set secure cookie
  private setCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; max-age=${maxAge}; path=/; secure; samesite=strict`;
  }

  // Helper: get cookie
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
    return null;
  }

  // Helper: remove cookie
  private removeCookie(name: string) {
    document.cookie = `${name}=; max-age=0; path=/; secure; samesite=strict`;
  }

  // Store user session
  private storeSession(token: string, user: User) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const expiresIn = decoded.exp * 1000 - Date.now();

      // Store token in cookie
      this.setCookie(this.TOKEN_KEY, token, Math.floor(expiresIn / 1000));

      // Store user in cookie
      this.setCookie(
        this.USER_KEY,
        JSON.stringify(user),
        Math.floor(expiresIn / 1000)
      );

      // Auto refresh
      this.setupTokenRefresh(expiresIn);

      return true;
    } catch (error) {
      console.error("Error storing session:", error);
      return false;
    }
  }

  // Setup token refresh
  private setupTokenRefresh(expiresIn: number) {
    const refreshTime = expiresIn - this.REFRESH_BUFFER;
    if (refreshTime > 0) {
      setTimeout(() => this.refreshToken(), refreshTime);
    }
  }

  // Refresh token before expiry
  private async refreshToken() {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();

      if (timeUntilExpiry < 10 * 60 * 1000) {
        const user = this.getUser();
        if (user) {
          const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const newExpiresIn = 24 * 60 * 60 * 1000; // 24h
            this.setCookie(
              this.TOKEN_KEY,
              token,
              Math.floor(newExpiresIn / 1000)
            );
            this.setCookie(
              this.USER_KEY,
              JSON.stringify(user),
              Math.floor(newExpiresIn / 1000)
            );
            this.setupTokenRefresh(newExpiresIn);
          } else {
            this.logout();
          }
        }
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      this.logout();
    }
  }

  // Login
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Login failed" };

      const { token, ...userData } = data;
      const stored = this.storeSession(token, userData);

      if (!stored) return { success: false, error: "Failed to store session" };
      return { success: true, user: userData };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network error" };
    }
  }

  // Register
  async register(userData: {
    email: string;
    password: string;
    userType: "individual" | "business";
    phone: string;
    fullName?: string;
    companyName?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Registration failed" };
      return { success: true, message: data.message };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: "Network error" };
    }
  }

  // Logout
  logout() {
    this.removeCookie(this.TOKEN_KEY);
    this.removeCookie(this.USER_KEY);
    if (typeof window !== "undefined") window.location.href = "/login";
  }

  // Get token
  getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  // Get user
  getUser(): User | null {
    const userData = this.getCookie(this.USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Check auth
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // Check token expiry soon
  isTokenExpiring(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp - now < 10 * 60;
    } catch {
      return true;
    }
  }

  // Authenticated API request
  async apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    if (!token || !this.isAuthenticated()) throw new Error("Not authenticated");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    if (response.status === 401) {
      this.logout();
      throw new Error("Session expired");
    }
    return response;
  }

  // Forgot password
  async forgotPassword(email: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Failed" };
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  async verifyResetCode(email: string, code: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Invalid code" };
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Failed" };
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (!response.ok)
        return { success: false, error: data.message || "Failed" };
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: "Network error" };
    }
  }
}

export const authService = new AuthService();
