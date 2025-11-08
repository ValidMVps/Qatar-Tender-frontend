"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  DollarSign,
  Calendar,
  Mail,
  ChevronRight,
} from "lucide-react";

import { useTranslation } from "../lib/hooks/useTranslation";
import { createTender, createTenderDraft } from "@/app/services/tenderService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { detectContactInfo, VALIDATION_RULES } from "@/utils/validationcehck";
import { getCategories } from "@/app/services/categoryService";
import { useAuth } from "@/context/AuthContext";

// Step configuration
const STEPS = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Tender title and description",
    icon: FileText,
    fields: ["title", "description"],
  },
  {
    id: "details",
    title: "Project Details",
    description: "Category and budget information",
    icon: DollarSign,
    fields: ["category"],
  },
  {
    id: "schedule",
    title: "Schedule & Location",
    description: "Deadline and project location",
    icon: Calendar,
    fields: ["deadline", "location"],
  },
  {
    id: "contact",
    title: "Contact & Final Details",
    description: "Contact information and image upload",
    icon: Mail,
    fields: ["contactEmail", "image"],
  },
];
type Category = {
  _id: string;
  name: string;
};
interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  estimatedBudget?: string;
  deadline?: string;
  location?: string;
  contactEmail?: string;
  image?: string;
  general?: string;
}

