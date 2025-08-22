"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  Edit3,
} from "lucide-react";

import { useTranslation } from "../lib/hooks/useTranslation";
import { getTender, updateTender } from "@/app/services/tenderService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { detectContactInfo, VALIDATION_RULES } from "@/utils/validationcehck";
import { getCategories } from "@/app/services/categoryService";

// Constants for validation

// Step configuration
const STEPS = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Update tender title and description",
    icon: FileText,
    fields: ["title", "description"],
  },
  {
    id: "details",
    title: "Project Details",
    description: "Update category and budget information",
    icon: DollarSign,
    fields: ["category", "estimatedBudget"],
  },
  {
    id: "schedule",
    title: "Schedule & Location",
    description: "Update deadline and project location",
    icon: Calendar,
    fields: ["deadline", "location"],
  },
  {
    id: "contact",
    title: "Contact & Final Details",
    description: "Update contact information and image",
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

interface EditTenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId?: string | null;
  onUpdated?: (updatedTender: any) => void;
}

const ReopenTenderModal = ({
  open,
  onOpenChange,
  tenderId,
  onUpdated,
}: EditTenderModalProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [CATEGORIES, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    estimatedBudget: "",
    deadline: "",
    location: "",
    contactEmail: "",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Fetch categories
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

  // Fetch existing tender data
  useEffect(() => {
    let mounted = true;
    const fetchTender = async () => {
      if (!tenderId || !open) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrors({});

      try {
        const data = await getTender(tenderId);
        if (!mounted) return;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category?._id || data.category || "",
          estimatedBudget: data.estimatedBudget
            ? String(data.estimatedBudget)
            : "",
          location: data.location || "",
          contactEmail: data.contactEmail || data.postedBy?.email || "",
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 16)
            : "",
          image: data.image || "",
        });
      } catch (err: any) {
        console.error("Failed to load tender for edit:", err);
        setErrors({
          general:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load tender",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTender();
    return () => {
      mounted = false;
    };
  }, [open, tenderId]);

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
          if (!value) return t("estimated_budget_is_required");
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
    [t, detectContactInfo]
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
      return !error && (field === "image" || value);
    });
  }, [currentStep, formData, validateField]);

  // Handle field changes
  const handleChange = async (e: { target: any }) => {
    const target = e.target;
    const { id, value, files } = target;

    setTouchedFields((prev) => new Set([...prev, id]));

    if (id === "image" && files && files[0]) {
      const file = files[0];

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: `Only ${allowedTypes.join(", ")} files are allowed`,
        }));
        target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: `File size must be less than ${maxSize / 1024 / 1024}MB`,
        }));
        target.value = "";
        return;
      }

      setErrors((prev) => ({ ...prev, image: undefined }));
      setIsUploading(true);

      try {
        const uploadedUrl = await uploadToCloudinary(file);
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        setErrors((prev) => ({ ...prev, image: undefined }));
      } catch (uploadError: any) {
        setErrors((prev) => ({
          ...prev,
          image:
            uploadError?.message || "Image upload failed. Please try again.",
        }));
        target.value = "";
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
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

  // Form validation
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

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!tenderId) {
      setErrors({ general: "Tender ID is missing" });
      setIsSubmitting(false);
      return;
    }

    setTouchedFields(new Set(Object.keys(formData)));

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Build JSON payload
      const payload: Record<string, any> = {
        title: formData.title?.trim(),
        description: formData.description?.trim(),
        location: formData.location?.trim(),
        contactEmail: formData.contactEmail?.trim(),
        estimatedBudget: formData.estimatedBudget,
        deadline: formData.deadline,
        category: formData.category,
      };

      // Only include `image` if you plan to send its URL/base64 string.
      if (formData.image && typeof formData.image === "string") {
        payload.image = formData.image;
      }

      // Call your service (should send JSON)
      const updated = await updateTender(tenderId, payload);

      setShowSuccess(true);

      setTimeout(() => {
        onUpdated?.(updated);
        setShowSuccess(false);
        onOpenChange(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setTouchedFields(new Set());
        setErrors({});
      }, 2000);
    } catch (error: any) {
      console.error("Failed to update tender:", error);
      setShowSuccess(false);
      setErrors({
        general:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update tender",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <motion.div className="space-y-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <Edit3 className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-3">
                  <motion.h3
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {t("updating_your_tender")}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("please_wait_while_we_process_your_changes")}
                  </p>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("tender_updated_successfully")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("your_changes_have_been_saved")}
                  </p>
                </div>
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
                    <span>{t("be_descriptive_and_specific")}</span>
                    <span>
                      {formData.title.length}/{VALIDATION_RULES.title.max}
                    </span>
                  </div>
                )}
              </div>
            </div>

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

            <div className="relative grid gap-1">
              <Label
                htmlFor="estimatedBudget"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("estimated_budget_qar")} *
              </Label>
              <Input
                id="estimatedBudget"
                type="number"
                value={formData.estimatedBudget}
                onChange={handleChange}
                onBlur={() => handleBlur("estimatedBudget")}
                placeholder="1500"
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
                    {t("provide_your_estimated_budget_in_qar")}
                  </p>
                )}
              </div>
            </div>

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

            <div className="relative grid gap-1">
              <Label
                htmlFor="image"
                className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-1 text-gray-500 text-sm"
              >
                {t("update_image_optional")}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                onBlur={() => handleBlur("image")}
                disabled={isUploading}
                className={`rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  fieldErrors.image ? "border-red-500" : ""
                } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              <div className="h-5 mt-1">
                {isUploading ? (
                  <p className="text-xs text-blue-600">Uploading image...</p>
                ) : fieldErrors.image ? (
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

            {/* Current Image Preview */}
            {formData.image && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Current Image
                </h4>
                <div className="flex items-center justify-center">
                  <img
                    src={formData.image}
                    alt="Current tender image"
                    className="max-w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
            )}

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
                      : t("not_set")}
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
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Loading screen for initial data fetch
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-8 border-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Loading Tender Details
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Please wait while we fetch the tender information...
              </p>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <DialogContent className="max-w-4xl max-h-[79vh] overflow-y-auto bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-8 border-none">
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
                        {t("reopen_tender")}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 text-center">
                        {STEPS[currentStep].description}
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  {/* Step Indicator */}

                  {/* Error Display */}
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

                  <form onSubmit={handleSubmit} className="">
                    <CardContent className="">
                      <AnimatePresence mode="wait">
                        {renderStepContent()}
                      </AnimatePresence>
                    </CardContent>

                    {/* Footer Navigation */}
                    <CardFooter className="flex justify-between items-center mt-6 ">
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
                            {isSubmitting ? t("updating") : t("update_tender")}
                          </Button>
                        </motion.div>
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

export default ReopenTenderModal;
