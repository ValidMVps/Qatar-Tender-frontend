"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterData, User } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyResetCode: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendVerificationEmail: (
    email: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper function to attempt token refresh
  const attemptTokenRefresh = async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshTokenFromCookie();
      if (!refreshToken) {
        return false;
      }

      // Call your refresh endpoint directly
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          // Set the new tokens
          setTokenCookie(data.accessToken);
          if (data.refreshToken) {
            setRefreshTokenCookie(data.refreshToken);
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Enhanced auth check function
  const checkAuth = async () => {
    try {
      // First check if we have a valid access token
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          return;
        }
        console.log(userData);
      }

      // If no valid access token, check if we have a refresh token
      const refreshToken = getRefreshTokenFromCookie();
      if (refreshToken) {
        console.log(
          "Access token missing but refresh token found, attempting refresh..."
        );
        const refreshSuccess = await attemptTokenRefresh();

        if (refreshSuccess) {
          // Try to get user data again after refresh
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            return;
          }
          console.log(userData);
        }
        console.log(user);
      }

      // If we get here, authentication failed
      setUser(null);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Add periodic token refresh check (optional but recommended)
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        // Check if token is about to expire (within 2 minutes)
        const token = getTokenFromCookie();
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const timeUntilExpiry = decoded.exp! * 1000 - Date.now();

            // If token expires in less than 2 minutes, refresh it
            if (timeUntilExpiry < 2 * 60 * 1000) {
              attemptTokenRefresh();
            }
          } catch (error) {
            console.error("Error checking token expiry:", error);
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);

      if (result.success && result.user) {
        setUser(result.user);
        // Redirect based on user type
        const redirectPath = getRedirectPath(result.user.userType);
        router.push(redirectPath);
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const verifyResetCode = async (email: string, code: string) => {
    return await authService.verifyResetCode(email, code);
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    return await authService.resetPassword(email, code, newPassword);
  };

  const resendVerificationEmail = async (email: string) => {
    return await authService.resendVerificationEmail(email);
  };

  const getRedirectPath = (userType: string) => {
    switch (userType) {
      case "admin":
        return "/admin";
      case "business":
        return "/business-dashboard";
      case "individual":
      default:
        return "/dashboard";
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper functions (add these to your auth.ts file or import them)
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; auth_token=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return null;
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

function setRefreshTokenCookie(refreshToken: string) {
  if (typeof document === "undefined") return;
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  document.cookie = `refresh_token=${encodeURIComponent(
    refreshToken
  )}; max-age=${maxAge}; path=/; secure; samesite=strict`;
}
