"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Shield,
  Users,
  Award,
  Briefcase,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Handshake,
  Calendar,
  Building2,
  Heart,
  Truck,
  Palette,
  Camera,
  Coffee,
  Wrench,
  HomeIcon,
  Laptop,
  Plus,
  Play,
  ChevronDown,
} from "lucide-react";
import logo from "../media/logo.png";
import Hero from "@/components/Hero";
import Navbarlanding from "@/components/Navbarladning";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import LenisScroll from "@/components/LenisWrapper";
import Footer from "@/components/Footer";
import tender1 from "../media/1.png";
import tender2 from "../media/2.png";
import tender3 from "../media/3.png";
import tender4 from "../media/4.png";
import tender5 from "../media/5.png";
import tender6 from "../media/6.png";
import Link from "next/link";
import aboutimage from "../media/unnamed (3).jpg";
import feature1 from "../media/unnamed.jpg";
import feature2 from "../media/unnamed (1).jpg";
import feature3 from "../media/unnamed2.jpg";
import feature4 from "../media/unnamed (4).jpg";

const features: {
  image: string;
  alt: string;
  title: string;
  description: string;
}[] = [
  {
    image: feature1.src,
    alt: "Multiple bidders illustration",
    title: "One-to-Many Quotes",
    description: "Post once, reach many bidders instantly.",
  },
  {
    image: feature2.src,
    alt: "Private chat illustration",
    title: "Private Chat & Negotiation",
    description: "Clarify details and negotiate without sharing identity.",
  },
  {
    image: feature3.src,
    alt: "Anonymous users illustration",
    title: "Anonymity by Default",
    description: "Both sides stay anonymous until award.",
  },
  {
    image: feature4.src,
    alt: "Verification badge illustration",
    title: "Profiles & Verification",
    description: "KYC/business verification and ratings for trust.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="self-stretch px-4 sm:px-16 py-16 md:py-24 lg:py-32 bg-Color-Scheme-1-Background flex flex-col justify-start items-center overflow-hidden"
    >
      <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-12">
        {/* ---------- Header ---------- */}
        <div className="w-full max-w-[768px] flex flex-col justify-start items-start gap-4">
          <h2 className="text-Color-Scheme-1-Text text-3xl sm:text-4xl md:text-5xl font-medium font-outfit leading-tight">
            Powerful tools for seamless Project Management
          </h2>
          <p className="text-Color-Scheme-1-Text text-base md:text-lg font-normal font-inter leading-7">
            Designed to simplify your projects and bidding experience.
          </p>
        </div>

        {/* ---------- Feature Cards ---------- */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <article
              key={idx}
              className="flex flex-col items-start bg-white/5 rounded-2xl -xs hover:-md transition-all overflow-hidden"
              aria-labelledby={`feature-${idx}-title`}
            >
              {/* Full-width image */}
              <div className="w-full h-48 relative">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Text content */}
              <div className="p-5 flex flex-col gap-3">
                <h3
                  id={`feature-${idx}-title`}
                  className="text-Color-Scheme-1-Text text-xl sm:text-2xl font-medium font-outfit leading-tight"
                >
                  {feature.title}
                </h3>
                <p className="text-Color-Scheme-1-Text text-sm md:text-base font-normal font-inter leading-6">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* ---------- CTA ---------- */}
        <div className="flex items-center gap-4 pt-2">
          <Link href="/signup">
            <div className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-Opacity-Neutral-Darkest-5 text-Color-Neutral-Darkest text-sm md:text-base font-medium font-inter hover:opacity-95 transition">
              Get started now
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  {
    label: "Post",
    title: "Post your tender",
    description:
      "Describe your requirements, set deadline, and publish instantly",
    linkText: "Post now",
    bgImage:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
  {
    label: "Receive & compare bids",
    title: "Receive and compare bids",
    description: "Get multiple quotes and compare them side by side",
    linkText: "Compare bids",
    bgImage:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
  {
    label: "Chat & award",
    title: "Chat and award",
    description:
      "Negotiate and award the tender, identities revealed only after award",
    linkText: "Award tender",
    bgImage:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
];

const tenderSteps = [
  {
    label: "Post",
    title: "Post your tender",
    description:
      "Describe your requirements, set deadline, and publish instantly.",
    linkText: "Post now",
    bgImage: tender1.src,
    href: "#hero",
  },
  {
    label: "Receive & compare bids",
    title: "Receive and compare bids",
    description: "Get multiple quotes and compare them side by side.",
    linkText: "Compare bids",
    bgImage: tender2.src,
    href: "#hero",
  },
  {
    label: "Chat & award",
    title: "Chat and award",
    description:
      "Negotiate and award the tender, identities revealed only after award.",
    linkText: "Award tender",
    bgImage: tender3.src,
    href: "#hero",
  },
];

const bidderSteps = [
  {
    label: "Discover",
    title: "Find relevant tenders",
    description: "Browse and explore tenders that match your business needs.",
    linkText: "Browse tenders",
    bgImage: tender4.src,
    href: "/tenders",
  },
  {
    label: "Prepare",
    title: "Prepare your quote",
    description:
      "Easily create and submit your quote to participate in tenders quickly.",
    linkText: "Create quote",
    bgImage: tender5.src,
    href: "/signup",
  },
  {
    label: "Submit",
    title: "Submit your bid securely",
    description:
      "Send a secure submission with audit trail and track status in one place.",
    linkText: "Submit bid",
    bgImage: tender6.src,
    href: "/signup",
  },
];

function Process() {
  const [tab, setTab] = useState<"tender" | "bidder">("tender");
  const steps = tab === "tender" ? tenderSteps : bidderSteps;

  return (
    <section
      id="process"
      className="px-4 sm:px-6 py-16 md:py-24 lg:py-32 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            How GoTenderly works
          </h2>

          {/* Tabs */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              role="tablist"
              aria-label="Process tabs"
              className="inline-flex rounded-md bg-white/30 p-1"
            >
              <button
                role="tab"
                aria-selected={tab === "tender"}
                onClick={() => setTab("tender")}
                className={`px-4 py-2 rounded-md text-sm md:text-base font-medium ${
                  tab === "tender"
                    ? "bg-white -sm text-Color-Scheme-1-Text"
                    : "text-muted-foreground hover:bg-white/60"
                } transition`}
              >
                Tenderer
              </button>
              <button
                role="tab"
                aria-selected={tab === "bidder"}
                onClick={() => setTab("bidder")}
                className={`px-4 py-2 rounded-md text-sm md:text-base font-medium ${
                  tab === "bidder"
                    ? "bg-white -sm text-Color-Scheme-1-Text"
                    : "text-muted-foreground hover:bg-white/60"
                } transition`}
              >
                Bidder
              </button>
            </div>
          </div>

          {/* Tab-specific intro */}
          <p className="mt-4 text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
            {tab === "tender"
              ? "Create detailed project specifications in minutes and receive qualified bids from verified suppliers."
              : "Browse tailored tender opportunities, prepare accurate quotes with templates and submit bids with confidence."}
          </p>
        </div>

        {/* Process Steps - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Link key={index} href={step.href || "#"} className="block">
              <div
                className="group relative min-h-[400px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px] rounded-md overflow-hidden -lg transition-transform hover:scale-[1.02]"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${step.bgImage}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs md:text-sm font-semibold font-inter uppercase tracking-wider opacity-90">
                      {step.label}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium font-outfit leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm md:text-base font-normal font-inter leading-relaxed opacity-95">
                    {step.description}
                  </p>
                  <button className="mt-6 flex items-center gap-2 text-white text-sm md:text-base font-medium font-inter leading-6 hover:gap-3 transition-all">
                    <span>{step.linkText}</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- HowItWorksDetailed --------------------------- */
function HowItWorksDetailed() {
  const steps = [
    {
      audience: "For tenderers (buyers)",
      items: [
        "Post your tender (title, category, deadline, optional budget, deliverables).",
        "Use Q/A to clarify specs or request revisions without revealing identity.",
        "Compare & shortlist side-by-side, then award the winner (identities reveal after award).",
      ],
    },
    {
      audience: "For bidders (suppliers)",
      items: [
        "Register & browse matching tenders.",
        "Submit your bid (price, ETA, terms, attachments); update anytime before the deadline.",
        "Negotiate privately until the tenderer awards; identities reveal post-award for contracting.",
      ],
    },
  ];
  return (
    <section
      id="how-it-works-detailed"
      className="py-16 md:py-24 lg:py-32 bg-[#fbfbfd]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4 leading-tight">
            How it works, step by step.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#6e6e73] max-w-2xl mx-auto leading-7">
            Clear actions for both tenderers and bidders.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.audience}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mb-6 leading-tight">
                {s.audience}
              </h3>
              <ol className="space-y-4">
                {s.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm md:text-base text-[#6e6e73] leading-6"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#38b6ff] text-white text-sm font-medium flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ------------------------------- */
function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-gray-50 py-16 md:py-24 lg:py-32 px-4 sm:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12">
          {/* Left Image */}
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="https://www.shutterstock.com/image-photo/positive-handsome-arabic-businessman-beard-600nw-2510267591.jpg"
                alt="Arabic businessman smiling in office"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          {/* Right Content */}
          <div className="flex flex-col justify-between h-full">
            {/* Centered Content */}
            <div className="flex flex-col justify-center flex-1">
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p className="text-2xl md:text-3xl leading-relaxed text-gray-900 mb-6 text-center md:text-left">
                “Our tender platform cut through bureaucratic barriers like a
                sharp knife through paper. We won contracts we never thought
                possible.”
              </p>
              {/* Author */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div>
                  <p className="font-medium text-base md:text-lg text-gray-900">
                    Michael Roberts
                  </p>
                  <p className="text-sm md:text-md text-gray-600">
                    CEO, Global Construction
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-900 text-5xl mx-3">|</span>
                  <svg
                    className="w-auto h-full text-gray-900"
                    viewBox="0 0 80 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10L5 10L10 5L15 15L20 0L25 10L30 10L35 5L40 15L45 0L50 10L55 10L60 5L65 15L70 0L75 10L80 10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="ml-1 text-xs md:text-sm font-medium text-gray-900">
                    Webflow
                  </span>
                </div>
              </div>
            </div>
            {/* Bottom Navigation */}
            <div className="flex items-center justify-between mt-12">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ------------------------------------ */
function CTA() {
  return (
    <section id="cta" className="py-16 md:py-24 lg:py-32 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-sm border border-white/10 bg-gray-100 p-8 sm:p-12 lg:p-20"
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-10"
            >
              Get better quotes without the back-and-forth.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="#hero">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 text-base md:text-lg font-medium flex items-center gap-2"
                >
                  Post your tender for free <ArrowRight className="w-5 h-5" />
                </motion.a>
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs md:text-sm text-white/60 mt-8 leading-5"
            >
              Anonymous until award • No fees • Takes ~2 minutes
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- About ---------------------------------- */
function About() {
  return (
    <section
      id="about"
      className="flex items-center justify-center min-h-screen px-4 sm:px-6 py-16 md:py-24 lg:py-32 bg-Color-Scheme-1-Background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
                Built for both Tenderers & Bidders
              </h2>
              <p className="text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
                Whether you're posting a project or competing for one our
                marketplace connects verified buyers and suppliers to make the
                tendering process transparent, fast, and fair.
              </p>
            </div>

            {/* For Tenderers & Bidders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg sm:text-xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
                  For Tenderers
                </h3>
                <p className="text-sm md:text-base font-normal font-inter text-Color-Scheme-1-Text leading-6">
                  Post once and reach verified bidders instantly. Compare
                  quotes, timelines, and offers side by side all while staying
                  anonymous until the award. Make faster, data-backed decisions.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-lg sm:text-xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
                  For Bidders
                </h3>
                <p className="text-sm md:text-base font-normal font-inter text-Color-Scheme-1-Text leading-6">
                  Access live tenders from real buyers, ask questions, and
                  submit bids that stand out. Manage proposals, negotiations,
                  and awards all in one secure workspace.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              {/* Tenderer CTA */}
              <Link href="#hero">
                <button className="px-5 py-3 bg-black text-white text-sm md:text-base font-medium font-inter rounded-md hover:bg-neutral-900 transition-all">
                  Post a Tender
                </button>
              </Link>

              {/* Bidder CTA */}
              <Link href="/tenders">
                <button className="px-5 py-3 bg-white text-black outline-1 outline-black/10 text-sm md:text-base font-medium font-inter rounded-md hover:bg-black/5 transition-all">
                  Browse Open Tenders
                </button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:block h-full">
            <img
              src={aboutimage.src}
              alt="Professional workspace"
              className="w-full h-full max-h-full object-cover rounded-md -lg"
            />
          </div>
        </div>

        {/* Mobile Image */}
        <div className="lg:hidden mt-12">
          <img
            src={aboutimage.src}
            alt="Professional workspace"
            className="w-full h-80 object-cover rounded-md -md"
          />
        </div>
      </div>
    </section>
  );
}

const smallServices = [
  {
    title: "Automotive services (repair, detailing, tires)",
    description:
      "HM’s SUV needs brake pads and a full detail. Not sure of fair pricing or downtime. HM posted the plate/model and preferred time window. Garages responded with parts options (OEM/aftermarket), ETAs, and warranty notes; a detailer asked in Q/A about interior shampoo vs. quick wash. HM picked a garage that offered pick-up/drop-off and a detail combo—problem solved in one go.",
    linkText: "Browse",
    bgImage:
      "https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/tenders?category=automotive",
  },
  {
    title: "Events (weddings, corporate, birthdays)",
    description:
      "MA is planning a small wedding in Al Wakrah: catering for 120, décor, DJ, and photo/video. Vendors were scattered and hard to coordinate. SA posted the budget range, menu style, and venue restrictions. Using Q/A, suppliers clarified power load and layout. SA quickly compared package breakdowns, shortlisted two, negotiated extras (LED dance floor), and awarded a single vendor bundle.",
    linkText: "View details",
    bgImage:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/tenders?category=events",
  },
  {
    title: "Construction & renovation (small works, fit-outs, repairs)",
    description:
      "AA wants a kitchen refresh—cabinet re-facing and new countertop. Past quotes were inconsistent and missed measurements. AB posted with drawings/photos and a rough timeline. Contractors used Q/A to ask about materials and site access; AB added dimensions. Comparable bids arrived with line-item costs and lead times. AB awarded one contractor and arranged a site visit after award.",
    linkText: "Compare now",
    bgImage:
      "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/tenders?category=construction",
  },
  {
    title: "Facilities management & building maintenance",
    description:
      "LT needs a combined soft/hard FM contract: daily cleaning plus quarterly HVAC maintenance. Previous suppliers covered only part of the scope. LT posted a single tender with SLAs and KPIs. In Q/A, bidders confirmed consumables, call-out times, and preventive schedules. LT compared consolidated proposals, checked references, and awarded one provider for the whole site.",
    linkText: "Get started",
    bgImage:
      "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/tenders?category=facilities",
  },
];

const allServices = [
  {
    icon: Calendar,
    title: "Events and hospitality",
    subtitle: "Source vendors for conferences, weddings, and corporate events",
    linkText: "View details",
    href: "/tenders?category=events",
  },
  {
    icon: Building2,
    title: "Construction",
    subtitle: "Tenders for building materials, machinery, and labor services",
    linkText: "View details",
    href: "/tenders?category=construction",
  },
  {
    icon: Heart,
    title: "Healthcare Services",
    subtitle: "Medical equipment, staffing, and facility maintenance",
    linkText: "View details",
    href: "/tenders?category=healthcare",
  },
  {
    icon: Laptop,
    title: "IT & Technology",
    subtitle: "Software, hardware, cloud services, and cybersecurity solutions",
    linkText: "View details",
    href: "/tenders?category=it",
  },
  {
    icon: HomeIcon,
    title: "Home Services",
    subtitle: "Plumbing, electrical, painting, and renovation contractors",
    linkText: "View details",
    href: "/tenders?category=home",
  },
  {
    icon: Truck,
    title: "Logistics & Transport",
    subtitle: "Freight, delivery, fleet management, and warehousing solutions",
    linkText: "View details",
    href: "/tenders?category=logistics",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    subtitle: "Legal, accounting, HR, and consulting firm tenders",
    linkText: "View details",
    href: "/tenders?category=professional",
  },
  {
    icon: Palette,
    title: "Creative & Design",
    subtitle: "Graphic design, branding, photography, and video production",
    linkText: "View details",
    href: "/tenders?category=creative",
  },
  {
    icon: Camera,
    title: "Media & Advertising",
    subtitle: "Billboards, digital campaigns, TV, and print media services",
    linkText: "View details",
    href: "/tenders?category=media",
  },
  {
    icon: Coffee,
    title: "Food & Catering",
    subtitle: "Cafes, restaurants, event catering, and food supply chains",
    linkText: "View details",
    href: "/tenders?category=catering",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repair",
    subtitle: "AC servicing, vehicle repair, and equipment maintenance",
    linkText: "View details",
    href: "/tenders?category=maintenance",
  },
  {
    icon: Calendar,
    title: "Education & Training",
    subtitle: "Tutors, workshops, corporate training, and e-learning platforms",
    linkText: "View details",
    href: "/tenders?category=education",
  },
];

/* duplicate for seamless loop */
const duplicated = [...allServices, ...allServices];

function Services() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [topPaused, setTopPaused] = useState(false);
  const [bottomPaused, setBottomPaused] = useState(false);

  /* ---------- Top row – right to left ---------- */
  useEffect(() => {
    if (!topRef.current || topPaused) return;
    const el = topRef.current;
    let id: number;

    const step = () => {
      el.scrollLeft -= 1;
      if (el.scrollLeft <= 0) el.scrollLeft = el.scrollWidth / 2;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [topPaused]);

  /* ---------- Bottom row – left to right ---------- */
  useEffect(() => {
    if (!bottomRef.current || bottomPaused) return;
    const el = bottomRef.current;
    let id: number;

    const step = () => {
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [bottomPaused]);

  const renderCard = (service: (typeof allServices)[0], idx: number) => {
    const Icon = service.icon;
    return (
      <Link key={idx} href={service.href} className="block">
        <div className="group flex-shrink-0 w-80 bg-white rounded-xl transition-all duration-300 p-6 flex flex-col h-full border border-gray-100 hover:-lg hover:-translate-y-1">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 mb-5">
            <Icon size={28} />
          </div>
          <h3 className="text-xl md:text-2xl font-medium font-outfit text-gray-900 leading-tight mb-2">
            {service.title}
          </h3>
          <p className="text-sm md:text-base font-normal font-inter text-gray-600 leading-relaxed flex-grow">
            {service.subtitle}
          </p>
          <button className="mt-6 flex items-center gap-2 text-gray-700 text-sm md:text-base font-medium hover:gap-3 transition-all">
            <span>{service.linkText}</span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </Link>
    );
  };

  return (
    <section
      id="services"
      className="px-4 sm:px-6 py-16 md:py-24 lg:py-32 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* ---------- Header ---------- */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-Color-Scheme-1-Text text-sm md:text-base font-semibold font-inter leading-6">
            Use cases (Qatar)
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Tenders across Qatar's key industries
          </h2>
          <p className="mt-4 text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
            Find the right solution for every project need
          </p>
        </div>

        {/* ---------- Two-Row Carousel ---------- */}
        <div className="relative space-y-1">
          {/* TOP ROW – right to left */}
          <div
            onMouseEnter={() => setTopPaused(true)}
            onMouseLeave={() => setTopPaused(false)}
            className="relative"
          >
            <div className="flex justify-center mb-11">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
                <Plus className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Many more services available
                </span>
              </div>
            </div>
            <div
              ref={topRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide h-full"
              style={{ scrollBehavior: "auto" }}
            >
              {duplicated.map((s, i) => renderCard(s, i))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          </div>

          {/* BOTTOM ROW – left to right */}
          <div
            onMouseEnter={() => setBottomPaused(true)}
            onMouseLeave={() => setBottomPaused(false)}
            className="relative"
          >
            <div
              ref={bottomRef}
              className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide h-full"
              style={{ scrollBehavior: "auto" }}
            >
              {duplicated.map((s, i) => renderCard(s, i + duplicated.length))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          </div>
        </div>
      </div>

      {/* Hide scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

const faqs = [
  {
    question: "I’m not sure how to write requirements.",
    answer:
      "Use Tenderly’s Q/A feature: bidders and tenderers can ask and answer clarifying questions on the tender page to surface any unknown or missing details (scope, deliverables, timeline, acceptance criteria). This keeps everything transparent, comparable, and helps you receive accurate quotes—no guided templates needed.",
  },
  {
    question: "What is Tenderly?",
    answer:
      "Qatar’s open tender platform. Post projects, get bids, pick the best.",
  },
  {
    question: "Is it really anonymous?",
    answer:
      "Yes. Your profile and contact details are hidden until you choose a winner. After award, both parties can share details.",
  },
  {
    question: "Who can bid?",
    answer: "Registered companies only.",
  },
  {
    question: "How do I post?",
    answer: "Register → create a new tender and publish → view bids and award.",
  },
  {
    question: "Any fees?",
    answer: "No. Posting and bidding are free.",
  },
  {
    question: "Do you handle contracts or payments?",
    answer:
      "No. We’re a neutral platform. You finalize contracts and payments directly with the other party.",
  },
  {
    question: "Who can use Tenderly?",
    answer: "Anyone, individuals and businesses of any size.",
  },
  {
    question: "What categories are allowed?",
    answer:
      "All categories are allowed, from construction, IT, and logistics to marketing, design, and consulting. In short: anything.",
  },
];

function FAQ2() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-gray-50 text-black flex flex-col items-center"
    >
      <div className="max-w-3xl w-full text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-semibold mb-4 font-outfit">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-base md:text-lg font-inter">
          Common questions about tendering on Tenderly
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-white/10 transition-all duration-100"
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg md:text-xl font-medium font-inter">
                {faq.question}
              </h3>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6 text-gray-950" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-gray-950 text-base font-inter leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problems() {
  return (
    <section
      id="problems"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32"
    >
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
          The smarter way to handle <br /> Projects in Qatar
        </h2>
        <p className="mt-4 text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
          The platform every bidder and client actually loves.
        </p>
      </div>
      <div className="mt-12">
        <Card className="-none border-muted overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Table Header with Legend */}
                <thead>
                  <tr className="border-b bg-muted/10">
                    <th className="px-6 py-4 text-xs md:text-sm font-medium text-muted-foreground w-1/3 min-w-[180px]">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-xs md:text-sm font-medium text-primary w-1/3 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span>Tenderly</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs md:text-sm font-medium text-muted-foreground w-1/3 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span>Traditional Platforms</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {[
                    {
                      label: "Finding vendors",
                      tenderly: "Post once and reach many bidders instantly.",
                      other:
                        "Hard to find all options; vendors are fragmented.",
                    },
                    {
                      label: "Requirements clarity",
                      tenderly:
                        "Use built-in Q/A to clarify missing details before award.",
                      other:
                        "Unclear requirements lead to wrong quotes and rework.",
                    },
                    {
                      label: "Briefing vendors",
                      tenderly:
                        "Compare apples-to-apples (price, ETA, notes) in one view.",
                      other:
                        "Repeating the same brief to each vendor takes time.",
                    },
                    {
                      label: "Paid and subscription model",
                      tenderly:
                        "Free to post and free to bid — no commissions or hidden costs.",
                      other:
                        "Other platforms charge subscriptions or posting fees for access.",
                    },
                    {
                      label: "Specs quality",
                      tenderly:
                        "Ask/answer clarifying questions publicly on the tender.",
                      other:
                        "Specs are vague; quoting feels risky or time-wasting.",
                    },
                    {
                      label: "Finding buyers",
                      tenderly:
                        "See all required fields up front; submit a clear, competitive bid.",
                      other:
                        "Hard to find real, ready buyers; leads aren’t qualified.",
                    },
                    {
                      label: "Negotiations",
                      tenderly:
                        "Keep negotiations in one private thread; get awarded faster.",
                      other:
                        "Negotiations spread across calls/emails and get lost.",
                    },
                  ].map(({ label, tenderly, other }, i) => (
                    <tr
                      key={label}
                      className={`border-b last:border-b-0 transition-colors hover:bg-muted/50 ${
                        i % 2 === 0 ? "bg-muted/30" : "bg-background"
                      }`}
                    >
                      <td className="px-6 py-5 text-xs md:text-sm font-semibold text-foreground align-top min-w-[180px] leading-5">
                        {label}
                      </td>
                      <td className="px-6 py-5 text-xs md:text-sm font-normal text-foreground/90 align-top min-w-[220px] leading-6">
                        <span className="block break-words">{tenderly}</span>
                      </td>
                      <td className="px-6 py-5 text-xs md:text-sm font-normal text-foreground/70 align-top min-w-[220px] leading-6">
                        <span className="block break-words">{other}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PricingSection() {
  const [activeTab, setActiveTab] = useState<"tender" | "bid">("tender");
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 bg-white text-foreground"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 leading-5">
            Offer & pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
            Flexible Projects solutions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-6">
            Scale your tender strategy with transparent, adaptable pricing for
            every business need.
          </p>
        </div>
        {/* Two Pricing Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tenderer Plan */}
          <Card className="border border-gray-300 bg-white -sm hover:-md transition-all duration-300 flex flex-col h-full">
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-semibold mb-2 leading-tight text-black">
                  Tenderer Plan
                </h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-black">Free</span>
                  <span className="ml-2 text-gray-500 text-base">forever</span>
                </div>
                <p className="mt-4 text-gray-600 text-base leading-6">
                  Launch your project journey with unlimited tender postings —
                  no cost, no limits.
                </p>
              </div>

              <Link href="#hero">
                <Button
                  variant="outline"
                  className="mt-8 w-full font-semibold rounded-md text-base transition-all duration-200"
                >
                  Get Started — Post a Tender
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bidder Plan */}
          <Card className="border border-gray-300 bg-white -sm hover:-md transition-all duration-300 flex flex-col h-full">
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-semibold mb-2 leading-tight text-black">
                  Bidder Plan
                </h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-black">100</span>
                  <span className="ml-2 text-gray-500 text-base">
                    QAR / bid
                  </span>
                </div>
                <p className="mt-4 text-gray-600 text-base leading-6">
                  Pay only when you bid no subscriptions, no hidden fees. Choose
                  tenders that matter to you.
                </p>
              </div>

              <Link href="/tenders">
                <Button
                  variant="outline"
                  className="mt-8 w-full font-semibold rounded-md text-base transition-all duration-200"
                >
                  Get Started — Browse Tenders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const supplierCards = [
  {
    title: "Register",
    subtitle: "Tagline",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cta: "Sign Up",
    href: "/signup",
  },
  {
    title: "Browse tenders",
    subtitle: "Tagline",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cta: "Explore",
    href: "/tenders",
  },
  {
    title: "Submit bid",
    subtitle: "Tagline",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cta: "Bid Now",
    href: "/signup",
  },
];

function Suppliers() {
  return (
    <section
      id="suppliers"
      className="px-4 sm:px-6 md:px-8 py-16 bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <span className="block text-sm font-semibold text-muted-foreground">
            Suppliers
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium">
            Bid on relevant tenders
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Connect with genuine buyers and showcase your services effectively.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplierCards.map((card, i) => (
            <Link key={i} href={card.href} className="block">
              <article className="flex flex-col bg-white border rounded-md overflow-hidden -sm">
                {/* Image / visual area */}
                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-14 h-14 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 7a2 2 0 012-2h3l2 3h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-2">
                      {card.subtitle}
                    </span>
                    <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline focus:outline-none"
                      aria-label={`${card.cta} ${card.title}`}
                    >
                      <span>{card.cta}</span>
                      <svg
                        className="ml-2 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SaasVideo() {
  return (
    <section
      id="video"
      className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
            See GoTenderly in Action
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-7">
            Watch how easy it is to post a tender, receive competitive bids, and
            award the best supplier all in under 2 minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Video Container with Cool Styling */}
          <div className="relative rounded-2xl overflow-hidden -2xl bg-black/90 border border-white/10">
            <video
              className="w-full h-auto aspect-video object-cover"
              poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              controls
              preload="metadata"
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer pointer-events-auto border border-white/30 -xl"
              >
                <Play
                  className="w-10 h-10 text-white ml-1"
                  fill="currentColor"
                />
              </motion.div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* CTA Below Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center gap-5 flex w-full justify-center"
        >
          <Link href="#hero">
            <button className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white font-medium rounded-md text-sm md:text-base hover:bg-gray-900 transition-all">
              Post Your Tender Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <Link href="/signup">
            <button className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-md font-medium text-sm md:text-base hover:bg-gray-900 hover:text-white transition-all">
              Start Bidding Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE EXPORT */
/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <LenisScroll>
      <div className="min-h-screen">
        <PageTransitionWrapper>
          <Navbarlanding />
          <Hero />
          <About />
          <Process />
          <Features />
          <Services />
          <Problems />
          {/* <Testimonials /> */}
          <SaasVideo />
          <PricingSection />
          <FAQ2 />
          <CTA />
          <Footer />
        </PageTransitionWrapper>
      </div>
    </LenisScroll>
  );
}