const CreateTenderModal = ({
  open,
  onOpenChange,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<{
    title: string;
    description: string;
    category: string;
    estimatedBudget: string;
    deadline: string;
    location: string;
    contactEmail: string;
    image: string;
  }>;
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const [CATEGORIES, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    estimatedBudget: initialData?.estimatedBudget || "",
    deadline: initialData?.deadline || "",
    location: initialData?.location || "",
    contactEmail: initialData?.contactEmail || "",
    image: initialData?.image || "",
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [submissionType, setSubmissionType] = useState<"post" | "draft" | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Validation functions
  const validateField = useCallback(
    (fieldName: string, value: any): string | undefined => {
      switch (fieldName) {
        case "title":
          if (!value?.trim()) return t("title_is_required");
          if (value.length < VALIDATION_RULES.title.min)
            return t(
              `title_must_be_at_least_${VALIDATION_RULES.title.min}_characters`
            );
          if (value.length > VALIDATION_RULES.title.max)
            return t(
              `title_must_be_less_than_${VALIDATION_RULES.title.max}_characters`
            );

          const titleContactInfo = detectContactInfo(value);
          if (titleContactInfo.length > 0) {
            const highSeverity = titleContactInfo.filter(
              (d) => d.severity === "high"
            );
            if (highSeverity.length > 0) {
              return t(
                `title_contains_contact_information_${highSeverity[0].type}`
              );
            }
          }
          break;

        case "description":
          if (!value?.trim()) return t("description_is_required");
          if (value.length < VALIDATION_RULES.description.min)
            return t(
              `description_must_be_at_least_${VALIDATION_RULES.description.min}_characters`
            );
          if (value.length > VALIDATION_RULES.description.max)
            return t(
              `description_must_be_less_than_${VALIDATION_RULES.description.max}_characters`
            );

          const descContactInfo = detectContactInfo(value);
          if (descContactInfo.length > 0) {
            const highSeverity = descContactInfo.filter(
              (d) => d.severity === "high"
            );
            if (highSeverity.length > 0) {
              return t(
                `description_contains_contact_information_${highSeverity[0].type}`
              );
            }
          }
          break;

        case "category":
          if (!value) return t("category_is_required");
          break;

        case "estimatedBudget":
          // ---- OPTIONAL ----
          if (!value) break; // ← allow empty / undefined
          const budget = parseFloat(value);
          if (isNaN(budget) || budget < VALIDATION_RULES.estimatedBudget.min)
            return t("estimated_budget_must_be_a_positive_number");
          if (budget > VALIDATION_RULES.estimatedBudget.max)
            return t(
              `estimated_budget_must_be_less_than_${VALIDATION_RULES.estimatedBudget.max}`
            );
          break;

        case "deadline":
          if (!value) return t("deadline_is_required");
          const deadline = new Date(value);
          const now = new Date();
          if (deadline <= now) return t("deadline_must_be_in_the_future");
          // Check if deadline is more than 2 years in the future
          const twoYearsFromNow = new Date(
            now.getFullYear() + 2,
            now.getMonth(),
            now.getDate()
          );
          if (deadline > twoYearsFromNow)
            return t("deadline_must_be_within_2_years");
          break;

        case "location":
          if (!value?.trim()) return t("location_is_required");
          if (value.length < VALIDATION_RULES.location.min)
            return t(
              `location_must_be_at_least_${VALIDATION_RULES.location.min}_characters`
            );
          if (value.length > VALIDATION_RULES.location.max)
            return t(
              `location_must_be_less_than_${VALIDATION_RULES.location.max}_characters`
            );
          break;

        case "contactEmail":
          if (!value?.trim()) return t("contact_email_is_required");
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          if (!emailRegex.test(value))
            return t("please_enter_a_valid_email_address");
          break;
      }
      return undefined;
    },
    [t]
  );

  // Real-time validation
  const fieldErrors = useMemo(() => {
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (touchedFields.has(key)) {
        const error = validateField(key, value);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });
    return newErrors;
  }, [formData, touchedFields, validateField]);

  // Check if current step is valid
  const isCurrentStepValid = useMemo(() => {
    const currentStepFields = STEPS[currentStep].fields;
    return currentStepFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value);
      return !error && (field === "image" || value); // image is optional
    });
  }, [currentStep, formData, validateField]);

  // Handle field changes
  const handleChange = async (e: { target: any }) => {
    const target = e.target;
    const { id, value, files } = target;

    // Mark field as touched
    setTouchedFields((prev) => new Set([...prev, id]));

    // IMAGE upload flow
    if (id === "image" && files && files[0]) {
      const file = files[0];
      console.log("Image file selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Client-side validations
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: `Only ${allowedTypes.join(", ")} files are allowed`,
        }));
        target.value = "";
        setImagePreview(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: `File size must be less than 5MB`,
        }));
        target.value = "";
        setImagePreview(null);
        return;
      }

      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clear previous errors
      setErrors((prev) => ({ ...prev, image: undefined }));
      setIsUploading(true);

      try {
        const uploadedUrl = await uploadToCloudinary(file);
        if (!uploadedUrl || typeof uploadedUrl !== "string") {
          throw new Error("Invalid URL returned from upload");
        }

        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        setImagePreview(uploadedUrl); // Show uploaded image
      } catch (uploadError: any) {
        console.error("Upload failed:", uploadError);
        setErrors((prev) => ({
          ...prev,
          image:
            uploadError?.message || "Image upload failed. Please try again.",
        }));
        setImagePreview(null);
        target.value = "";
      } finally {
        setIsUploading(false);
      }

      return; // Prevent default field update
    } else {
      // Handle other form fields (text, textarea, etc.)
      setFormData((prev) => ({ ...prev, [id]: value }));

      // Log other field changes for debugging
      console.log(`📝 Field ${id} updated:`, value);
    }
  };
  const handleSelectChange = (value: string) => {
    setTouchedFields((prev) => new Set([...prev, "category"]));
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]));
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1 && isCurrentStepValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    // Allow navigation to previous steps or if current step is valid
    if (stepIndex <= currentStep || isCurrentStepValid) {
      setCurrentStep(stepIndex);
    }
  };

  // Comprehensive form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    // Additional cross-field validation
    const allContactDetections = [
      ...detectContactInfo(formData.title),
      ...detectContactInfo(formData.description),
    ];

    if (allContactDetections.length > 0) {
      const highSeverityDetections = allContactDetections.filter(
        (d) => d.severity === "high"
      );
      if (highSeverityDetections.length > 0) {
        newErrors.general = t(
          "tender_contains_contact_information_please_remove_all_contact_details"
        );
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  const { user } = useAuth();

  const handleSubmission = async (isDraft: boolean) => {
    setSubmissionType(isDraft ? "draft" : "post");
    setIsSubmitting(true);
    setErrors({});

    console.log("🚀 Form submission started");
    console.log("📋 Current formData:", formData);

    // For post, mark all fields as touched and validate
    if (!isDraft) {
      setTouchedFields(new Set(Object.keys(formData)));
      if (!validateForm()) {
        console.error("❌ Form validation failed");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Prepare payload, allowing partial for drafts
      const payload = {
        title: formData.title.trim() || "",
        description: formData.description.trim() || "",
        category: formData.category || null,
        location: formData.location.trim() || "",
        contactEmail: formData.contactEmail.trim() || "",
        estimatedBudget: formData.estimatedBudget
          ? parseFloat(formData.estimatedBudget)
          : null,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : null,
        image: formData.image || null,
      };

      console.log("📤 Payload being sent:", payload);
      console.log("🖼️ Image in payload:", {
        value: payload.image,
        type: typeof payload.image,
        length: payload.image?.length,
        isNull: payload.image === null,
        isEmpty: payload.image === "",
        isUndefined: payload.image === undefined,
      });

      // Call the appropriate API
      const result = isDraft
        ? await createTenderDraft(payload)
        : await createTender(payload);
      console.log("✅ Tender created successfully:", result);
      console.log("🖼️ Created tender image value:", result.image);

      // Show success animation
      setShowSuccess(true);

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          estimatedBudget: "",
          deadline: "",
          location: "",
          contactEmail: "",
          image: "", // Reset to empty string
        });
        setTouchedFields(new Set());
        setErrors({});
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setShowSuccess(false);
        setSubmissionType(null);

        onOpenChange(false);
        router.push(
          user?.userType !== "business"
            ? "/dashboard/my-tenders"
            : "/business-dashboard/my-tenders"
        );
      }, 3000);
    } catch (error) {
      console.error("💥 Tender creation failed:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: error.response may exist on some error types
        console.error("📋 Error details:", error.response?.data);
      }

      setShowSuccess(false);
      let errorMessage = isDraft
        ? t("failed_to_save_draft_please_try_again")
        : t("failed_to_create_tender_please_try_again");
      if (typeof error === "object" && error !== null) {
        if (
          "response" in error &&
          typeof (error as any).response === "object" &&
          (error as any).response !== null
        ) {
          errorMessage = (error as any).response?.data?.message || errorMessage;
        } else if (
          "message" in error &&
          typeof (error as any).message === "string"
        ) {
          errorMessage = (error as any).message || errorMessage;
        }
      }
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleSubmission(false);
  };

  const handleSaveDraft = () => {
    handleSubmission(true);
  };

  // Loading and Success Screen Component
  const LoadingSuccessScreen = () => {
    if (!isSubmitting && !showSuccess) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-200 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center">
            {isSubmitting && !showSuccess ? (
              // Loading State
              <motion.div className="space-y-6">
                {/* Animated Logo/Icon */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <FileText className="w-10 h-10 text-white" />
                </motion.div>

                {/* Loading Text */}
                <div className="space-y-3">
                  <motion.h3
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {submissionType === "draft"
                      ? t("saving_your_draft")
                      : t("creating_your_tender")}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("please_wait_while_we_process_your_request")}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>

                {/* Loading Steps */}
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [0, 1] }}
                      transition={{ delay: 0.5 }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    {t("validating_information")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [0, 1] }}
                      transition={{ delay: 1 }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    {t("processing_submission")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [0, 1] }}
                      transition={{ delay: 1.5 }}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    />
                    {t("finalizing_tender")}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              // Success State
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>

                {/* Success Text */}
                <div className="space-y-3">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {submissionType === "draft"
                      ? t("draft_saved_successfully")
                      : t("tender_created_successfully")}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {t("redirecting_to_your_tenders")}
                  </motion.p>
                </div>

                {/* Success Effects */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2 text-sm text-green-600 dark:text-green-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {submissionType === "draft"
                      ? t("draft_information_saved")
                      : t("tender_information_saved")}
                  </div>
                  {submissionType === "post" && (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("notifications_sent_to_relevant_contractors")}
                    </div>
                  )}
                </motion.div>

                {/* Confetti Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                      }}
                      animate={{
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`,
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case "basic":
        return (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Title Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="title"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("tender_title")} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur("title")}
                placeholder={t("enter_descriptive_title_for_your_tender")}
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.title ? "border-red-500" : ""
                }`}
                maxLength={VALIDATION_RULES.title.max + 10}
              />
              <div className="h-5 mt-1">
                {fieldErrors.title ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.title}
                  </motion.p>
                ) : (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {formData.title.length}/{VALIDATION_RULES.title.max}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="description"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("description")} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                placeholder={t(
                  "provide_detailed_requirements_scope_and_expectations"
                )}
                rows={6}
                className={`rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.description ? "border-red-500" : ""
                }`}
                maxLength={VALIDATION_RULES.description.max + 50}
              />
              <div className="h-5 mt-1">
                {fieldErrors.description ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.description}
                  </motion.p>
                ) : (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {t(
                        "note_do_not_include_contact_information_in_title_or_description"
                      )}
                    </span>
                    <span>
                      {formData.description.length}/
                      {VALIDATION_RULES.description.max}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case "details":
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Category Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="category"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("category")} *
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger
                  className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 ${
                    fieldErrors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder={t("select_a_category")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-5 mt-1">
                {fieldErrors.category ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.category}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("choose_the_most_relevant_category")}
                  </p>
                )}
              </div>
            </div>

            {/* Budget Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="estimatedBudget"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("estimated_budget_qar")} {/* ← no asterisk */}
              </Label>
              <Input
                id="estimatedBudget"
                type="number"
                value={formData.estimatedBudget}
                onChange={handleChange}
                onBlur={() => handleBlur("estimatedBudget")}
                placeholder={t("optional_enter_your_budget")}
                min="1"
                max={VALIDATION_RULES.estimatedBudget.max}
                step="0.01"
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.estimatedBudget ? "border-red-500" : ""
                }`}
              />
              <div className="h-5 mt-1">
                {fieldErrors.estimatedBudget ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.estimatedBudget}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("leave_blank_if_budget_is_negotiable")}
                  </p>
                )}
              </div>
            </div>

            {/* Budget Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                {t("budget_guidelines")}
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• {t("be_realistic_with_your_budget_estimates")}</li>
                <li>• {t("consider_all_project_costs_and_requirements")}</li>
                <li>• {t("competitive_budgets_attract_more_proposals")}</li>
              </ul>
            </div>
          </motion.div>
        );

      case "schedule":
        return (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Deadline Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="deadline"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("deadline")} *
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                onBlur={() => handleBlur("deadline")}
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.deadline ? "border-red-500" : ""
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              <div className="h-5 mt-1">
                {fieldErrors.deadline ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.deadline}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("when_do_you_need_this_project_completed")}
                  </p>
                )}
              </div>
            </div>

            {/* Location Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="location"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("location")} *
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                onBlur={() => handleBlur("location")}
                placeholder="West Bay, Doha, Qatar"
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.location ? "border-red-500" : ""
                }`}
                maxLength={VALIDATION_RULES.location.max + 10}
              />
              <div className="h-5 mt-1">
                {fieldErrors.location ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.location}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("where_will_this_project_take_place")}
                  </p>
                )}
              </div>
            </div>

            {/* Timeline Tips */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                {t("timeline_tips")}
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• {t("allow_sufficient_time_for_quality_work")}</li>
                <li>• {t("consider_revision_and_approval_time")}</li>
                <li>• {t("rush_projects_may_receive_fewer_proposals")}</li>
              </ul>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Contact Email Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="contactEmail"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("contact_email")} *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                onBlur={() => handleBlur("contactEmail")}
                placeholder="contact@example.com"
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.contactEmail ? "border-red-500" : ""
                }`}
              />
              <div className="h-5 mt-1">
                {fieldErrors.contactEmail ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.contactEmail}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("this_email_will_be_used_for_proposal_communications")}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="relative grid gap-1">
              <Label
                htmlFor="image"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("upload_image_optional")}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                onBlur={() => handleBlur("image")}
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.image ? "border-red-500" : ""
                }`}
              />
              <div className="h-5 mt-1">
                {fieldErrors.image ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.image}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-400">
                    {t("max_file_size_5mb_supported_formats_jpg_jpeg_png")}
                  </p>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                {t("tender_preview")}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">{t("title")}:</span>{" "}
                  <span className="font-medium">
                    {formData.title || t("not_set")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{t("category")}:</span>{" "}
                  <span className="font-medium">
                    {CATEGORIES.find((c) => c._id === formData.category)
                      ?.name || t("not_set")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{t("budget")}:</span>{" "}
                  <span className="font-medium">
                    {formData.estimatedBudget
                      ? `${formData.estimatedBudget} QAR`
                      : t("negotiable")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{t("location")}:</span>{" "}
                  <span className="font-medium">
                    {formData.location || t("not_set")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{t("deadline")}:</span>{" "}
                  <span className="font-medium">
                    {formData.deadline
                      ? new Date(formData.deadline).toLocaleDateString()
                      : t("not_set")}
                  </span>
                </div>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Tender preview"
                        className="w-full max-w-sm h-64 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                        const input = document.getElementById(
                          "image"
                        ) as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <DialogContent className="max-w-4xl max-h-[75vh] overflow-y-auto bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-8 border-none">
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Card className="w-full border-none shadow-none bg-transparent">
                  {/* Header */}
                  <CardHeader className="mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <CardTitle className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white text-center">
                        {t("create_new_tender")}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 text-center">
                        {STEPS[currentStep].description}
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  {/* Step Indicator */}

                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6"
                    >
                      <Alert className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.general}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <AnimatePresence mode="wait">
                        {renderStepContent()}
                      </AnimatePresence>
                    </CardContent>

                    {/* Footer Navigation */}
                    <CardFooter className="flex justify-between items-center mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        disabled={currentStep === 0 || isSubmitting}
                        className="rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2 flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t("previous")}
                      </Button>

                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("step")} {currentStep + 1} {t("of")} {STEPS.length}
                      </div>

                      {currentStep < STEPS.length - 1 ? (
                        <Button
                          type="button"
                          onClick={goToNextStep}
                          disabled={!isCurrentStepValid || isSubmitting}
                          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t("next")}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className="rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2 flex items-center gap-2 disabled:opacity-50"
                          >
                            {t("save_as_draft")}
                          </Button>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Button
                              type="submit"
                              className="rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 px-6 py-2 disabled:opacity-50"
                              disabled={isSubmitting || !isCurrentStepValid}
                            >
                              {isSubmitting ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              {isSubmitting ? t("posting") : t("post_tender")}
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Loading and Success Screen */}
      <AnimatePresence>
        <LoadingSuccessScreen />
      </AnimatePresence>
    </>
  );
};

export default CreateTenderModal;
