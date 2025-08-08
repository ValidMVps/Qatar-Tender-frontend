"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountryCodeSelect } from "@/components/country-code-select";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  User,
} from "lucide-react";
import Link from "next/link";
import Headerauth from "@/components/Headerauth";
import Image from "next/image";
import image1 from "../../media/artwork.png";

import {
  randomNames,
  randomCompanies,
  generateRandomEmail,
  generateRandomPhone,
  generateRandomNationalId,
  generateRandomCR,
  getRandomItem,
  createMockFile,
} from "@/utils/random-data";
import SignupWizard from "@/components/SignupWizard";

type AccountType = "individual" | "business" | null;

interface FormData {
  accountType: AccountType;
  fullName: string;
  email: string;
  mobile: string;
  countryCode: string;
  nationalId: string;
  nationalIdFile: File | null;
  companyName: string;
  crNumber: string;
  crFile: File | null;
  companyEmail: string;
  companyPhone: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    accountType: null,
    fullName: "",
    email: "",
    mobile: "",
    countryCode: "+974",
    nationalId: "",
    nationalIdFile: null,
    companyName: "",
    crNumber: "",
    crFile: null,
    companyEmail: "",
    companyPhone: "",
  });

  const steps = ["Account Type", "Details", "Email Verification"];

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceedFromStep1 = formData.accountType !== null;
  const canProceedFromStep2 =
    formData.accountType === "individual"
      ? formData.fullName && formData.email && formData.mobile
      : formData.companyName && formData.companyEmail && formData.companyPhone;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const userData = {
        isKycVerified: false,
        submittedAt: new Date().toISOString(),
        ...formData,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      nextStep();
    } catch (error) {
      console.error("SignupPage: Account creation error:", error);
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) return;

    if (formData.accountType === "individual") {
      router.push("/dashboard");
    } else if (formData.accountType === "business") {
      router.push("/business-dashboard");
    }
  };

  const fillWithRandomData = () => {
    if (currentStep === 1) {
      updateFormData({
        accountType: Math.random() > 0.5 ? "individual" : "business",
      });
    } else if (currentStep === 2) {
      if (formData.accountType === "individual") {
        updateFormData({
          fullName: getRandomItem(randomNames),
          email: generateRandomEmail(),
          mobile: generateRandomPhone(),
          nationalId: Math.random() > 0.5 ? generateRandomNationalId() : "",
          nationalIdFile:
            Math.random() > 0.5 ? createMockFile("national-id.pdf") : null,
        });
      } else if (formData.accountType === "business") {
        updateFormData({
          companyName: getRandomItem(randomCompanies),
          crNumber: Math.random() > 0.5 ? generateRandomCR() : "",
          crFile:
            Math.random() > 0.5 ? createMockFile("cr-document.pdf") : null,
          companyEmail: generateRandomEmail(),
          companyPhone: "+974" + generateRandomPhone(),
        });
      }
    }
  };

  return (
    <div className="min-h-screen p-0 bg-gray-100">
      <Headerauth />
      <div className="flex justify-center items-center h-full p-0">
        <div className="min-h-screen flex  items-center justify-center px-4 py-16">
          <SignupWizard />
        </div>
      </div>
    </div>
  );
}
