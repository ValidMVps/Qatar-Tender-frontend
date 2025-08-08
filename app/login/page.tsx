"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Headerauth from "@/components/Headerauth";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import image1 from "../../media/artwork.png";
import {
  generateRandomEmail,
  getRandomItem,
  randomNames,
} from "@/utils/random-data";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const fillWithRandomData = () => {
    setEmail(generateRandomEmail());
    setPassword("Password123!");
  };

  const handleLogin = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userSession = {
        email,
        name: getRandomItem(randomNames),
        isLoggedIn: true,
        loggedInAt: new Date().toISOString(),
        rememberMe,
      };
      localStorage.setItem("userSession", JSON.stringify(userSession));

      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-0 bg-gray-100">
      <Headerauth />
      <div className="flex justify-center items-center h-full p-0">
        <div className="min-h-screen flex w-full items-center justify-center ">
          <div className="flex w-full border items-center justify-center">
            <Card className="w-md border border-neutral-200">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Log in to your account
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent >
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
