"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({ ...initialState });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);

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

  const onSubmit = () => {
    if (!validateStep(2)) {
      toast({
        title: "Validation failed",
        description: "Please complete the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
    toast({
      title: "Verification email sent",
      description: `We've sent a link to ${currentEmail}.`,
    });
    setResendCooldown(30);
  };

  const onBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const fillRandom = () => {
    const acct: AccountType = Math.random() > 0.5 ? "individual" : "business";
    const cc = countries[Math.floor(Math.random() * countries.length)].code;
    const serial = Math.floor(100 + Math.random() * 899);
    const phone = String(Math.floor(1000000 + Math.random() * 8999999));
    const fullName = sample([
      "Layla Al-Thani",
      "Hamad Al-Khalifa",
      "Noor Al-Suwaidi",
      "Faisal Al-Mansoori",
      "Maryam Al-Mahmoud",
    ]);
    const companyName = sample([
      "Doha Build Co.",
      "Gulf Infra Group",
      "Desert Star Trading",
      "Pearl Contracting",
      "Corniche Holdings",
    ]);
    const emailLocal = fullName.toLowerCase().replace(/[^a-z]/g, "") || "user";
    const companyLocal =
      companyName.toLowerCase().replace(/[^a-z]/g, "") || "company";
    const domain = sample(["qatartenders.qa", "qtr-mail.com", "example.qa"]);

    const next: FormState = {
      accountType: acct,
      fullName,
      email: `${emailLocal}${serial}@${domain}`,
      companyName,
      companyEmail: `${companyLocal}${serial}@${domain}`,
      countryCode: cc,
      phone,
      password: `P@ssw0rd${serial}`,
    };
    setForm(next);
    setErrors({});
    if (step === 1) setStep(2);
    toast({
      title: "Demo data filled",
      description: "You can edit any field before submitting.",
    });
  };

  const resend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    toast({
      title: "Resent verification",
      description: `A new link was sent to ${currentEmail}.`,
    });
  };

  return (
    <div className="space-y-8 w-xl rounded-2xl p-8 bg-white border border-gray-100">
      <StepHeader current={step} />
      <div className="space-y-8">
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
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <Button variant="outline" onClick={fillRandom} className="px-5 py-2">
          Fill with random data
        </Button>

        <div className="flex items-center gap-3">
          {step > 1 && (
            <Button variant="ghost" onClick={onBack} className="px-5 py-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {step === 1 && (
            <Button
              onClick={onContinue}
              className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Link
              href={
                form.accountType !== "business"
                  ? "/dashboard"
                  : "/business-dashboard"
              }
            >
              <Button className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700">
                Submit <MailCheck className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          {step === 3 && (
            <Button
              variant="secondary"
              onClick={() => setStep(2)}
              className="px-5 py-2"
            >
              Edit details
            </Button>
          )}{" "}
        </div>
      </div>{" "}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Login
        </Link>
      </div>
      <Link
        href="/business-dashboard"
        className="font-medium text-blue-600 hover:underline"
      >
        BUsiness
      </Link>
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
  return (
    <div>
      <div className="mb-8 text-base text-muted-foreground">
        Choose the type of account
      </div>
      <div className="grid gap-3 sm:grid-cols-1">
        <SelectableCard
          title="Individual"
          description="For contractors, consultants, and freelancers."
          icon={<UserRound className="h-6 w-6" aria-hidden="true" />}
          selected={selected === "individual"}
          onClick={() => onSelect("individual")}
        />
        <SelectableCard
          title="Business"
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
        "group flex gap-6 relative text-left",
        "rounded-xl border bg-white p-5 transition-all",
        "hover:shadow-xs focus-visible:outline-none  ",
        selected ? "border-blue-400" : "border-neutral-200"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          selected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
        )}
      >
        {icon}
        <span className="sr-only">{title} account</span>
      </div>
      <div className="space-y-2">
        <div className="text-lg font-semibold">{title}</div>
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
  return (
    <div className="space-y-5">
      {isBiz ? (
        <>
          <div className="space-y-3">
            <Label htmlFor="companyName" className="text-base font-medium">
              Company name
            </Label>
            <Input
              id="companyName"
              placeholder="e.g., Doha Build Co."
              value={form.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              className="py-3 mt-2 text-base"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-2">{errors.name}</p>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="companyEmail" className="text-base font-medium">
              Company email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="name@company.qa"
              value={form.companyEmail}
              onChange={(e) => onChange({ companyEmail: e.target.value })}
              className="py-3  mt-2  text-base"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-2">{errors.email}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-base font-medium">
              Full name
            </Label>
            <Input
              id="fullName"
              placeholder="e.g., Layla Al-Thani"
              value={form.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className="py-3  mt-2  text-base"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-2">{errors.name}</p>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.qa"
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="py-3  mt-2  text-base"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-2">{errors.email}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-3">
        <Label htmlFor="phone" className="text-base font-medium">
          Phone
        </Label>
        <div className="flex gap-3  mt-2 ">
          <Select
            value={form.countryCode}
            onValueChange={(v) => onChange({ countryCode: v })}
          >
            <SelectTrigger className="w-[160px] py-3">
              <SelectValue placeholder="Code" />
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
            className="flex-1 py-3 text-base"
            value={form.phone}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/[^\d]/g, "");
              onChange({ phone: onlyDigits });
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 mt-2">{errors.phone}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Include your company&apos;s main line for business accounts.
        </p>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <Label htmlFor="password" className="text-base font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => onChange({ password: e.target.value })}
          className="py-3 text-base  mt-2 "
        />
        {errors.password && (
          <div className="text-sm text-red-600 mt-2">
            <p>{errors.password}</p>
          </div>
        )}
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
    <div className="space-y-8">
      <div className="flex items-start gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">
              {email || "your email address"}
            </span>
            . Click the link to verify and complete your signup.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onResend}
          disabled={cooldown > 0}
          className="px-6 py-3"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
        </Button>
        <span className="text-sm text-muted-foreground">
          Didn&apos;t receive it? Check spam or try again.
        </span>
      </div>
    </div>
  );
}

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function StepHeader({ current }: { current: Step }) {
  const steps = [
    { id: 1, label: "Account Type" },
    { id: 2, label: "Details" },
    { id: 3, label: "Verify Email" },
  ] as const;

  return (
    <div className="w-full">
      <ol className="flex items-center justify-between w-full relative">
        {steps.map((s, i) => {
          const isActive = current === s.id;
          const isComplete = current > s.id;

          return (
            <li
              key={s.id}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Connector line - only show for first two steps */}
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-px bg-neutral-200 z-0" />
              )}

              {/* Step circle */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors relative z-10 bg-white",
                  isComplete
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                    : "bg-muted text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : s.id}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "text-sm font-medium mt-2 text-center",
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
