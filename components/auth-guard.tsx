"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

export function ProtectedRoute({
  children,
  allowedUserTypes,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  useEffect(() => {
    // Only proceed when loading is complete
    if (!isLoading) {
      setHasAttemptedAuth(true);

      // Add a small delay to allow any token refresh to complete
      const timeoutId = setTimeout(() => {
        if (!user) {
          console.log("No user found after auth check, redirecting to login");
          router.push("/login");
          return;
        }

        if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
          // Redirect to appropriate dashboard if user type not allowed
          const redirectPath = getRedirectPath(user.userType);
          router.push(redirectPath);
          return;
        }

        console.log("User is authenticated:", user);
      }, 100); // Small delay to allow refresh to complete

      return () => clearTimeout(timeoutId);
    }
  }, [user, isLoading, router, allowedUserTypes]);

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

  // Show loading while authentication is being checked OR while we haven't attempted auth yet
  if (isLoading || !hasAttemptedAuth) {
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

  return <>{children}</>;
}

// HOC version (alternative usage)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedUserTypes?: string[]
) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute allowedUserTypes={allowedUserTypes}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;
  return AuthenticatedComponent;
}
