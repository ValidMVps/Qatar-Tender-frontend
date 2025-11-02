"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "../lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: "✅ Success",
          description: "Login successful! Redirecting...",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Error",
          description: result.error || "Invalid credentials",
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
    <div className="w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md bg-white rounded-xl p-4 pt-0 sm:p-4"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
          {!isPending && <MailCheck className="ml-2 h-4 w-4" />}
        </Button>

        {/* Signup Redirect */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            {t('sign_up')}
          </Link>
        </div>
      </form>
    </div>
  );
}
