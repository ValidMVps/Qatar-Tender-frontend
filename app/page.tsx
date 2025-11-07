"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import logo from "../media/logo.png";
import Hero from "@/components/Hero";
import Navbarlanding from "@/components/Navbarladning";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

const processSteps = [
  {
    label: "Post",
    title: "Submit comprehensive tender with clear requirements",
    description: "Define project scope, budget, and critical details",
    linkText: "View details",
    bgImage:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
  {
    label: "Bids",
    title: "Receive and compare structured proposals from qualified vendors",
    description:
      "Evaluate competitive bids with transparent pricing and timelines",
    linkText: "Compare now",
    bgImage:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
  {
    label: "Award",
    title: "Negotiate and finalize with your preferred vendor",
    description:
      "Communicate securely and select the best match for your project",
    linkText: "Select winner",
    bgImage:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=384&h=630",
  },
];

function Process() {
  return (
    <section className="px-6 py-16 md:px-16 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-Color-Scheme-1-Text text-base font-semibold font-inter leading-6">
            Process
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight md:leading-[62.4px]">
            How gotenderly works
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
            Create detailed project specifications in minutes
          </p>
        </div>

        {/* Process Steps - Responsive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="group relative h-[540px] md:h-[580px] rounded-md overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${step.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                <div className="flex flex-col gap-3">
                  <span className="text-sm md:text-base font-semibold font-inter uppercase tracking-wider opacity-90">
                    {step.label}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium font-outfit leading-tight">
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

              {/* Optional: Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
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
        "Use Q/A to clarify specs or request revisions, without revealing identity.",
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
    <section id="how-it-works-detailed" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            How it works , step by step.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Clear actions for both tenderers and bidders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.audience}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
                {s.audience}
              </h3>
              <ol className="space-y-4">
                {s.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base text-[#6e6e73]"
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
    <div className="bg-gray-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12">
          {/* Left Image */}
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-[600px]">
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
              <p className="text-3xl leading-relaxed text-gray-900 mb-6 text-center md:text-left">
                “Our tender platform cut through bureaucratic barriers like a
                sharp knife through paper. We won contracts we never thought
                possible.”
              </p>

              {/* Author */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div>
                  <p className="font-medium text-lg text-gray-900">
                    Michael Roberts
                  </p>
                  <p className="text-md text-gray-600">
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
                  <span className="ml-1 text-sm font-medium text-gray-900">
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
    </div>
  );
}

/* --------------------------------- CTA ------------------------------------ */
function CTA() {
  return (
    <section className="py-24 sm:py-32  text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-sm border border-white/10 bg-gray-100 p-12 sm:p-16 lg:p-20"
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-10"
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
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/post"
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 text-lg font-medium  flex items-center gap-2"
              >
                Post your tender for free <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-white/60 mt-8"
            >
              Anonymous until award • No fees • Takes ~2 minutes
            </motion.p>
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
    platform: [
      { name: "How it works", href: "#how-it-works" },
      { name: "Use cases", href: "#use-cases" },
      { name: "FAQ", href: "#faq" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Privacy", href: "#privacy" },
      { name: "Terms", href: "#terms" },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Left Column - Logo, Location, Contact */}
          <div className="flex flex-col ">
            <span className="text-sm font-medium text-gray-900 mb-4">Logo</span>

            <div className="space-y-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Location</p>
              <p>Level 1, 123 Innovation Drive, Sydney NSW 2000</p>

              <p className="font-semibold text-gray-900 mt-6">Connect</p>
              <p>1800 tender • help@tenderplatform.com</p>
            </div>

            <div className="flex space-x-4 mt-6">
              <Facebook className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Instagram className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Twitter className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Linkedin className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Youtube className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="flex justify-end items-center gap-x-27  gap-y-6 text-sm">
            <div>
              <p className="font-semibold text-gray-900 mb-3">
                Platform insights
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-gray-900 cursor-pointer">
                  Industry guides
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Case studies
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Integration docs
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Support center
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-3">About mission</p>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-gray-900 cursor-pointer">
                  Our story
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Join team
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Media kit
                </li>
                <li className="hover:text-gray-900 cursor-pointer">
                  Get in touch
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-2">
          {/* <div className="w-full text-center font-serif font-bold text-gray-900 mb-6 text-[100px] leading-none tracking-widest uppercase break-words">
        GoTenderly
      </div> */}

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6 text-sm text-gray-600">
            <div>© 2024 Tender Platform. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="hover:text-gray-900 cursor-pointer">
                Privacy policy
              </span>
              <span className="hover:text-gray-900 cursor-pointer">
                Terms of service
              </span>
              <span className="hover:text-gray-900 cursor-pointer">
                Cookies settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "One-to-many quote generation",
    description:
      "Instantly reach multiple qualified vendors with a single tender submission",
  },
  {
    icon: Users,
    title: "Private negotiation platform",
    description: "Secure communication channel for direct vendor interactions",
  },
  {
    icon: Shield,
    title: "Anonymity by default",
    description: "Protect sensitive information until you're ready to award",
  },
  {
    icon: Award,
    title: "Trusted profiles",
    description: "Verified business credentials ensure quality and reliability",
  },
];

function Features() {
  return (
    <section className="self-stretch px-16 py-28 bg-Color-Scheme-1-Background flex flex-col justify-start items-center gap-20 overflow-hidden">
      <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-20">
        <div className="w-full max-w-[768px] flex flex-col justify-start items-start gap-4">
          <div className="flex justify-start items-center">
            <span className="text-Color-Scheme-1-Text text-base font-semibold font-inter leading-6">
              Features
            </span>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <h2 className="self-stretch text-Color-Scheme-1-Text text-5xl font-medium font-outfit leading-[62.40px]">
              Powerful tools for seamless tendering
            </h2>
            <p className="self-stretch text-Color-Scheme-1-Text text-lg font-normal font-inter leading-7">
              Designed to simplify your procurement and bidding experience
            </p>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-16">
          <div className="self-stretch flex justify-start items-start gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col justify-start items-start gap-6"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Icon size={40} className="text-Color-Scheme-1-Text" />
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <h3 className="self-stretch text-Color-Scheme-1-Text text-3xl font-medium font-outfit leading-10">
                      {feature.title}
                    </h3>
                    <p className="self-stretch text-Color-Scheme-1-Text text-base font-normal font-inter leading-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-start items-center gap-6">
          <button className="px-3 py-1.5 bg-Opacity-Neutral-Darkest-5 outline outline-1 outline-Opacity-Transparent text-Color-Neutral-Darkest text-base font-medium font-inter leading-6 hover:bg-opacity-70 transition-all overflow-hidden">
            Learn more
          </button>
          <button className="flex justify-center items-center gap-2 text-Color-Neutral-Darkest text-base font-medium font-inter leading-6 hover:gap-3 transition-all overflow-hidden">
            <span>Explore</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="px-6 py-16 md:px-16 md:py-28 bg-Color-Scheme-1-Background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text Content */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-6">
              <span className="text-Color-Scheme-1-Text text-base font-semibold font-inter leading-6">
                Tender
              </span>
              <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight md:leading-[62.4px]">
                Solve the friction of finding and awarding local vendors
              </h2>
              <p className="text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
                Streamline your procurement process with a platform designed for
                Qatar's dynamic market.
              </p>
            </div>

            {/* For Tenderers & Bidders */}
            <div className="grid sm:grid-cols-2 gap-8 py-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text leading-8">
                  For tenderers
                </h3>
                <p className="text-base font-normal font-inter text-Color-Scheme-1-Text leading-6">
                  Cut through complexity. Get precise bids from verified local
                  professionals without endless email chains.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text leading-8">
                  For bidders
                </h3>
                <p className="text-base font-normal font-inter text-Color-Scheme-1-Text leading-6">
                  Access quality projects directly. Showcase your skills to the
                  right clients with transparent, structured opportunities.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-4 py-2 bg-Opacity-Neutral-Darkest-5 outline outline-1 outline-Opacity-Transparent text-Color-Neutral-Darkest text-base font-medium font-inter leading-6 rounded-md hover:bg-opacity-70 transition-all">
                Learn more
              </button>
              <button className="flex items-center gap-2 text-Color-Neutral-Darkest text-base font-medium font-inter leading-6 hover:gap-3 transition-all">
                <span>Get started</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:block">
            <img
              src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=640"
              alt="Professional workspace"
              className="w-full h-[540px] md:h-[600px] object-cover rounded-md shadow-lg"
            />
          </div>
        </div>

        {/* Mobile Image (optional - show below on small screens) */}
        <div className="lg:hidden mt-12">
          <img
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=640"
            alt="Professional workspace"
            className="w-full h-80 object-cover rounded-md shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

const smallServices = [
  {
    title: "Automotive services",
    description: "Connect with mechanics, dealers, and auto specialists",
    linkText: "Browse",
    bgImage:
      "https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Events and hospitality",
    description:
      "Source vendors for conferences, weddings, and corporate events",
    linkText: "View details",
    bgImage:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Construction solutions",
    description:
      "Find contractors, suppliers, and specialized construction services",
    linkText: "Compare now",
    bgImage:
      "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Facilities management",
    description:
      "Streamline maintenance and operational support for businesses",
    linkText: "Get started",
    bgImage:
      "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

function Services() {
  return (
    <section className="px-6 py-16 md:px-16 md:py-28 bg-Color-Scheme-1-Background">
      <div className="max-w-7xl mx-auto">
        {/* ---------- Header ---------- */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-Color-Scheme-1-Text text-base font-semibold font-inter leading-6">
            Services
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight md:leading-[62.4px]">
            Tenders across Qatar's key industries
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
            Find the right solution for every project need
          </p>
        </div>

        {/* ---------- Layout: Large + Grid of 4 ---------- */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Large Card (Individuals) */}
          <div
            className="group relative h-[500px] md:h-full p-8 md:p-12 rounded-md overflow-hidden
                       bg-cover bg-center transition-transform hover:scale-[1.01]"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)),
                url('https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800')
              `,
            }}
          >
            <div className="flex flex-col justify-end h-full gap-6 text-white">
              <div>
                <span className="text-sm md:text-base font-semibold font-inter uppercase tracking-wider opacity-90">
                  Individuals
                </span>
                <h3 className="mt-1 text-4xl md:text-5xl font-medium font-outfit leading-tight">
                  Home services and personal projects
                </h3>
                <p className="mt-3 text-base md:text-lg font-normal font-inter leading-relaxed opacity-95">
                  Quickly find skilled professionals for home repairs,
                  renovations, and personal tasks
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-medium rounded-md hover:bg-white/20 transition-all">
                  See sample tender
                </button>
                <button className="flex items-center gap-2 text-white text-base font-normal hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Small Cards Grid (2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {smallServices.map((service, idx) => (
              <div
                key={idx}
                className="group relative h-72 md:h-80 p-6 rounded-md overflow-hidden bg-cover bg-center
                           transition-transform hover:scale-[1.03] shadow-lg"
                style={{
                  backgroundImage: `
                    linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.65)),
                    url('${service.bgImage}')
                  `,
                }}
              >
                <div className="flex flex-col justify-between h-full text-white">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <Briefcase size={28} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl md:text-3xl font-medium font-outfit leading-tight">
                        {service.title}
                      </h4>
                      <p className="mt-2 text-sm md:text-base font-normal font-inter leading-relaxed opacity-95">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-white text-sm md:text-base font-normal hover:gap-3 transition-all mt-4">
                    <span>{service.linkText}</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    question: "How does Gotenderly work?",
    answer:
      "Gotenderly connects businesses and service providers through a simple, transparent tender process. Post your project, receive bids, and select the best vendor quickly and securely.",
  },
  {
    question: "Is posting a tender free?",
    answer:
      "Yes, posting tenders is completely free for all users. We believe in removing barriers to finding great local talent.",
  },
  {
    question: "How long do tenders remain open?",
    answer:
      "Tenders typically remain open for 7-14 days, depending on the project complexity. You can adjust the deadline when posting.",
  },
  {
    question: "Are vendors verified?",
    answer:
      "We conduct basic verification for all vendors and provide transparent profiles to help you make informed decisions.",
  },
  {
    question: "Can I communicate with bidders?",
    answer:
      "Our platform offers secure, private messaging to discuss project details directly with potential vendors.",
  },
];

function FAQ2() {
  return (
    <section className="self-stretch px-16 py-28 bg-Color-Scheme-1-Background flex flex-col justify-start items-center gap-20 overflow-hidden">
      <div className="w-full max-w-[1280px] flex flex-col justify-start items-center gap-20">
        <div className="w-full max-w-[768px] flex flex-col justify-start items-center gap-6">
          <h2 className="self-stretch text-center text-Color-Scheme-1-Text text-5xl font-medium font-outfit leading-[62.40px]">
            FAQs
          </h2>
          <p className="self-stretch text-center text-Color-Scheme-1-Text text-lg font-normal font-inter leading-7">
            Common questions about tendering on Gotenderly
          </p>
        </div>

        <div className="w-full max-w-[768px] flex flex-col justify-start items-start gap-12 overflow-hidden">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="self-stretch flex flex-col justify-start items-start gap-4"
            >
              <h3 className="self-stretch text-Color-Scheme-1-Text text-lg font-bold font-inter leading-7">
                {faq.question}
              </h3>
              <p className="self-stretch text-Color-Scheme-1-Text text-base font-normal font-inter leading-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problems() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <span className="text-Color-Scheme-1-Text text-base font-semibold font-inter leading-6">
          Why Choose Us
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight md:leading-[62.4px]">
          The smarter way to handle <br /> procurement in Qatar
        </h2>
        <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text leading-7">
          We Are Better Than Every Other Tendering Platform
        </p>
      </div>

      <div className="mt-12">
        <Card className="shadow-none border-muted overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Table Header with Legend */}
                <thead>
                  <tr className="border-b bg-muted/10">
                    <th className="px-6 py-4 text-sm font-medium text-muted-foreground w-1/3 min-w-[180px]">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-primary w-1/3 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span>Gotenderly</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-muted-foreground w-1/3 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span>Traditional Platforms</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {[
                    [
                      "Vendor discovery",
                      "Smart AI matching connects you with verified vendors in seconds",
                      "Manual search across multiple directories",
                    ],
                    [
                      "Tender posting process",
                      "One unified dashboard for publishing, tracking, and managing all tenders",
                      "Scattered communication through emails and PDFs",
                    ],
                    [
                      "Requirement clarity",
                      "Built-in templates and guided forms prevent vague specs or missing info",
                      "Open-ended briefs often lead to wrong quotes and rework",
                    ],
                    [
                      "Bid management",
                      "Live analytics show quote ranges, vendor engagement, and performance",
                      "No visibility until bids close decisions made blind",
                    ],
                    [
                      "Communication",
                      "All chat, negotiation, and updates happen inside the platform no lost emails",
                      "Negotiations spread across calls and emails",
                    ],
                    [
                      "Verification and trust",
                      "Vendor KYC, ratings, and performance history built-in",
                      "Little to no verification hard to identify reliable partners",
                    ],
                    [
                      "Support & response time",
                      "Local Qatar-based support with real-time chat",
                      "Generic or delayed ticket based support",
                    ],
                  ].map(([label, gotenderly, other], i) => (
                    <tr
                      key={label}
                      className={`border-b last:border-b-0 transition-colors hover:bg-muted/50 ${
                        i % 2 === 0 ? "bg-muted/30" : "bg-background"
                      }`}
                    >
                      <td className="px-6 py-5 text-sm font-medium text-foreground align-top min-w-[180px]">
                        {label}
                      </td>
                      <td className="px-6 py-5 text-sm font-normal   align-top min-w-[220px]">
                        <span className="block break-words">{gotenderly}</span>
                      </td>
                      <td className="px-6 py-5 text-sm font-normal align-top min-w-[220px]">
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
    <>
      <section className="py-20 px-6 bg-background text-foreground">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Pricing
            </p>
            <h2 className="text-4xl font-semibold mb-4">
              Flexible procurement solutions
            </h2>
            <p className="text-base text-muted-foreground">
              Scale your tender strategy with transparent, adaptable pricing for
              every business need.
            </p>
          </div>

          {/* Two Pricing Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Tender Plan */}
            <Card className="border border-border bg-muted/40 shadow-none">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-2">Starter Plan</h3>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">Free</span>
                    <span className="ml-2 text-muted-foreground">forever</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Launch your procurement journey with unlimited tender
                    postings at no cost.
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-3">Includes</h4>
                    <ul className="space-y-3">
                      {[
                        "3 active tender postings",
                        "Standard communication tools",
                        "Basic reporting metrics",
                        "Essential security protocols",
                        "Limited integration options",
                      ].map((item) => (
                        <li key={item} className="flex items-start">
                          <Check className="w-5 h-5 text-foreground mr-3 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-3">
                      {[
                        "Basic vendor profile access",
                        "Community support channel",
                        "Single user account",
                        "Platform onboarding guide",
                        "Monthly performance insights",
                      ].map((item) => (
                        <li key={item} className="flex items-start">
                          <Check className="w-5 h-5 text-foreground mr-3 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full font-semibold rounded-md"
                >
                  Start Posting Tenders
                </Button>
              </CardContent>
            </Card>

            {/* Bid Plan */}
            <Card className="border border-border bg-muted/10 shadow-none">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-2">Pay-per-Bid</h3>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">100</span>
                    <span className="text-2xl ml-1 font-medium">QAR</span>
                    <span className="ml-2 text-muted-foreground">per bid</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Only pay when you submit a bid. No subscriptions, no hidden
                    fees.
                  </p>
                </div>

                <div className="border border-border rounded-md p-6 mb-8 bg-muted/50">
                  <p className="font-medium">Transparent & Risk-Free</p>
                  <p className="text-muted-foreground mt-2">
                    You only pay when a tender is worth bidding on. Access all
                    browsing, matching, and analytics features completely free.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold">What you get with every bid</h4>
                  <ul className="space-y-3">
                    {[
                      "Full access to tender specifications & documents",
                      "Smart vendor matching & quote templates",
                      "Secure submission with audit trail",
                      "Direct communication with tender owner",
                      "Bid performance analytics post-submission",
                    ].map((item) => (
                      <li key={item} className="flex items-start">
                        <Check className="w-5 h-5 text-foreground mr-3 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  className="w-full font-semibold rounded-md"
                >
                  Browse Tenders to Bid
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
/* -------------------------------------------------------------------------- */
/*                                 PAGE EXPORT                                */
/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <div className="min-h-screen">
      <PageTransitionWrapper>
        <Navbarlanding />
        <Hero />
        <About />
        <Process />
        <Features />
        <Services />
        <Problems />
        <Testimonials />
        {/* <KeyFeatures /> */}
        <PricingSection />
        {/* <HowItWorksDetailed /> */}
        <FAQ2 />
        <CTA />
        <Footer />
      </PageTransitionWrapper>
    </div>
  );
}
