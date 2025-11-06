// contexts/AuthProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterData, User } from "@/utils/auth";
import { api } from "@/lib/apiClient";
import socketService from "@/lib/socket";
import { clearTokens, getTokenFromCookie } from "@/utils/tokenHelpers";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";

interface Profile {
  _id: string;
  user: any;
  phone?: string;
  fullName?: string;
  companyName?: string;
  address?: string;
  rating?: number;
  ratingCount?: number;
  userType?: "individual" | "business" | "admin";
  createdAt?: string;
  updatedAt?: string;

  // ✅ Add virtuals
  totalTenders?: number;
  activeTenders?: number;
  rejectedTenders?: number;
  completedTenders?: number;
  awardedTenders?: number;
  totalSpent?: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  verifyResetCode: (email: string, code: string) => Promise<any>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { toast } = useToast();

  const tabIdRef = useRef(
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const suppressReloadRef = useRef(false);
  useEffect(() => {
    const checkAdminAndRedirect = () => {
      const token = getTokenFromCookie();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.userType === "admin") {
          // Admin in user dashboard → kick out
          clearTokens();

          // Clear all cookies (extra safety)
          if (typeof document !== "undefined") {
            document.cookie.split(";").forEach((c) => {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(
                  /=.*/,
                  "=;expires=" + new Date(0).toUTCString() + ";path=/"
                );
            });
          }

          // Redirect
          window.location.href = "/login?error=admin_not_allowed";
          return;
        }

        // Valid non-admin → fetch profile
        authService
          .getCurrentUser()
          .then((profile) => {
            setUser(profile);
            setIsLoading(false);
          })
          .catch(() => {
            clearTokens();
            setIsLoading(false);
          });
      } catch (err) {
        clearTokens();
        setIsLoading(false);
      }
    };

    checkAdminAndRedirect();
  }, []);
  /** ------------------ PROFILE FETCH ------------------ */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/api/profiles");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setProfile(null);
    }
  }, []);

  /** ------------------ AUTH CHECK ------------------ */
  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      let userData: User | null = null;

      if (authService.isAuthenticated()) {
        userData = await authService.getCurrentUser();
      } else {
        const refreshSuccess = await authService.refreshToken();
        if (refreshSuccess) userData = await authService.getCurrentUser();
      }

      if (userData) {
        setUser(userData);
        fetchProfile(); // fetch profile asynchronously
        return userData;
      }

      setUser(null);
      setProfile(null);
      return null;
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  /** ------------------ LOGOUT ------------------ */
  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    try {
      authService.logout();
    } catch {}
    socketService.disconnect();
  }, []);

  /** ------------------ SOCKET ------------------ */
  const initializeSocketConnection = useCallback(() => {
    if (!user?._id || socketService.isConnected()) return;

    const token = getTokenFromCookie();
    if (!token) return;

    socketService.connect(token);
    socketService.joinUserRoom(user._id);

    const handleForceLogout = () => {
      if (suppressReloadRef.current) return;
      console.log("Server force-logout → reload");
      window.location.reload();
    };

    const socket = socketService.getSocket();
    socket?.on("force-logout", handleForceLogout);

    return () => socket?.off("force-logout", handleForceLogout);
  }, [user]);

  /** ------------------ INITIAL AUTH ON MOUNT ------------------ */
  useEffect(() => {
    (async () => {
      const u = await checkAuth();
      if (
        (u && window.location.pathname === "/login") ||
        window.location.pathname === "/signup"
      ) {
        router.push(
          u?.userType === "business" ? "/business-dashboard" : "/dashboard"
        );
      }
    })();
  }, [checkAuth, router]);

  /** ------------------ SOCKET LIFECYCLE ------------------ */
  useEffect(() => {
    const cleanup = user ? initializeSocketConnection() : undefined;
    if (!user) socketService.disconnect();
    return () => {
      cleanup?.();
      if (!user) socketService.disconnect();
    };
  }, [user, initializeSocketConnection]);

  /** ------------------ RECHECK ON FOCUS ------------------ */
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleFocus = () => {
      if (!isLoading && !user) {
        clearTimeout(timeout);
        timeout = setTimeout(() => checkAuth(), 200);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoading, user, checkAuth]);

  /** ------------------ LOGIN ------------------ */
  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const token = getTokenFromCookie();
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded?.userType === "admin") {
            // This should not happen if backend is correct, but just in case
            clearTokens();
            window.location.href = "/login?error=admin_not_allowed";
            return {
              success: false,
              error: "Admin access is not allowed here.",
            };
          }
        } catch (e) {
          /* ignore */
        }
      }
      const profile = await authService.getCurrentUser();
      setUser(profile);
    }
    return result;
  };

  /** ------------------ OTHER METHODS ------------------ */
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      return await authService.register(userData);
    } catch {
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = (email: string) => authService.forgotPassword(email);
  const verifyResetCode = (email: string, code: string) =>
    authService.verifyResetCode(email, code);
  const resetPassword = (email: string, code: string, newPassword: string) =>
    authService.resetPassword(email, code, newPassword);
  const resendVerificationEmail = (email: string) =>
    authService.resendVerificationEmail(email);

  const value: AuthContextType = {
    user,
    profile,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
