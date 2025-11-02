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
import { getTokenFromCookie } from "@/utils/tokenHelpers";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  _id: string;
  user: any;
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
        u &&
        (window.location.pathname === "/login" ||
          window.location.pathname === "/")
      ) {
        router.push(
          u.userType === "business" ? "/business-dashboard" : "/dashboard"
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

  /** ------------------ GLOBAL 401 INTERCEPTOR ------------------ */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast({
            title: "Logged Out",
            description: "Session expired.",
            variant: "destructive",
          });
          router.push("/login?session=expired");
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [logout, router, toast]);

  /** ------------------ CROSS-TAB REFRESH ------------------ */
  const notifyOtherTabsOfLogin = useCallback(() => {
    const payload = { ts: Date.now(), tabId: tabIdRef.current };

    // BroadcastChannel
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("session-channel");
      bc.postMessage(payload);
      bc.close();
    }

    // localStorage fallback
    try {
      localStorage.setItem("session_refresh", JSON.stringify(payload));
    } catch {}
  }, []);

  useEffect(() => {
    const bcSupported = typeof (window as any).BroadcastChannel !== "undefined";
    let bc: BroadcastChannel | null = null;

    const handleIncoming = async (data: any) => {
      if (suppressReloadRef.current) {
        suppressReloadRef.current = false;
        return;
      }
      await checkAuth();
    };

    if (bcSupported) {
      try {
        bc = new BroadcastChannel("session-channel");
        bc.addEventListener("message", (ev) => handleIncoming(ev.data));
      } catch {
        bc = null;
      }
    }

    const onStorage = (ev: StorageEvent) => {
      if (ev.key !== "session_refresh") return;
      try {
        const data = ev.newValue ? JSON.parse(ev.newValue) : null;
        handleIncoming(data);
      } catch {}
    };

    window.addEventListener("storage", onStorage);

    return () => {
      if (bc) {
        try {
          bc.removeEventListener("message", (ev) => handleIncoming(ev.data));
        } catch {}
        try {
          bc.close();
        } catch {}
      }
      window.removeEventListener("storage", onStorage);
    };
  }, [checkAuth]);

  /** ------------------ LOGIN ------------------ */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        fetchProfile(); // async fetch

        suppressReloadRef.current = true;
        setTimeout(() => (suppressReloadRef.current = false), 5500);

        notifyOtherTabsOfLogin();

        const token = getTokenFromCookie();
        if (token) {
          socketService.connect(token);
          socketService
            .getSocket()
            ?.emit("join-user-room", { userId: result.user._id });
        }

        router.push(
          result.user.userType === "business"
            ? "/business-dashboard"
            : "/dashboard"
        );
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
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
