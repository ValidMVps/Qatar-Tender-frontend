"use client";

import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Plus,
  Minus,
  Menu,
  X,
  Star,
  FileText,
  Shield,
  BarChart3,
  Users,
  Clock,
  Globe2,
  UserPlus,
  Search,
  Award,
  FilePlus,
  Cloud,
  Lock,
  Layers,
} from "lucide-react";
import Image from "next/image";
import logo from "../media/logo.png";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0)",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b border-[#d2d2d7]/50" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <a href="/">
              <Image
                src={logo}
                alt="GoTenderly Logo"
                width={160}
                height={48}
                className="object-contain"
              />
            </a>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-[#1d1d1f] hover:text-[#38b6ff] transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="px-4 py-2 text-[#38b6ff] hover:bg-[#38b6ff]/5 rounded-full transition-colors"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-[#38b6ff] hover:bg-[#0077ed] text-white rounded-full transition-colors"
              >
                Get started
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#38b6ff]/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.28 }}
        className="md:hidden overflow-hidden bg-white/97 backdrop-blur-xl border-b border-[#d2d2d7]"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-[#1d1d1f] hover:text-[#38b6ff] transition-colors"
            >
              {item.name}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <a
              href="/login"
              className="flex-1 py-2 rounded-full border border-[#d2d2d7] hover:bg-[#f5f5f7] text-center"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="flex-1 py-2 bg-[#38b6ff] rounded-full text-white hover:bg-[#0077ed] text-center"
            >
              Get started
            </a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}

/* -------------------------------- Hero ------------------------------------ */
function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: "Project Details",
      fields: ["Project Name", "Category", "Budget Range"],
    },
    {
      id: 2,
      title: "Requirements",
      fields: ["Description", "Timeline", "Delivery Location"],
    },
    {
      id: 3,
      title: "Documents",
      fields: ["Upload Specs", "Tender Terms", "Prequalification"],
    },
  ];

  const nextStep = () =>
    currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
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
                GoTenderly is a secure e‑tendering platform for Qatari
                organisations — KYC‑verified suppliers, audit-ready workflows,
                and built‑in evaluation tools to shorten procurement cycles.
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

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-[28px] shadow-2xl border border-[#d2d2d7] p-8 sm:p-10 backdrop-blur-xl">
              {/* Progress */}
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

              {/* Form fields (visual only on landing) */}
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
                      key={field}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-[#6e6e73]">
                        {field}
                      </label>
                      <div className="h-12 bg-[#f5f5f7] rounded-xl border border-transparent hover:border-[#38b6ff]/20 transition-colors" />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

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
                  onClick={() => {
                    if (currentStep === steps.length - 1)
                      router.push("/signup");
                    else nextStep();
                  }}
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

/* ----------------------------- TrustedBy ---------------------------------- */
function TrustedBy() {
  const partners = [
    { name: "Ministry of Commerce", width: "w-32" },
    { name: "Qatar Energy", width: "w-28" },
    { name: "Ashghal", width: "w-24" },
    { name: "Kahramaa", width: "w-32" },
    { name: "Hamad Medical", width: "w-28" },
    { name: "Qatar Airways", width: "w-32" },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#d2d2d7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-lg text-[#86868b] font-medium">
            Used by public and private sector teams across Qatar
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center justify-center"
            >
              <div
                className={`${p.width} h-12 bg-[#f5f5f7] rounded-xl flex items-center justify-center hover:bg-[#e8e8ed] transition-colors`}
              >
                <span className="text-xs font-medium text-[#86868b] text-center px-2">
                  {p.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Features --------------------------------- */
function Features() {
  const features = [
    {
      icon: FileText,
      title: "Tender Lifecycle",
      description:
        "Create, publish and manage tenders with templated workflows, automatic timelines and versioned documents.",
    },
    {
      icon: Shield,
      title: "KYC & Compliance",
      description:
        "Verified supplier onboarding, document checks and compliance with Qatari procurement policies.",
    },
    {
      icon: BarChart3,
      title: "Evaluation & Analytics",
      description:
        "Configurable scorecards, weighted evaluation and audit-ready reports for procurement committees.",
    },
    {
      icon: Users,
      title: "Multi-Role Dashboards",
      description:
        "Separate views for buyers, suppliers and admins with role-based access controls.",
    },
    {
      icon: Clock,
      title: "Real‑time Notifications",
      description:
        "Bid alerts, timeline reminders and status updates through email and in-app notifications.",
    },
    {
      icon: Globe2,
      title: "Bilingual & Localized",
      description:
        "Full Arabic and English interfaces, QAR currency support and localized date formats.",
    },
    {
      icon: FilePlus,
      title: "Secure Document Hub",
      description:
        "Document versioning, secure downloads and optional e‑sign integration for contract execution.",
    },
    {
      icon: Lock,
      title: "Bid Security & EMD",
      description:
        "Support for bid bonds / EMD management and secure escrow workflows.",
    },
    {
      icon: Cloud,
      title: "Integrations & API",
      description:
        "CSV/Excel imports, REST APIs and SSO for enterprise integrations.",
    },
    {
      icon: Layers,
      title: "Prequalification",
      description:
        "Pre‑qualify suppliers with PQ questionnaires and pass/fail rules for quick shortlist generation.",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            A procurement platform built for results.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Everything buyers and suppliers need to run compliant tenders — from
            publishing to award and audit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white rounded-[24px] p-8 h-full border border-[#d2d2d7] hover:border-[#38b6ff]/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#38b6ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-base text-[#6e6e73] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- HowItWorks --------------------------------- */
function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Onboard & Verify",
      description:
        "Suppliers register, upload licences and company documents — automated KYC reduces manual checks.",
    },
    {
      icon: FileText,
      title: "Publish or Search",
      description:
        "Buyers publish tenders with templates; suppliers discover opportunities with advanced filters and saved searches.",
    },
    {
      icon: Search,
      title: "Submit & Evaluate",
      description:
        "Suppliers submit bids and documents; evaluation panels use scorecards to produce objective, auditable results.",
    },
    {
      icon: Award,
      title: "Award & Execute",
      description:
        "Award contracts, handle EMD releases and finalise agreements with document signing and payment options in QAR.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            How it works.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Four clear steps to close procurement faster and with full
            compliance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 mx-auto mb-6 bg-[#38b6ff] rounded-2xl flex items-center justify-center"
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f5f7] text-[#86868b] text-sm font-semibold mb-3">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">
                    {s.title}
                  </h3>
                </div>
                <p className="text-base text-[#6e6e73] leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Stats ----------------------------------- */
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);
  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current)
        ref.current.textContent = Math.floor(latest).toLocaleString();
    });
  }, [springValue]);

  return (
    <>
      <span ref={ref}>0</span>
      <span>{suffix}</span>
    </>
  );
}

function Stats() {
  const stats = [
    { value: 1_250, suffix: "+", label: "Active Tenders" },
    { value: 3_800, suffix: "+", label: "Verified Suppliers" },
    { value: 92, suffix: "%", label: "Award Accuracy" },
    { value: 120, suffix: "M+", label: "QAR Facilitated" },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Trusted across Qatar.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Real procurement outcomes for public and private sector teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl font-semibold text-[#38b6ff] mb-2">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-base text-[#6e6e73]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Pricing ---------------------------------- */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "For local suppliers and small tenders",
      price: "Free",
      period: "",
      features: [
        "5 active bids / month",
        "Basic supplier profile",
        "Email notifications",
        "Community support",
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For procurement teams and growing suppliers",
      price: "1,499",
      period: "/month",
      features: [
        "Unlimited bids",
        "Verified badge & PQ tools",
        "Advanced analytics & exports",
        "Priority support",
        "API access",
      ],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For large organisations and ministries",
      price: "Custom",
      period: "",
      features: [
        "SLA & custom integrations",
        "White‑label portals",
        "Dedicated onboarding",
        "24/7 support",
        "Custom security reviews",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Simple predictable pricing.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Plans for suppliers, procurement teams and enterprise customers —
            pricing in QAR, billing monthly or annually.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative"
            >
              {p.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#38b6ff] text-white text-xs font-medium px-4 py-1.5 rounded-full">
                    Most popular
                  </span>
                </div>
              )}
              <div
                className={`h-full bg-white rounded-[28px] p-8 border-2 transition-all ${
                  p.highlighted
                    ? "border-[#38b6ff] shadow-xl scale-105"
                    : "border-[#d2d2d7] hover:border-[#38b6ff]/30"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[#86868b]">{p.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {p.price !== "Custom" && p.price !== "Free" && (
                      <span className="text-lg text-[#86868b]">QAR</span>
                    )}
                    <span className="text-5xl font-semibold text-[#1d1d1f]">
                      {p.price}
                    </span>
                    {p.period && (
                      <span className="text-lg text-[#86868b]">{p.period}</span>
                    )}
                  </div>
                </div>

                <button
                  className={`w-full h-12 rounded-xl font-medium mb-8 ${
                    p.highlighted
                      ? "bg-[#38b6ff] hover:bg-[#0077ed] text-white"
                      : "bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]"
                  }`}
                >
                  {p.cta}
                </button>

                <div className="space-y-4">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#38b6ff] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#1d1d1f]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ------------------------------- */
function Testimonials() {
  const testimonials = [
    {
      name: "Ahmed Al‑Kuwari",
      role: "Procurement Director",
      company: "Qatar Energy",
      content:
        "GoTenderly reduced tender cycle time by 40% and improved transparency across teams.",
      rating: 5,
    },
    {
      name: "Fatima Hassan",
      role: "Supply Chain Manager",
      company: "Hamad Medical Corporation",
      content:
        "Scorecards and audit logs made regulatory reporting simpler and faster.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Trusted by procurement teams.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Hear from buyers and suppliers using GoTenderly to run compliant
            tenders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-[#fbfbfd] rounded-[24px] p-8 h-full border border-[#d2d2d7]">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#38b6ff] text-[#38b6ff]"
                    />
                  ))}
                </div>
                <p className="text-base text-[#1d1d1f] leading-relaxed mb-6">
                  "{t.content}"
                </p>
                <div>
                  <p className="font-semibold text-[#1d1d1f]">{t.name}</p>
                  <p className="text-sm text-[#6e6e73]">{t.role}</p>
                  <p className="text-sm text-[#38b6ff]">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- FAQ ------------------------------------ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      question: "How do you verify suppliers?",
      answer:
        "We run company document checks, ID verification, and manual review where required. Verified suppliers receive a public badge and prequalification status.",
    },
    {
      question: "Can we import existing tender lists?",
      answer:
        "Yes — buyers can bulk import tenders and vendor lists via CSV/Excel and map fields to templates.",
    },
    {
      question: "Is GoTenderly compliant with Qatar regulations?",
      answer:
        "Yes — the platform is built to support common Qatari procurement workflows and provides exportable audit trails for regulator review.",
    },
    {
      question: "What payment options are available?",
      answer:
        "Payments and EMD handling are supported via bank transfer and partner payment providers in QAR. Enterprise customers can enable escrow workflows.",
    },
    {
      question: "How long does supplier verification take?",
      answer:
        "Typical KYC review is 1–3 business days once all documents are submitted; urgent verifications are available for enterprise customers.",
    },
  ];

  const toggleFAQ = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Frequently asked.
          </h2>
          <p className="text-xl text-[#6e6e73]">
            Answers to common questions about security, compliance and
            onboarding.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full bg-white rounded-[20px] p-6 border border-[#d2d2d7] hover:border-[#38b6ff]/30 transition-all text-left"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-[#1d1d1f] pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    {openIndex === i ? (
                      <Minus className="w-5 h-5 text-[#38b6ff]" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#38b6ff]" />
                    )}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#6e6e73] leading-relaxed mt-4 pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ------------------------------------ */
function CTA() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#38b6ff] to-[#0077ed] rounded-[48px] p-12 sm:p-16 lg:p-20">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight"
              >
                Ready to run compliant tenders?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
              >
                Book a demo with our procurement specialists or start a free
                trial and publish your first tender today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/signup"
                  className="bg-white text-[#38b6ff] hover:bg-white/90 rounded-full px-8 h-14 text-lg font-medium shadow-lg flex items-center gap-2"
                >
                  Get started free <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/demo"
                  className="text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg font-medium border-2 border-white/30"
                >
                  Schedule demo
                </motion.a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-sm text-white/70 mt-8"
              >
                No credit card required • Free 14‑day trial • Enterprise
                onboarding available
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- Footer ---------------------------------- */
function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How it works", href: "#how-it-works" },
      { name: "Testimonials", href: "#testimonials" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Privacy", href: "#privacy" },
      { name: "Terms", href: "#terms" },
      { name: "Compliance", href: "#compliance" },
    ],
  };

  return (
    <footer className="bg-[#fbfbfd] border-t border-[#d2d2d7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#38b6ff] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">GT</span>
              </div>
              <span className="text-lg font-semibold text-[#1d1d1f]">
                GoTenderly
              </span>
            </div>
            <p className="text-[#6e6e73] leading-relaxed max-w-sm">
              A secure e‑tendering platform for Qatar — built for procurement
              teams, suppliers and regulators.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-[#1d1d1f] mb-4 capitalize">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className="text-sm text-[#6e6e73] hover:text-[#38b6ff] transition-colors"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d2d2d7] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6e6e73]">
              © {new Date().getFullYear()} GoTenderly. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-[#6e6e73] hover:text-[#38b6ff] transition-colors"
              >
                English
              </a>
              <a
                href="#"
                className="text-[#6e6e73] hover:text-[#38b6ff] transition-colors"
              >
                العربية
              </a>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#38b6ff] rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#0077ed]"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 PAGE EXPORT                                */
/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Stats />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
