"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// This is a simulated server action for demonstration.
// In a real application, this would be in app/actions/auth.ts or similar.
async function authenticate(
  prevState: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (email === "test@example.com" && password === "Password123!") {
    return { message: "Login successful! Redirecting..." };
  } else {
    return { message: "Invalid credentials. Please try again." };
  }
}

export default function LoginForm() {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  // Show toast message based on authentication result
  // In a real app, you'd likely redirect on success
  if (state?.message) {
    toast({
      title: state.message.includes("successful") ? "Success" : "Error",
      description: state.message,
      variant: state.message.includes("successful") ? "default" : "destructive",
    });
    // You might add a redirect here for successful login
    // For example: if (state.message.includes("successful")) { router.push('/dashboard'); }
  }

  return (
    <form action={formAction} className="space-y-6 w-full ">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
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
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md"
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login"}
        <MailCheck className="ml-2 h-4 w-4" />
      </Button>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
