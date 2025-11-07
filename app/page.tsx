"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Briefcase,
  Zap,
  Lock,
  EyeOff,
  Shield,
  Bell,
  Search,
  FileText,
  MessageSquare,
  Users,
  FilePlus,
  MessagesSquare,
  Trophy,
  Star,
  Car,
  PartyPopper,
  Hammer,
  Building2,
  Laptop,
  Award,
  Plus,
  HomeIcon,
} from "lucide-react";
import Hero from "@/components/Hero";
import NavbarLanding from "@/components/Navbarladning";

// ---------------------------------------------------------------------
//  Component Definitions (cleaned and consistent)
// ---------------------------------------------------------------------

function TrustedBy() {
  const partners = [
    { name: "Lusail Residents" },
    { name: "Doha SMEs" },
    { name: "Al Wakrah Events" },
    { name: "Pearl Qatar" },
    { name: "West Bay Offices" },
    { name: "Qatar Garages" },
  ];

  return (
    <section className="py-16 md:py-20 bg-Opacity-White-5 border-y border-Opacity-Neutral-Darkest-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-base md:text-lg text-Color-Scheme-1-Text/70 font-medium font-inter">
            Used by individuals and businesses across Qatar
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 items-center">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="w-32 h-12 bg-Opacity-White-10 rounded-xl flex items-center justify-center hover:bg-Opacity-White-20 transition-colors sm">
                <span className="text-xs font-medium text-Color-Scheme-1-Text/70 text-center px-3">
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
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-base font-semibold font-inter text-Color-Scheme-1-Text">
            Process
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight md:leading-[62.4px]">
            How gotenderly works
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text/70">
            Create detailed project specifications in minutes
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="group relative h-[480px] md:h-[540px] rounded-xl overflow-hidden md hover:xl transition-all hover:scale-[1.02]"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${step.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                <span className="text-sm font-semibold font-inter uppercase opacity-90">
                  {step.label}
                </span>
                <h3 className="mt-1 text-2xl md:text-3xl font-medium font-outfit leading-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-base font-normal font-inter leading-relaxed opacity-95">
                  {step.description}
                </p>
                <button className="mt-6 flex items-center gap-2 text-sm md:text-base font-medium font-inter hover:gap-3 transition-all">
                  <span>{step.linkText}</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const problems = [
  {
    title: "Hard to find all options; vendors are fragmented.",
    icon: Search,
    audience: "For tenderers",
  },
  {
    title: "Unclear requirements lead to wrong quotes and rework.",
    icon: FileText,
    audience: "For tenderers",
  },
  {
    title: "Repeating the same brief to each vendor takes time.",
    icon: MessageSquare,
    audience: "For tenderers",
  },
  {
    title: "Specs are vague; quoting feels risky or time-wasting.",
    icon: FileText,
    audience: "For bidders (suppliers)",
  },
  {
    title: "Hard to find real, ready buyers; leads aren’t qualified.",
    icon: Users,
    audience: "For bidders (suppliers)",
  },
  {
    title: "Negotiations spread across calls/emails and get lost.",
    icon: MessageSquare,
    audience: "For bidders (suppliers)",
  },
];

function Problems() {
  return (
    <section id="problems" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            The procurement struggle is real.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Whether you're posting or bidding, traditional methods waste time
            and lead to mismatched outcomes.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {["For tenderers", "For bidders (suppliers)"].map((audience) => {
            const filtered = problems.filter((p) => p.audience === audience);
            return (
              <div key={audience} className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-medium font-outfit text-Color-Scheme-1-Text mb-6 text-center md:text-left">
                  {audience}
                </h3>
                <div className="space-y-4">
                  {filtered.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.title}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.12 }}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-Opacity-White-10 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-100/80 flex items-center justify-center flex-shrink-0 ring-2 ring-red-100/50 group-hover:bg-red-100 transition-colors">
                          <Icon size={20} className="text-red-600" />
                        </div>
                        <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/80 leading-relaxed">
                          {p.title}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const outcomes = [
  {
    title: "Post once and reach many bidders at once.",
    icon: Zap,
    audience: "For tenderers — Outcomes with Tenderly",
  },
  {
    title: "Use built-in Q/A to clarify missing details before award.",
    icon: MessageSquare,
    audience: "For tenderers — Outcomes with Tenderly",
  },
  {
    title: "Compare apples-to-apples (price, ETA, notes) in one view.",
    icon: Award,
    audience: "For tenderers — Outcomes with Tenderly",
  },
  {
    title: "Stay anonymous until award; choose the best fit faster.",
    icon: EyeOff,
    audience: "For tenderers — Outcomes with Tenderly",
  },
  {
    title: "Ask/answer clarifying questions publicly on the tender.",
    icon: MessageSquare,
    audience: "For bidders — Outcomes with Tenderly",
  },
  {
    title: "See all required fields up front; submit a clear, competitive bid.",
    icon: FileText,
    audience: "For bidders — Outcomes with Tenderly",
  },
  {
    title: "Keep negotiations in one private thread; get awarded faster.",
    icon: Lock,
    audience: "For bidders — Outcomes with Tenderly",
  },
];

function Outcomes() {
  return (
    <section id="outcomes" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Better outcomes with Tenderly.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Eliminate friction, get clarity, and close deals faster — for both
            sides.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {[
            "For tenderers — Outcomes with Tenderly",
            "For bidders — Outcomes with Tenderly",
          ].map((audience) => (
            <div key={audience} className="flex flex-col">
              <h3 className="text-2xl md:text-3xl font-medium font-outfit text-Color-Scheme-1-Text mb-6 text-center md:text-left">
                {audience}
              </h3>
              <div className="space-y-4">
                {outcomes
                  .filter((o) => o.audience === audience)
                  .map((o, i) => {
                    const Icon = o.icon;
                    return (
                      <motion.div
                        key={o.title}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.12 }}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-Opacity-White-10 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-Color-Matisse/10 flex items-center justify-center flex-shrink-0 ring-2 ring-Color-Matisse/20 group-hover:bg-Color-Matisse/15 transition-colors">
                          <Icon size={20} className="text-Color-Matisse" />
                        </div>
                        <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/80 leading-relaxed">
                          {o.title}
                        </p>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Create Your Tender",
    description:
      "Fill out a structured form with scope, timeline, budget, and attachments. Takes under 10 minutes.",
    icon: FilePlus,
  },
  {
    title: "Receive Bids",
    description:
      "Verified local vendors submit detailed, comparable proposals directly in the platform.",
    icon: MessagesSquare,
  },
  {
    title: "Award & Track",
    description:
      "Compare bids side-by-side, award the best, and manage progress, payments, and deliverables.",
    icon: Trophy,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            How it works in 3 steps.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Simple, transparent, and fast — from post to award.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group text-center"
              >
                <div className="relative inline-block mb-6">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-Color-Matisse flex items-center justify-center md group-hover:xl transition-all group-hover:bg-Color-Matisse/90"
                  >
                    <Icon size={32} className="text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-Opacity-White-10 flex items-center justify-center text-sm font-bold text-Color-Scheme-1-Text ring-2 ring-Opacity-White-5">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-medium font-outfit text-Color-Scheme-1-Text mb-3">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        <div className="hidden md:block mt-8">
          <div className="flex justify-center items-center gap-12 max-w-4xl mx-auto">
            {steps.slice(0, -1).map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-Color-Matisse/30" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const cases = [
  {
    title: "Home services (cleaning & maintenance)",
    scenario:
      "NA is moving out of an apartment in Lusail and needs a deep clean on a specific date. Calling companies one by one was slow and prices varied wildly. On Tenderly, NA posted once with the date, apartment size, and checklist. Through Q/A, bidders confirmed building access and timings. NA received multiple quotes the same day, compared inclusions (steam, windows, oven), and awarded the best match—done.",
    icon: HomeIcon,
  },
  {
    title: "Automotive services (repair, detailing, tires)",
    scenario:
      "HM’s SUV needs brake pads and a full detail. Not sure of fair pricing or downtime. HM posted the plate/model and preferred time window. Garages responded with parts options (OEM/aftermarket), ETAs, and warranty notes; a detailer asked in Q/A about interior shampoo vs. quick wash. HM picked a garage that offered pick-up/drop-off and a detail combo—problem solved in one go.",
    icon: Car,
  },
  {
    title: "Events (weddings, corporate, birthdays)",
    scenario:
      "MA is planning a small wedding in Al Wakrah: catering for 120, décor, DJ, and photo/video. Vendors were scattered and hard to coordinate. MA posted the budget range, menu style, and venue restrictions. Using Q/A, suppliers clarified power load and layout. MA quickly compared package breakdowns, shortlisted two, negotiated extras (LED dance floor), and awarded a single vendor bundle.",
    icon: PartyPopper,
  },
  {
    title: "Construction & renovation (small works, fit-outs, repairs)",
    scenario:
      "AA wants a kitchen refresh—cabinet re-facing and new countertop. Past quotes were inconsistent and missed measurements. AA posted with drawings/photos and a rough timeline. Contractors used Q/A to ask about materials and site access; AA added dimensions. Comparable bids arrived with line-item costs and lead times. AA awarded one contractor and arranged a site visit after award.",
    icon: Hammer,
  },
  {
    title: "Facilities management & building maintenance",
    scenario:
      "LT needs a combined soft/hard FM contract: daily cleaning plus quarterly HVAC maintenance. Previous suppliers covered only part of the scope. LT posted a single tender with SLAs and KPIs. In Q/A, bidders confirmed consumables, call-out times, and preventive schedules. LT compared consolidated proposals, checked references, and awarded one provider for the whole site.",
    icon: Building2,
  },
  {
    title: "IT & managed services (support, cloud, networking)",
    scenario:
      "KR’s team needs 24/7 helpdesk, endpoint security, and cloud backups. Cold outreach was noisy; scopes didn’t match. KR posted requirements (users, devices, response times, compliance needs). MSPs asked in Q/A about current stack and ticket volume, then submitted structured bids with SLAs and onboarding plans. KR compared like-for-like, negotiated onboarding fees, and awarded the best-fit MSP.",
    icon: Laptop,
  },
];

function UseCases() {
  return (
    <section id="use-cases" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Real use cases in Qatar.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            From home cleaning to enterprise IT — see how Tenderly works in
            practice.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-Opacity-White-10 backdrop-blur-sm border border-Opacity-Neutral-Darkest-10 hover:border-Color-Matisse/30 hover:md transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-Color-Matisse/10 flex items-center justify-center ring-2 ring-Color-Matisse/20 group-hover:bg-Color-Matisse/20 transition-colors">
                      <Icon size={24} className="text-Color-Matisse" />
                    </div>
                    <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text">
                      {c.title}
                    </h3>
                  </div>
                  <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/80 leading-relaxed">
                    {c.scenario}
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

const detailedSteps = [
  {
    audience: "For tenderers (buyers)",
    items: [
      "Post your tender (title, category, deadline, optional budget, deliverables).",
      "Use Q/A to clarify specs or request revisions—without revealing identity.",
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

function HowItWorksDetailed() {
  return (
    <section
      id="how-it-works-detailed"
      className="py-16 md:py-28 bg-Opacity-White-5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            How it works — step by step.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Clear actions for both tenderers and bidders.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {detailedSteps.map((s, i) => (
            <motion.div
              key={s.audience}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-outfit text-Color-Scheme-1-Text mb-6">
                {s.audience}
              </h3>
              <ol className="space-y-4">
                {s.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base font-normal font-inter text-Color-Scheme-1-Text/80"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-Color-Matisse/10 text-Color-Matisse text-sm font-medium flex items-center justify-center ring-2 ring-Color-Matisse/20">
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

const keyFeatures = [
  {
    icon: Zap,
    title: "One-to-Many Quotes",
    description: "Post once, reach many bidders instantly.",
  },
  {
    icon: Lock,
    title: "Private Chat & Negotiation",
    description: "Clarify details without sharing identity.",
  },
  {
    icon: EyeOff,
    title: "Anonymity by Default",
    description: "Both sides stay anonymous until award.",
  },
  {
    icon: Shield,
    title: "Profiles & Verification",
    description: "KYC/business verification and ratings.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Alerts for new bids and messages.",
  },
];

function KeyFeatures() {
  return (
    <section id="features" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Key features.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Everything you need to post, bid, and award — securely and
            efficiently.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {keyFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-Opacity-White-10 backdrop-blur-sm border border-Opacity-Neutral-Darkest-10 hover:border-Color-Matisse/30 hover:md transition-all text-center">
                  <div className="w-12 h-12 rounded-2xl bg-Color-Matisse flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform sm">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-medium font-outfit text-Color-Scheme-1-Text mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm font-normal font-inter text-Color-Scheme-1-Text/70 leading-relaxed">
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

function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Free to post. Free to bid.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            We’re just the platform: No involvement in contracts, custody, or
            payments.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-Opacity-White-10 rounded-3xl p-8 md:p-12 border border-Color-Matisse/30 md"
        >
          <div className="text-5xl md:text-6xl font-medium font-outfit text-Color-Matisse mb-4">
            Free
          </div>
          <p className="text-base md:text-lg font-normal font-inter text-Color-Scheme-1-Text/70 mb-8">
            Unlimited posts and bids. No hidden fees.
          </p>
          <button className="w-full py-3 bg-Color-Matisse text-white rounded-lg font-medium hover:bg-Color-Matisse/90 transition-all">
            Post your first tender
          </button>
        </motion.div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "NA",
    role: "Resident, Lusail",
    content:
      "I posted my apartment cleaning once and got 5 solid quotes in hours — picked the best one without calling anyone.",
    rating: 5,
  },
  {
    name: "HM",
    role: "Car Owner, Doha",
    content:
      "Got brake repair + detailing from one garage with pick-up. Saved time and money — all through Tenderly.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Loved by users in Qatar.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70 max-w-2xl mx-auto">
            Real people getting real results — faster and fairer.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-Opacity-White-10 backdrop-blur-sm border border-Opacity-Neutral-Darkest-10 hover:border-Color-Matisse/30 hover:md transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-Color-Matisse text-Color-Matisse"
                    />
                  ))}
                </div>
                <blockquote className="mb-6">
                  <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/80 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-Opacity-Neutral-Darkest-10 flex items-center justify-center">
                    <span className="text-base font-medium text-Color-Scheme-1-Text">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-Color-Scheme-1-Text">
                      {t.name}
                    </p>
                    <p className="text-sm font-normal text-Color-Scheme-1-Text/70">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs2 = [
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
    answer: "Anyone—individuals and businesses of any size.",
  },
  {
    question: "What categories are allowed?",
    answer: "Anything.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Frequently asked.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-normal font-inter text-Color-Scheme-1-Text/70">
            Got questions? We’ve got answers.
          </p>
        </motion.div>
        <div className="space-y-4">
          {faqs2.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full p-6 rounded-2xl bg-Opacity-White-10 border border-Opacity-Neutral-Darkest-10 hover:border-Color-Matisse/30 transition-all text-left sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-medium font-outfit text-Color-Scheme-1-Text pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus size={20} className="text-Color-Matisse" />
                  </motion.div>
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === i ? "auto" : 0,
                    opacity: openIndex === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-base font-normal font-inter text-Color-Scheme-1-Text/70 pr-8 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-Color-Matisse rounded-3xl p-8 md:p-12 lg:p-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-medium font-outfit text-white mb-6 leading-tight"
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-Color-Matisse rounded-lg font-medium hover:bg-white/90 transition-all flex items-center gap-2 md"
            >
              Post your tender for free <ArrowRight size={20} />
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-sm text-white/80"
          >
            Anonymous until award • No fees • Takes ~2 minutes
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "How it works", href: "#how-it-works" },
        { name: "Use cases", href: "#use-cases" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#privacy" },
        { name: "Terms", href: "#terms" },
      ],
    },
  ];

  return (
    <footer className="bg-Opacity-White-5 border-t border-Opacity-Neutral-Darkest-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-Color-Matisse rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">T</span>
              </div>
              <span className="text-lg font-medium text-Color-Scheme-1-Text">
                Tenderly
              </span>
            </div>
            <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/70 max-w-md">
              Qatar’s open tender platform — post once, get competitive bids,
              award the best.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-medium text-Color-Scheme-1-Text mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className="text-sm font-normal text-Color-Scheme-1-Text/70 hover:text-Color-Matisse transition-colors"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-Opacity-Neutral-Darkest-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-normal font-inter text-Color-Scheme-1-Text/70">
            <p>© {new Date().getFullYear()} Tenderly. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-Color-Matisse transition-colors"
              >
                English
              </a>
              <a
                href="#"
                className="hover:text-Color-Matisse transition-colors"
              >
                العربية
              </a>
            </div>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-Color-Matisse rounded-full lg flex items-center justify-center hover:bg-Color-Matisse/90 transition-all"
      >
        <ArrowRight size={20} className="text-white rotate-[-90deg]" />
      </motion.button>
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
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-left md:text-center mb-12 md:mb-16">
          <span className="text-base font-semibold font-inter text-Color-Scheme-1-Text">
            Features
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Powerful tools for seamless tendering
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text/70">
            Designed to simplify your procurement and bidding experience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-Opacity-White-10 backdrop-blur-sm border border-Opacity-Neutral-Darkest-10 hover:border-Color-Matisse/30 hover:md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-Color-Matisse/10 flex items-center justify-center mb-4 group-hover:bg-Color-Matisse/20 transition-colors">
                  <Icon size={28} className="text-Color-Matisse" />
                </div>
                <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text mb-2">
                  {feature.title}
                </h3>
                <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-Opacity-Neutral-Darkest-5 border border-Opacity-Neutral-Darkest-10 text-Color-Scheme-1-Text font-medium font-inter rounded-lg hover:bg-Opacity-Neutral-Darkest-10 transition-all">
            Learn more
          </button>
          <button className="px-6 py-3 flex items-center gap-2 text-Color-Scheme-1-Text font-medium font-inter hover:gap-3 transition-all">
            Explore <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <span className="text-base font-semibold font-inter text-Color-Scheme-1-Text">
              Tender
            </span>
            <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
              Solve the friction of finding and awarding local vendors
            </h2>
            <p className="text-lg font-normal font-inter text-Color-Scheme-1-Text/70 leading-relaxed">
              Streamline your procurement process with a platform designed for
              Qatar's dynamic market.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text">
                  For tenderers
                </h3>
                <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/70">
                  Cut through complexity. Get precise bids from verified local
                  professionals without endless email chains.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium font-outfit text-Color-Scheme-1-Text">
                  For bidders
                </h3>
                <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/70">
                  Access quality projects directly. Showcase your skills to the
                  right clients with transparent, structured opportunities.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-Opacity-Neutral-Darkest-5 border border-Opacity-Neutral-Darkest-10 text-Color-Scheme-1-Text font-medium font-inter rounded-lg hover:bg-Opacity-Neutral-Darkest-10 transition-all">
                Learn more
              </button>
              <button className="px-6 py-3 flex items-center gap-2 text-Color-Scheme-1-Text font-medium font-inter hover:gap-3 transition-all">
                Get started <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <img
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=640"
            alt="Professional workspace"
            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl md lg:lg"
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
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-base font-semibold font-inter text-Color-Scheme-1-Text">
            Services
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Tenders across Qatar's key industries
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text/70">
            Find the right solution for every project need
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className="group relative h-[400px] md:h-[480px] p-8 rounded-2xl overflow-hidden md hover:xl transition-all hover:scale-[1.02] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800')`,
            }}
          >
            <div className="flex flex-col justify-end h-full gap-6 text-white">
              <div>
                <span className="text-sm font-semibold font-inter uppercase opacity-90">
                  Individuals
                </span>
                <h3 className="mt-1 text-3xl md:text-4xl font-medium font-outfit leading-tight">
                  Home services and personal projects
                </h3>
                <p className="mt-3 text-base font-normal font-inter leading-relaxed opacity-95">
                  Quickly find skilled professionals for home repairs,
                  renovations, and personal tasks
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-5 py-2 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-all">
                  See sample tender
                </button>
                <button className="flex items-center gap-2 hover:gap-3 transition-all">
                  Explore{" "}
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {smallServices.map((service, i) => (
              <div
                key={i}
                className="group relative h-64 p-6 rounded-2xl overflow-hidden md hover:xl transition-all hover:scale-[1.03] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('${service.bgImage}')`,
                }}
              >
                <div className="flex flex-col justify-between h-full text-white">
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Briefcase size={24} className="text-white" />
                    </div>
                    <h4 className="text-xl font-medium font-outfit leading-tight">
                      {service.title}
                    </h4>
                    <p className="text-sm font-normal font-inter leading-relaxed opacity-95">
                      {service.description}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-normal hover:gap-3 transition-all mt-2">
                    {service.linkText}{" "}
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

const pricingData = {
  free: {
    title: "Basic tender posting",
    description: "Perfect for individual and small business needs",
    price: "$0",
    features: [
      ["Post up to 3 tenders per month", "Receive up to 10 bids per tender"],
      ["Basic project specifications", "Email support"],
      ["Standard response time", "Public tender visibility"],
    ],
    cta: "Start now",
  },
  always: {
    title: "Unlimited tendering",
    description: "For growing teams and frequent procurement needs",
    price: "$49",
    features: [
      ["Unlimited tender posts", "Unlimited bids received"],
      ["Advanced specs & attachments", "Priority email + chat support"],
      ["24-hour response SLA", "Private & public tenders"],
      ["Team collaboration", "Analytics dashboard"],
    ],
    cta: "Start free trial",
  },
};

function Pricing2() {
  const [activeTab, setActiveTab] = useState<"free" | "always">("free");
  const plan = pricingData[activeTab];

  return (
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-base font-semibold font-inter text-Color-Scheme-1-Text">
            Pricing
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            Simple transparent pricing
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text/70">
            No hidden costs, no commitments
          </p>
        </div>
        <div className="max-w-md mx-auto mb-10">
          <div className="p-1 bg-Opacity-White-10 rounded-lg border border-Opacity-Neutral-Darkest-10 flex">
            {(["free", "always"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-md text-base font-medium font-inter transition-all
                  ${
                    activeTab === tab
                      ? "bg-Opacity-White-5 text-Color-Scheme-1-Text"
                      : "text-Color-Scheme-1-Text/70 hover:text-Color-Scheme-1-Text"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto bg-Opacity-White-10 rounded-2xl border border-Opacity-Neutral-Darkest-10 p-8 md:p-10 md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-Color-Matisse/10 flex items-center justify-center">
                <Check size={28} className="text-Color-Matisse" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
                  {plan.title}
                </h3>
                <p className="mt-1 text-base font-normal font-inter text-Color-Scheme-1-Text/70">
                  {plan.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-medium font-outfit text-Color-Scheme-1-Text">
                {plan.price}
              </div>
              {activeTab === "always" && (
                <div className="text-sm font-normal text-Color-Scheme-1-Text/70 mt-1">
                  per month
                </div>
              )}
            </div>
          </div>
          <hr className="border-Opacity-Neutral-Darkest-10 mb-8" />
          <div className="mb-8">
            <p className="text-base font-normal font-inter text-Color-Scheme-1-Text mb-4">
              Includes
            </p>
            <div className="space-y-4">
              {plan.features.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-6">
                  {row.map((feature, colIdx) => (
                    <div key={colIdx} className="flex-1 flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-Color-Matisse mt-1 flex-shrink-0"
                      />
                      <span className="text-base font-normal font-inter text-Color-Scheme-1-Text/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <hr className="border-Opacity-Neutral-Darkest-10 mb-8" />
          <button className="w-full py-3 bg-Color-Matisse text-white rounded-lg font-medium hover:bg-Color-Matisse/90 transition-all flex items-center justify-center gap-2">
            {plan.cta}
            {activeTab === "always" && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </section>
  );
}

function CTA2() {
  return (
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="p-8 md:p-12 bg-Opacity-White-10 rounded-2xl border border-Opacity-Neutral-Darkest-10 text-center md">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight mb-6">
              Get better quotes faster
            </h2>
            <p className="text-lg font-normal font-inter text-Color-Scheme-1-Text/70 mb-8">
              Simplify your procurement process with instant, transparent
              bidding
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-Color-Matisse text-white rounded-lg font-medium hover:bg-Color-Matisse/90 transition-all">
                Post tender
              </button>
              <button className="px-6 py-3 bg-Opacity-Neutral-Darkest-5 border border-Opacity-Neutral-Darkest-10 text-Color-Scheme-1-Text rounded-lg font-medium hover:bg-Opacity-Neutral-Darkest-10 transition-all">
                Browse tenders
              </button>
            </div>
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
    <section className="py-16 md:py-28 bg-Opacity-White-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-outfit text-Color-Scheme-1-Text leading-tight">
            FAQs
          </h2>
          <p className="mt-4 text-lg font-normal font-inter text-Color-Scheme-1-Text/70">
            Common questions about tendering on Gotenderly
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-Opacity-White-10 border border-Opacity-Neutral-Darkest-10 md"
            >
              <h3 className="text-lg font-medium font-outfit text-Color-Scheme-1-Text mb-3">
                {faq.question}
              </h3>
              <p className="text-base font-normal font-inter text-Color-Scheme-1-Text/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-md mx-auto text-center">
          <h3 className="text-3xl font-medium font-outfit text-Color-Scheme-1-Text mb-4">
            Need more help?
          </h3>
          <p className="text-lg font-normal font-inter text-Color-Scheme-1-Text/70 mb-6">
            Our support team is ready to answer any additional questions
          </p>
          <button className="px-6 py-3 bg-Opacity-Neutral-Darkest-5 border border-Opacity-Neutral-Darkest-10 text-Color-Scheme-1-Text font-medium font-inter rounded-lg hover:bg-Opacity-Neutral-Darkest-10 transition-all">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
//  Main Home Page
// ---------------------------------------------------------------------

export default function Home() {
  return (
    <div className="min-h-screen bg-Opacity-White-5">
      <NavbarLanding />
      <Hero />
      <TrustedBy />
      <About />
      <Process />
      <Features />
      <Services />
      <Problems />
      <Outcomes />
      <HowItWorks />
      <UseCases />
      <HowItWorksDetailed />
      <KeyFeatures />
      <Pricing2 />
      <Testimonials />
      <FAQ2 />
      <CTA2 />
      <Footer />
    </div>
  );
}
