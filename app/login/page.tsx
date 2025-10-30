"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Headerauth from "@/components/Headerauth";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import image1 from "../../media/artwork.png";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed header */}
      <Headerauth />

      {/* Main content area */}
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-6xl w-full grid grid-cols-1  items-center gap-10">
          {/* Right side form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md border border-neutral-200 shadow-sm rounded-xl bg-white">
              <CardHeader className="text-center space-y-1">
                <CardTitle className="text-lg lg:text-2xl font-semibold tracking-tight text-gray-900">
                  Log in to your account
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm lg:text-sm">
                  Enter your credentials to access your dashboard
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
