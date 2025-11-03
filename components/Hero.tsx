"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* -------------------------------- Hero ------------------------------------ */
function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectName: "",
    category: "",
    budgetRange: "",
    description: "",
    timeline: "",
    deliveryLocation: "",
    uploadSpecs: "",
    tenderTerms: "",
    prequalification: "",
  });

  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: "Project Details",
      fields: [
        { name: "projectName", label: "Project Name", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "budgetRange", label: "Budget Range", type: "text" },
      ],
    },
    {
      id: 2,
      title: "Requirements",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "timeline", label: "Timeline", type: "text" },
        { name: "deliveryLocation", label: "Delivery Location", type: "text" },
      ],
    },
    {
      id: 3,
      title: "Documents",
      fields: [
        { name: "uploadSpecs", label: "Upload Specs", type: "file" },
        { name: "tenderTerms", label: "Tender Terms", type: "file" },
        { name: "prequalification", label: "Prequalification", type: "file" },
      ],
    },
  ];

  const handleChange = (e: any) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () =>
    currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    router.push("/signup");
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ---------------- Left Side ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.05]">
                Procurement built for Qatar.
                <br />
                <span className="text-[#38b6ff]">
                  Compliant. Transparent. Faster.
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-[#6e6e73] font-normal leading-relaxed max-w-xl">
                GoTenderly is a secure e-tendering platform for Qatari
                organisations — KYC-verified suppliers, audit-ready workflows,
                and built-in evaluation tools to shorten procurement cycles.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/signup"
                className="px-6 h-12 bg-[#38b6ff] hover:bg-[#0077ed] text-white rounded-full font-medium shadow-sm flex items-center gap-2"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/demo"
                className="px-6 h-12 text-[#38b6ff] hover:bg-[#38b6ff]/5 rounded-full font-medium"
              >
                Schedule demo
              </motion.a>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm text-[#6e6e73]">
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

          {/* ---------------- Right Side (Form) ---------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-[28px] shadow-2xl border border-[#d2d2d7] p-8 sm:p-10 backdrop-blur-xl">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8">
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
                        className="h-0.5 w-12 sm:w-16 mx-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Fields */}
              <AnimatePresence mode="wait">
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
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder={field.label}
                          className="w-full h-24 bg-[#f5f5f7] rounded-xl border border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff] focus:ring-0 px-4 py-3 text-sm outline-none transition-colors"
                        />
                      ) : field.type === "file" ? (
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleChange}
                          className="w-full h-12 bg-[#f5f5f7] rounded-xl border border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#38b6ff] file:text-white file:text-sm text-sm outline-none transition-colors"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder={field.label}
                          className="w-full h-12 bg-[#f5f5f7] rounded-xl border border-transparent hover:border-[#38b6ff]/20 focus:border-[#38b6ff] focus:ring-0 px-4 text-sm outline-none transition-colors"
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 h-12 rounded-xl text-[#38b6ff] hover:bg-[#38b6ff]/5"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() =>
                    currentStep === steps.length - 1
                      ? handleSubmit()
                      : nextStep()
                  }
                  className="flex-1 bg-[#38b6ff] hover:bg-[#0077ed] text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  {currentStep === steps.length - 1
                    ? "Create account"
                    : "Continue"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-center text-xs text-[#86868b] mt-6">
                {currentStep === steps.length - 1
                  ? "Create an account to publish or respond to tenders"
                  : `Step ${currentStep + 1} of ${steps.length}`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
