"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressIndicator } from "@/components/progress-indicator";
import { CountryCodeSelect } from "@/components/country-code-select";
import { FileUpload } from "@/components/file-upload";
import { LanguageToggle } from "@/components/language-toggle";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  User,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

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
import Headerauth from "@/components/Headerauth";
import image1 from "../../media/artwork.png";
import Image from "next/image";

type AccountType = "individual" | "business" | null;

interface FormData {
  accountType: AccountType;
  // Individual fields
  fullName: string;
  email: string;
  mobile: string;
  countryCode: string;
  nationalId: string;
  nationalIdFile: File | null;
  // Company fields
  companyName: string;
  crNumber: string;
  crFile: File | null;
  companyEmail: string; // Renamed from companyEmail to email in signup form, but kept as companyEmail in state
  companyPhone: string; // Renamed from companyPhone to phone in signup form, but kept as companyPhone in state
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const steps = ["Account Type", "Details"]; // Removed "Verification" step

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const totalSteps = steps.length; // Dynamically get total steps

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Adjusted condition
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromStep1 = formData.accountType !== null;
  // Updated canProceedFromStep2: National ID and CR fields are now optional
  const canProceedFromStep2 =
    formData.accountType === "individual"
      ? formData.fullName && formData.email && formData.mobile
      : formData.companyName && formData.companyEmail && formData.companyPhone;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call for account creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("SignupPage: Account created:", formData);

      // Store user data in localStorage for demo purposes
      const userData = {
        accountType: formData.accountType,
        isKycVerified: false, // KYC is no longer part of signup, default to false
        submittedAt: new Date().toISOString(),
        ...formData,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("SignupPage: User data set in localStorage:", userData);

      // Add a small delay before redirecting to ensure localStorage is updated
      setTimeout(() => {
        // Redirect based on account type
        if (formData.accountType === "individual") {
          router.push("/dashboard"); // Individual Dashboard (Opportunity Poster only)
          console.log("SignupPage: Redirecting to /dashboard");
        } else if (formData.accountType === "business") {
          router.push("/business-dashboard"); // Combined Business Dashboard
          console.log("SignupPage: Redirecting to /business-dashboard");
        }
      }, 50); // Small delay, e.g., 50ms
    } catch (error) {
      console.error("SignupPage: Account creation error:", error);
      setIsSubmitting(false);
    }
  };

  const fillWithRandomData = () => {
    if (currentStep === 1) {
      // Fill Step 1 data
      updateFormData({
        accountType: Math.random() > 0.5 ? "individual" : "business",
      });
    } else if (currentStep === 2) {
      if (formData.accountType === "individual") {
        // Fill individual data
        updateFormData({
          fullName: getRandomItem(randomNames),
          email: generateRandomEmail(),
          mobile: generateRandomPhone(),
          // National ID and file are now optional, can be left empty or filled
          nationalId: Math.random() > 0.5 ? generateRandomNationalId() : "",
          nationalIdFile:
            Math.random() > 0.5 ? createMockFile("national-id.pdf") : null,
        });
      } else if (formData.accountType === "business") {
        // Fill business data
        updateFormData({
          companyName: getRandomItem(randomCompanies),
          // CR Number and file are now optional, can be left empty or filled
          crNumber: Math.random() > 0.5 ? generateRandomCR() : "",
          crFile:
            Math.random() > 0.5 ? createMockFile("cr-document.pdf") : null,
          companyEmail: generateRandomEmail(),
          companyPhone: "+974" + generateRandomPhone(),
        });
      }
    }
    // No step 3 to fill
  };

  return (
    <div className="min-h-screen p-0 bg-gray-50">
      {/* Header */}
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
                {/* Step 1: User Type Selection */}
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
                      {/* Individual */}
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

                      {/* Business */}
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

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-start mb-8">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Your Details
                      </h2>
                      <p className="text-gray-600">
                        {formData.accountType === "individual"
                          ? "Tell us about yourself"
                          : "Tell us about your business"}
                      </p>
                    </div>

                    {/* Individual Form */}
                    {formData.accountType === "individual" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                              updateFormData({ fullName: e.target.value })
                            }
                            placeholder="Enter your full name"
                            className="bg-white border-gray-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              updateFormData({ email: e.target.value })
                            }
                            placeholder="your.email@example.com"
                            className="bg-white border-gray-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number *
                          </label>
                          <div className="flex space-x-3">
                            <div className="">
                              <CountryCodeSelect
                                value={formData.countryCode}
                                onChange={(value) =>
                                  updateFormData({ countryCode: value })
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) =>
                                  updateFormData({ mobile: e.target.value })
                                }
                                placeholder="12345678"
                                className="bg-white border-gray-300"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Business Form */}
                    {formData.accountType === "business" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <Input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) =>
                              updateFormData({ companyName: e.target.value })
                            }
                            placeholder="Enter company name"
                            className="bg-white border-gray-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Email *
                          </label>
                          <Input
                            type="email"
                            value={formData.companyEmail}
                            onChange={(e) =>
                              updateFormData({ companyEmail: e.target.value })
                            }
                            placeholder="company@example.com"
                            className="bg-white border-gray-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Phone *
                          </label>
                               <div className="flex space-x-3">
                            <div className="">
                              <CountryCodeSelect
                                value={formData.countryCode}
                                onChange={(value) =>
                                  updateFormData({ countryCode: value })
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) =>
                                  updateFormData({ mobile: e.target.value })
                                }
                                placeholder="12345678"
                                className="bg-white border-gray-300"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center space-x-2 bg-transparent"
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

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      variant={"default"}
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !canProceedFromStep1) ||
                        (currentStep === 2 && !canProceedFromStep2)
                      }
                      className="flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Complete Signup</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
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
