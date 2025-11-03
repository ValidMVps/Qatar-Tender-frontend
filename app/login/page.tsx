"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import useTranslation from "@/lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import Navbarlanding from "@/components/Navbarladning";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push(
        user.userType === "business" ? "/business-dashboard" : "/dashboard"
      );
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    // Optional: show nothing or a loader while redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbarlanding />
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-6xl w-full grid grid-cols-1 items-center gap-10">
          <div className="flex justify-center">
            <Card className="w-full max-w-md border border-neutral-200 shadow-sm rounded-xl bg-white">
              <CardHeader className="text-center space-y-1">
                <CardTitle className="text-lg lg:text-2xl font-semibold tracking-tight text-gray-900">
                  {t("log_in_to_your_account")}
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm lg:text-sm">
                  {t("enter_your_credentials_to_access_your_dashboard")}
                </CardDescription>
              </CardHeader>
              <CardContent className="lg:px-4 px-0 mt-0 pt-0">
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
