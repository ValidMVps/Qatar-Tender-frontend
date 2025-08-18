// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/utils/auth";

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

interface RegisterData {
  email: string;
  password: string;
  userType: "individual" | "business";
  phone: string;
  fullName?: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = authService.isAuthenticated();
        const userData = authService.getUser();

        if (isAuth && userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login
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

  // Handle register
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

  // Handle logout
  const logout = () => {
    setUser(null);
    authService.logout();
    router.push("/login");
  };

  // Handle forgot password
  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  // Handle verify reset code
  const verifyResetCode = async (email: string, code: string) => {
    return await authService.verifyResetCode(email, code);
  };

  // Handle reset password
  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    return await authService.resetPassword(email, code, newPassword);
  };

  // Get redirect path based on user type
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
    resendVerificationEmail: function (email: string): Promise<{ success: boolean; message?: string; error?: string; }> {
      throw new Error("Function not implemented.");
    }
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

// HOC for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedUserTypes?: string[]
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push("/login");
          return;
        }

        if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
          // Redirect to appropriate dashboard if user type not allowed
          const redirectPath = getRedirectPath(user.userType);
          router.push(redirectPath);
          return;
        }
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect in useEffect
    }

    if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
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

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;

  return AuthenticatedComponent;
};
