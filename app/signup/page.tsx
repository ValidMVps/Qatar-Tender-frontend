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
        accountType: formData.accountType,
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
    <div className="min-h-screen p-0 bg-gray-50">
      <Headerauth />
      <div className="grid grid-cols-2 h-full p-0">
        <div className="div h-screen flex justify-end items-end ">
          <Image
            src={image1}
            alt="Signup Background"
            className="object-contain w-full h-full"
          />
        </div>
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
          <div className="w-full max-w-3xl">
            <Card className="border-0">
              <CardContent className="px-8 py-12">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-start mb-8">
                      <h2 className="text-4xl font-semibold text-gray-900 mb-2">
                        Choose Your Account Type
                      </h2>
                      <p className="text-gray-600">
                        Select the option that best describes you
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateFormData({ accountType: "individual" })
                        }
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          formData.accountType === "individual"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex gap-7  items-center space-y-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              formData.accountType === "individual"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <User
                              className={`h-6 w-6 ${
                                formData.accountType === "individual"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              Individual
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Personal account for individuals who want to post
                              projects and hire service providers.
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateFormData({ accountType: "business" })
                        }
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          formData.accountType === "business"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex gap-7 items-center space-y-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              formData.accountType === "business"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Building2
                              className={`h-6 w-6 ${
                                formData.accountType === "business"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              Business
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Business account to post projects and also offer
                              services to others.
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-start mb-8">
                      <h2 className="text-4xl font-semibold text-gray-900 mb-2">
                        Your Details
                      </h2>
                      <p className="text-gray-600">
                        {formData.accountType === "individual"
                          ? "Tell us about yourself"
                          : "Tell us about your business"}
                      </p>
                    </div>
                    {formData.accountType === "individual" && (
                      <div className="space-y-6">
                        <Input
                          value={formData.fullName}
                          onChange={(e) =>
                            updateFormData({ fullName: e.target.value })
                          }
                          placeholder="Full Name"
                        />
                        <Input
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData({ email: e.target.value })
                          }
                          placeholder="Email"
                        />
                        <div className="flex space-x-3">
                          <div className="">
                            <CountryCodeSelect
                              value={formData.countryCode}
                              onChange={(value) =>
                                updateFormData({ countryCode: value })
                              }
                            />
                          </div>
                          <Input
                            value={formData.mobile}
                            onChange={(e) =>
                              updateFormData({ mobile: e.target.value })
                            }
                            placeholder="Mobile Number"
                          />
                        </div>
                      </div>
                    )}
                    {formData.accountType === "business" && (
                      <div className="space-y-6">
                        <Input
                          value={formData.companyName}
                          onChange={(e) =>
                            updateFormData({ companyName: e.target.value })
                          }
                          placeholder="Company Name"
                        />
                        <Input
                          value={formData.companyEmail}
                          onChange={(e) =>
                            updateFormData({ companyEmail: e.target.value })
                          }
                          placeholder="Company Email"
                        />
                        <div className="flex space-x-3">
                          <div className="">
                            <CountryCodeSelect
                              value={formData.countryCode}
                              onChange={(value) =>
                                updateFormData({ countryCode: value })
                              }
                            />
                          </div>
                          <Input
                            value={formData.mobile}
                            onChange={(e) =>
                              updateFormData({ mobile: e.target.value })
                            }
                            placeholder="Company Phone"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-start mb-8">
                      <h2 className="text-4xl font-semibold text-gray-900 mb-2">
                        Verify Your Email
                      </h2>
                      <p className="text-gray-600">
                        Enter the 6-digit code sent to your email
                      </p>
                    </div>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={!verificationCode.trim()}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Finish</span>
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={fillWithRandomData}
                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2"
                      >
                        🎲 Fill Random
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={currentStep === 2 ? handleSubmit : nextStep}
                      disabled={
                        (currentStep === 1 && !canProceedFromStep1) ||
                        (currentStep === 2 && !canProceedFromStep2)
                      }
                    >
                      <span>{currentStep === 2 ? "Submit" : "Continue"}</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-left mt-8 px-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
