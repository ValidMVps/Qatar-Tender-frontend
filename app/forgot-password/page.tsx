"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Headerauth from "@/components/Headerauth";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/utils/auth";
import useTranslation from "@/lib/hooks/useTranslation";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const result = await authService.forgotPassword(email);

    if (result.success) {
      toast({
        title: "✅ OTP Sent",
        description: "Check your email for the reset code.",
      });
      setStep("otp");
    } else {
      toast({
        title: "❌ Error",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsPending(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "❌ Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);

    // Step 1: verify OTP
    const verifyResult = await authService.verifyResetCode(email, otp);
    if (!verifyResult.success) {
      toast({
        title: "❌ Error",
        description: verifyResult.error,
        variant: "destructive",
      });
      setIsPending(false);
      return;
    }

    // Step 2: reset password
    const resetResult = await authService.resetPassword(
      email,
      otp,
      newPassword
    );
    if (resetResult.success) {
      toast({
        title: "✅ Success",
        description: "Password reset successful! You can now log in.",
      });
      router.push("/login");
    } else {
      toast({
        title: "❌ Error",
        description: resetResult.error,
        variant: "destructive",
      });
    }

    setIsPending(false);
  };

  return (
    <div className="min-h-screen p-0 bg-gray-100">
      <Headerauth />
      <div className="flex justify-center items-center h-full p-0">
        <div className="min-h-screen flex w-full items-center justify-center">
          <div className="flex w-full items-center justify-center">
            <Card className="w-md border border-neutral-200">
              <CardContent>
                <div className="space-y-6 py-7 w-full max-w-md mx-auto">
                  {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your email and we’ll send you an OTP.
                        </p>
                      </div>

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

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                        disabled={isPending}
                      >
                        {isPending ? "Sending..." : "Send OTP"}
                      </Button>

                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Remembered your password?{" "}
                        <Link
                          href="/login"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Back to login
                        </Link>
                      </div>
                    </form>
                  )}

                  {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold">Verify OTP</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter the OTP sent to{" "}
                          <span className="font-medium">{email}</span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP Code</Label>
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">{t("new_password")}</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                        disabled={isPending}
                      >
                        {isPending ? "Verifying..." : "Reset Password"}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
