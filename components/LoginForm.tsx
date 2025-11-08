// components/LoginForm.tsx (client component)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useTranslation from "@/lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const result = await login(email, password);

      if (result?.success) {
        toast({
          title: "✅ Success",
          description: "Login successful! Redirecting...",
          variant: "default",
        });

        // Redirect client-side after login (adjust path if you set user type in context)
        // If your AuthContext exposes user immediately after login, you can inspect it and route accordingly.
        router.push("/dashboard");
      } else {
        toast({
          title: "❌ Error",
          description: result?.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("LoginForm error:", err);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 bg-white rounded-xl p-0 sm:p-0">
      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
          {t("email") || "Email*"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900">
            {t("password") || "Password*"}
          </label>
          <Link href="/forgot-password" className="text-sm underline hover:text-blue-600">
            {t("forgot_password") || "Forgot your password?"}
          </Link>
        </div>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md border border-gray-300 bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Log in"}
          {!isPending && <MailCheck className="ml-2 h-4 w-4" />}
        </button>

       
      </div>

      {/* Signup */}
      <div className="mt-5 flex items-center justify-center gap-x-1 text-center text-sm md:mt-6">
        <p>
          {t("dont_have_account") || "Don't have an account?"}{" "}
          <Link href="/signup" className="font-medium underline">
            {t("sign_up") || "Sign up"}
          </Link>
        </p>
      </div>
    </form>
  );
}
