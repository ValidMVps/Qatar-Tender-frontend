"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  MailCheck,
  RefreshCw,
  UserRound,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useTranslation } from "../lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

type Step = 1 | 2 | 3;
type AccountType = "individual" | "business";

type FormState = {
  accountType: AccountType | null;
  fullName: string;
  email: string;
  companyName: string;
  companyEmail: string;
  countryCode: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
};

const initialState: FormState = {
  accountType: null,
  fullName: "",
  email: "",
  companyName: "",
  companyEmail: "",
  countryCode: "+974",
  phone: "",
  password: "",
  dateOfBirth: "",
  agreeToTerms: false,
};

const countries = [
  { code: "+974", name: "Qatar" },
  { code: "+971", name: "United Arab Emirates" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+965", name: "Kuwait" },
  { code: "+973", name: "Bahrain" },
  { code: "+968", name: "Oman" },
  { code: "+91", name: "India" },
  { code: "+44", name: "United Kingdom" },
  { code: "+1", name: "United States" },
];

export default function SignupWizard() {
  const { t } = useTranslation();
  const { register, resendVerificationEmail, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({ ...initialState });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const currentEmail = useMemo(() => {
    return form.accountType === "business" ? form.companyEmail : form.email;
  }, [form]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSelectType = (type: AccountType) => {
    setForm((f) => ({ ...f, accountType: type }));
    setErrors((e) => {
      const next = { ...e };
      delete next.accountType;
      return next;
    });
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateStep = (s: Step): boolean => {
    const nextErrors: Record<string, string> = {};

    if (s === 1) {
      if (!form.accountType)
        nextErrors.accountType = "Please choose an account type.";
    }

    if (s === 2) {
      const emailToCheck =
        form.accountType === "business" ? form.companyEmail : form.email;
      const nameToCheck =
        form.accountType === "business" ? form.companyName : form.fullName;

      if (!nameToCheck.trim()) {
        nextErrors.name =
          form.accountType === "business"
            ? "Company name is required."
            : "Full name is required.";
      }

      if (!emailToCheck.trim()) {
        nextErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToCheck)) {
        nextErrors.email = "Please enter a valid email address.";
      }

      if (!form.phone.trim()) {
        nextErrors.phone = "Phone number is required.";
      } else if (!/^\d{6,15}$/.test(form.phone.replace(/\D/g, ""))) {
        nextErrors.phone = "Enter a valid phone number (6-15 digits).";
      }

      if (!form.password.trim()) {
        nextErrors.password = "Password is required.";
      } else if (form.password.length < 8) {
        nextErrors.password = "Password must be at least 8 characters.";
      } else if (!/[a-zA-Z]/.test(form.password)) {
        nextErrors.password = "Include at least one letter.";
      } else if (!/[0-9]/.test(form.password)) {
        nextErrors.password = "Include at least one number.";
      } else if (!/[^a-zA-Z0-9]/.test(form.password)) {
        nextErrors.password = "Include at least one special character.";
      }

      if (!form.dateOfBirth) {
        nextErrors.dateOfBirth = "Date of birth is required.";
      } else if (calculateAge(form.dateOfBirth) < 18) {
        nextErrors.dateOfBirth =
          "You must be at least 18 years old to register.";
      }

      if (!form.agreeToTerms) {
        nextErrors.agreeToTerms =
          "You must agree to the Terms of Service and Privacy Policy.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onContinue = () => {
    if (!validateStep(step)) {
      toast({
        title: "Check required fields",
        description: "Please fix the highlighted fields to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (step === 1) setStep(2);
  };

  const onSubmit = async () => {
    if (!validateStep(2)) {
      toast({
        title: "Validation failed",
        description: "Please complete the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const registrationData = {
        email: currentEmail,
        password: form.password,
        userType: form.accountType!,
        phone: `${form.countryCode}${form.phone}`,
        dateOfBirth: form.dateOfBirth,
        agreeToTerms: form.agreeToTerms,
        ...(form.accountType === "individual"
          ? { fullName: form.fullName }
          : { companyName: form.companyName }),
      };

      const result = await register(registrationData);

      if (result.success) {
        setRegistrationSuccess(true);
        setStep(3);
        setResendCooldown(30);
        toast({
          title: "Registration successful!",
          description:
            result.message ||
            `We've sent a verification email to ${currentEmail}. Please check your email and click the verification link.`,
        });
      } else {
        if (result.error?.includes("already exists")) {
          setErrors({
            email: "This email is already registered. Try logging in instead.",
          });
        } else {
          setErrors({
            general: result.error || "Registration failed. Please try again.",
          });
        }

        toast({
          title: "Registration failed",
          description:
            result.error || "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const resend = async () => {
    if (resendCooldown > 0) return;

    setIsSubmitting(true);

    try {
      const result = await resendVerificationEmail(currentEmail);

      if (result.success) {
        setResendCooldown(30);
        toast({
          title: "Verification email sent",
          description:
            result.message ||
            `A new verification link was sent to ${currentEmail}.`,
        });
      } else {
        toast({
          title: "Failed to resend",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl p-4 sm:p-6 md:p-8 bg-white border border-gray-100 shadow-sm">
      <StepHeader current={step} />

      {errors.general && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {step === 1 && (
          <StepOne
            selected={form.accountType}
            onSelect={handleSelectType}
            error={errors.accountType}
          />
        )}
        {step === 2 && (
          <StepTwo
            form={form}
            errors={errors}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          />
        )}
        {step === 3 && (
          <StepThree
            email={currentEmail}
            cooldown={resendCooldown}
            onResend={resend}
          />
        )}
      </div>

      <div className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {step > 1 && !registrationSuccess && (
            <Button
              variant="outline"
              onClick={onBack}
              className="px-4 py-2 sm:px-5 sm:py-2.5 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
          )}

          <div className="flex ms-auto flex-row sm:flex-row gap-3 w-full  sm:w-auto">
            {step === 1 && (
              <Button
                onClick={onContinue}
                className="bg-blue-600 ms-auto text-white px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-auto hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {t("continue")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={onSubmit}
                className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-auto hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    {t("submit")} <MailCheck className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            {step === 3 && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Edit details
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-auto hover:bg-green-700"
                >
                  Continue to Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          {t("login")}
        </Link>
      </div>
    </div>
  );
}

function StepOne({
  selected,
  onSelect,
  error,
}: {
  selected: AccountType | null;
  onSelect: (t: AccountType) => void;
  error?: string;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-6 text-base text-muted-foreground">
        Choose the type of account
      </div>
      <div className="grid gap-4 sm:grid-cols-1">
        <SelectableCard
          title={t("individual")}
          description="For contractors, consultants, and freelancers."
          icon={<UserRound className="h-6 w-6" aria-hidden="true" />}
          selected={selected === "individual"}
          onClick={() => onSelect("individual")}
        />
        <SelectableCard
          title={t("business")}
          description="For companies bidding on tenders."
          icon={<Building2 className="h-6 w-6" aria-hidden="true" />}
          selected={selected === "business"}
          onClick={() => onSelect("business")}
        />
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function SelectableCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex gap-4 sm:gap-6 relative text-left",
        "rounded-xl border bg-white p-4 sm:p-5 transition-all",
        "hover:shadow-xs focus-visible:outline-none",
        selected ? "border-blue-400" : "border-neutral-200"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-colors",
          selected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
        )}
      >
        {icon}
        <span className="sr-only">{title} account</span>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <div className="text-base sm:text-lg font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

function StepTwo({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Record<string, string>;
  onChange: (patch: Partial<FormState>) => void;
}) {
  const isBiz = form.accountType === "business";
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {isBiz ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-base font-medium">
              Company name
            </Label>
            <Input
              id="companyName"
              placeholder="e.g., Doha Build Co."
              value={form.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              className={cn(
                "py-2.5 sm:py-3 mt-1 text-base",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="text-base font-medium">
              Company email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="name@company.qa"
              value={form.companyEmail}
              onChange={(e) => onChange({ companyEmail: e.target.value })}
              className={cn(
                "py-2.5 sm:py-3 mt-1 text-base",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium">
              Full name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g., Layla Al-Thani"
              value={form.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className={cn(
                "py-2.5 sm:py-3 mt-1 text-base",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.qa"
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={cn(
                "py-2.5 sm:py-3 mt-1 text-base",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-base font-medium">
          Date of Birth
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
          className={cn(
            "py-2.5 sm:py-3 mt-1 text-base",
            errors.dateOfBirth && "border-red-500"
          )}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-medium">
          {t("phone")}
        </Label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1">
          <Select
            value={form.countryCode}
            onValueChange={(v) => onChange({ countryCode: v })}
          >
            <SelectTrigger className="w-full sm:w-[140px] py-2.5 sm:py-3">
              <SelectValue placeholder={t("code")} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name} {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            inputMode="numeric"
            placeholder="Phone number"
            className={cn(
              "flex-1 py-2.5 sm:py-3 text-base",
              errors.phone && "border-red-500"
            )}
            value={form.phone}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/[^\d]/g, "");
              onChange({ phone: onlyDigits });
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-base font-medium">
          {t("password")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => onChange({ password: e.target.value })}
          className={cn(
            "py-2.5 sm:py-3 text-base mt-1",
            errors.password && "border-red-500"
          )}
        />
        {errors.password && (
          <div className="text-sm text-red-600 mt-1">
            <p>{errors.password}</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 8 characters with letters, numbers, and
          special characters.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={form.agreeToTerms}
            onCheckedChange={(checked) => onChange({ agreeToTerms: !!checked })}
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm font-medium leading-relaxed"
          >
            By continuing, you confirm authority to bind your organization and
            agree to the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . You consent to electronic communications and e-signatures.
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600 mt-1">{errors.agreeToTerms}</p>
        )}
        <p className="text-xs text-foreground mt-1">
          By signing up, you confirm you are 18 or older and agree to comply
          with all applicable laws, including procurement, anti-bribery, and
          data protection regulations.
        </p>
      </div>
    </div>
  );
}

function StepThree({
  email,
  cooldown,
  onResend,
}: {
  email: string;
  cooldown: number;
  onResend: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">
            Verify your email address
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">
              {email || "your email address"}
            </span>
            . Please check your email and click the verification link to
            activate your account.
          </p>
          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> You must verify your email before you
              can log in to your account.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onResend}
          disabled={cooldown > 0}
          className="px-4 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend verification email"}
        </Button>
        <span className="text-sm text-muted-foreground text-center sm:text-left">
          Didn&apos;t receive it? Check your spam folder or try again.
        </span>
      </div>
    </div>
  );
}

function StepHeader({ current }: { current: Step }) {
  const steps = [
    { id: 1, label: "Account Type" },
    { id: 2, label: "Details" },
    { id: 3, label: "Verify Email" },
  ] as const;

  return (
    <div className="w-full mb-6 sm:mb-8">
      <ol className="flex items-center justify-between w-full relative">
        {steps.map((s, i) => {
          const isActive = current === s.id;
          const isComplete = current > s.id;

          return (
            <li
              key={s.id}
              className="flex flex-col items-center relative flex-1"
            >
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-px bg-neutral-200 z-0 hidden sm:block" />
              )}

              <div
                className={cn(
                  "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors relative z-10 bg-white",
                  isComplete
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                    : "bg-muted text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  s.id
                )}
              </div>

              <span
                className={cn(
                  "text-xs sm:text-sm font-medium mt-2 text-center px-1",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
