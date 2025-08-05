"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen p-0 bg-gray-50">
      <Headerauth />
      <div className="grid grid-cols-2 h-full p-0">
        <div className="div h-screen flex justify-end items-end">
          <Image
            src={image1}
            alt="Login Background"
            className="object-contain w-full h-full"
          />
        </div>

        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
          <div className="w-full max-w-3xl">
            <Card className="border-0">
              <CardContent className="px-8 py-12 space-y-6">
                <div className="text-start mb-8">
                  <h2 className="text-4xl font-semibold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Sign in to your account to continue
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-blue-600 h-4 w-4"
                      />
                      <span className="text-gray-700">Remember me</span>
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={fillWithRandomData}
                    className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2"
                  >
                    🎲 Fill Random
                  </Button>

                  <Button
                    type="button"
                    onClick={handleLogin}
                    disabled={isSubmitting || !email || !password}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Login</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-left mt-8 px-2">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
