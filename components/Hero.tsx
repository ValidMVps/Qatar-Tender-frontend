"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const GUEST_TENDER_KEY = "guestTender";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Hero() {
  const [showForm, setShowForm] = useState(true);
  const [showSignupScreen, setShowSignupScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedBudget: "",
    deadline: null as Date | null,
    location: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingClose, setPendingClose] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const hasUnsavedData = useRef(false);

  const steps = [
    {
      id: 1,
      title: "Tender Title & Description",
      fields: [
        { name: "title", label: "Tender Title", type: "text", required: true },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      id: 2,
      title: "Budget & Deadline",
      fields: [
        {
          name: "estimatedBudget",
          label: "Estimated Budget (QAR)",
          type: "text",
          required: false,
        }, // ← was true
        {
          name: "deadline",
          label: "Deadline",
          type: "calendar",
          required: true,
        },
      ],
    },
    {
      id: 3,
      title: "Location & Contact",
      fields: [
        { name: "location", label: "Location", type: "text", required: true },
        {
          name: "contactEmail",
          label: "Contact Email",
          type: "text",
          required: true,
          validate: "email",
        },
        {
          name: "contactPhone",
          label: "Contact Phone",
          type: "text",
          required: true,
        },
      ],
    },
  ];
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_TENDER_KEY);
    const wasSaved = saved && JSON.parse(saved).createdAt; // saved drafts have createdAt

    localStorage.removeItem(GUEST_TENDER_KEY);
  }, []);
  useEffect(() => {
    if (showForm && !showSignupScreen) {
      const saved = localStorage.getItem(GUEST_TENDER_KEY);
      if (saved) {
        try {
          const tender = JSON.parse(saved);
          setFormData({
            title: tender.title || "",
            description: tender.description || "",
            estimatedBudget: tender.estimatedBudget || "",
            deadline: tender.deadline ? new Date(tender.deadline) : null,
            location: tender.location || "",
            contactEmail: tender.contactEmail || "",
            contactPhone: tender.contactPhone || "",
          });
          setIsSaved(true);
        } catch (e) {
          console.error("Failed to load saved tender", e);
        }
      }
    }
  }, [showForm, showSignupScreen]);

  useEffect(() => {
    const hasData = Object.values(formData).some(
      (val) =>
        (typeof val === "string" && val.trim() !== "") || val instanceof Date
    );
    hasUnsavedData.current = hasData && !showSignupScreen && !isSaved;
  }, [formData, showSignupScreen, isSaved]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (showForm) window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showForm]);

  const validateStep = (step: number): boolean => {
    const stepFields = steps[step].fields;
    const newErrors: Record<string, string> = {};

    stepFields.forEach((field) => {
      const value = formData[field.name as keyof typeof formData];
      if (
        field.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.validate === "email" && value) {
        const email = value as string;
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          newErrors[field.name] = "Invalid email address";
        }
      }
      if (field.name === "estimatedBudget" && value) {
        // ← only run when value exists
        const budget = (value as string).replace(/[^0-9]/g, "");
        if (budget && (isNaN(Number(budget)) || Number(budget) <= 0)) {
          newErrors[field.name] = "Budget must be a positive number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDeadlineChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deadline: date || null }));
    setIsSaved(false);
    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: "" }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handlePostTender = async () => {
    if (!validateStep(currentStep)) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      estimatedBudget: formData.estimatedBudget
        ? formData.estimatedBudget.replace(/[^0-9]/g, "")
        : "",
      deadline: formData.deadline ? formData.deadline.toISOString() : "",
      location: formData.location.trim(),
      contactEmail: formData.contactEmail.trim(),
      contactPhone: formData.contactPhone?.trim() || "", // make sure you add an input for phone if not present
      createdAt: new Date().toISOString(),
    };

    try {
      // show some UI loading state if you want
      const res = await fetch(`${API_BASE_URL}/api/tenders/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save tender");
      }

      const data = await res.json();
      // Save returned token + tender id so user can claim it later after signup
      const saveObj = {
        ...payload,
        tenderId: data.tenderId,
        guestToken: data.guestToken,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(GUEST_TENDER_KEY, JSON.stringify(saveObj));

      setShowSignupScreen(true);
      setIsSaved(true);
      hasUnsavedData.current = false;
    } catch (error: any) {
      // show error inline — you can map server errors to UI
      console.error("Guest tender save failed:", error);
      // set a user-visible error (reuse errors state or create a top-level message)
      setErrors((prev) => ({
        ...prev,
        form: error.message || "Unable to save tender",
      }));
    }
  };

  const confirmClose = () => {
    if (hasUnsavedData.current) {
      setPendingClose(true);
    } else {
      performClose();
    }
  };

  const performClose = () => {
    if (showSignupScreen) localStorage.removeItem(GUEST_TENDER_KEY);
    resetForm();
    setPendingClose(false);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setShowSignupScreen(false);
    setErrors({});
    setIsSaved(false);
    setFormData({
      title: "",
      description: "",
      estimatedBudget: "",
      deadline: null,
      location: "",
      contactEmail: "",
      contactPhone: "",
    });
    setShowForm(false);
    hasUnsavedData.current = false;
  };

  const openForm = () => {
    const saved = localStorage.getItem(GUEST_TENDER_KEY);
    if (saved) {
      setShowSignupScreen(true);
    } else {
      setShowSignupScreen(false);
      setCurrentStep(0);
    }
    setShowForm(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Side-by-Side Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.05]">
              built for Qatar.
              <br />
              <span className="text-[#38b6ff]">
                Compliant. Transparent. Faster.
              </span>
            </h1>
            <p className="text-xl sm:text-lg text-[#6e6e73] font-normal leading-relaxed">
              GoTenderly is a secure e-tendering platform for Qatari
              organisations — KYC-verified suppliers, audit-ready workflows, and
              built-in evaluation tools to shorten procurement cycles.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/signup"
                className="px-6 h-12 text-[#38b6ff] hover:bg-[#38b6ff]/5 rounded-full font-medium shadow-sm flex items-center gap-2"
              >
                Get started
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openForm}
                className="px-6 h-12 bg-[#38b6ff] hover:bg-[#0077ed] text-white rounded-full font-medium flex items-center gap-5"
              >
                Create a tender
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4 text-sm text-[#6e6e73]">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#38b6ff]" />
                KYC & company verification
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#38b6ff]" />
                Evaluation scorecards & audit trail
              </div>
            </div>
          </motion.div>

          {/* Right: Tender Form (Inline) */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-white rounded-[28px] shadow-2xl border border-[#d2d2d7] p-8 max-h-[90vh] overflow-y-auto sticky top-24"
            >
              {/* Close Button */}
              <button
                onClick={confirmClose}
                className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Progress Bar */}
              <div className="flex items-center justify-center mb-8">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      animate={{
                        backgroundColor:
                          i <= currentStep ? "#38b6ff" : "#f5f5f7",
                        scale: i === currentStep ? 1.06 : 1,
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                    >
                      {i < currentStep ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-semibold ${
                            i <= currentStep ? "text-white" : "text-[#86868b]"
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </motion.div>
                    {i < steps.length - 1 && (
                      <motion.div
                        animate={{
                          backgroundColor:
                            i < currentStep ? "#38b6ff" : "#e5e5ea",
                        }}
                        className="h-0.5 w-12 mx-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {!showSignupScreen ? (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                      {steps[currentStep].title}
                    </h3>
                    {steps[currentStep].fields.map((field, idx) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium text-[#6e6e73]">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}{" "}
                          {/* asterisk removed */}
                        </label>

                        {field.type === "textarea" ? (
                          <div className="relative">
                            <textarea
                              name={field.name}
                              value={
                                formData[
                                  field.name as keyof typeof formData
                                ] as string
                              }
                              onChange={handleChange}
                              placeholder={field.label}
                              className={cn(
                                "w-full h-32 bg-[#f5f5f7] rounded-xl border px-4 py-3 text-sm outline-none transition-colors resize-none",
                                errors[field.name]
                                  ? "border-red-500"
                                  : "border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff]"
                              )}
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        ) : field.type === "calendar" ? (
                          <div className="relative">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className={cn(
                                    "w-full h-12 bg-[#f5f5f7] rounded-xl border px-4 text-sm text-left font-normal flex items-center justify-between transition-colors",
                                    errors.deadline
                                      ? "border-red-500"
                                      : "border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff]",
                                    !formData.deadline &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  {formData.deadline ? (
                                    format(formData.deadline, "PPP p")
                                  ) : (
                                    <span>Select deadline</span>
                                  )}
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-4 space-y-3">
                                <Calendar
                                  mode="single"
                                  selected={formData.deadline || undefined}
                                  onSelect={(date) => {
                                    if (!date) return;
                                    const prev =
                                      formData.deadline || new Date();
                                    const newDate = new Date(date);
                                    newDate.setHours(
                                      prev.getHours(),
                                      prev.getMinutes()
                                    );
                                    handleDeadlineChange(newDate);
                                  }}
                                  initialFocus
                                />
                                <input
                                  type="time"
                                  className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
                                  value={
                                    formData.deadline
                                      ? format(formData.deadline, "HH:mm")
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value
                                      .split(":")
                                      .map(Number);
                                    const prev =
                                      formData.deadline || new Date();
                                    const newDate = new Date(prev);
                                    newDate.setHours(hours, minutes);
                                    handleDeadlineChange(newDate);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.deadline && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.deadline}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type={
                                field.name === "contactEmail" ? "email" : "text"
                              }
                              name={field.name}
                              value={
                                formData[
                                  field.name as keyof typeof formData
                                ] as string
                              }
                              onChange={handleChange}
                              placeholder={field.label}
                              className={cn(
                                "w-full h-12 bg-[#f5f5f7] rounded-xl border px-4 text-sm outline-none transition-colors",
                                errors[field.name]
                                  ? "border-red-500"
                                  : "border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff]"
                              )}
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-screen"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 text-center py-12"
                  >
                    <div className="mx-auto w-24 h-24 bg-[#38b6ff]/10 rounded-full flex items-center justify-center">
                      <Check className="w-12 h-12 text-[#38b6ff]" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-semibold text-[#1d1d1f]">
                        Tender Published
                      </h3>
                      <p className="text-lg text-[#6e6e73] max-w-md mx-auto">
                        Signup to publish and start receiving bids from verified
                        suppliers.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {!showSignupScreen && currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 h-12 rounded-xl text-[#38b6ff] hover:bg-[#38b6ff]/5 transition-colors"
                  >
                    Back
                  </button>
                )}
                {!showSignupScreen ? (
                  <button
                    onClick={() =>
                      currentStep === steps.length - 1
                        ? handlePostTender()
                        : nextStep()
                    }
                    className="flex-1 bg-[#38b6ff] hover:bg-[#0077ed] text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {currentStep === steps.length - 1
                      ? "Save & Continue"
                      : "Continue"}
                  </button>
                ) : (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        localStorage.removeItem(GUEST_TENDER_KEY);
                        setShowSignupScreen(false);
                        setCurrentStep(0);
                        setIsSaved(false);
                      }}
                      className="flex-1 h-12 rounded-xl border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    >
                      Edit Tender
                    </button>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="/signup"
                      className="flex-1 bg-[#38b6ff] hover:bg-[#0077ed] text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      Sign up now
                    </motion.a>
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-[#86868b] mt-6">
                {!showSignupScreen
                  ? currentStep === steps.length - 1
                    ? "Your tender will be saved locally."
                    : `Step ${currentStep + 1} of ${steps.length}`
                  : ""}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      {pendingClose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                Discard changes?
              </h3>
              <p className="text-[#6e6e73] mt-2">
                Your current draft will be lost.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingClose(false)}
                className="flex-1 h-12 rounded-xl border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                Cancel
              </button>
              <button
                onClick={performClose}
                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Discard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
