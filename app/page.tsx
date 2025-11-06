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
  MessageSquare,
  Shield,
  EyeOff,
  Bell,
  Users,
  Search,
  Award,
  FileText,
  Lock,
  Zap,
} from "lucide-react";
import logo from "../media/logo.png";
import Hero from "@/components/Hero";
import Navbarlanding from "@/components/Navbarladning";

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/* ----------------------------- TrustedBy ---------------------------------- */
function TrustedBy() {
  const partners = [
    { name: "Lusail Residents", width: "w-32" },
    { name: "Doha SMEs", width: "w-28" },
    { name: "Al Wakrah Events", width: "w-32" },
    { name: "Pearl Qatar", width: "w-28" },
    { name: "West Bay Offices", width: "w-32" },
    { name: "Qatar Garages", width: "w-32" },
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
            Used by individuals and businesses across Qatar
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

/* ------------------------------- Problems --------------------------------- */
function Problems() {
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

  return (
    <section id="problems" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            The procurement struggle is real.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Whether you're posting or bidding, traditional methods waste time
            and lead to mismatched outcomes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {["For tenderers", "For bidders (suppliers)"].map((audience) => (
            <div key={audience}>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6 text-center md:text-left">
                {audience}
              </h3>
              <div className="space-y-6">
                {problems
                  .filter((p) => p.audience === audience)
                  .map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-base text-[#6e6e73] leading-relaxed">
                          {p.title}
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

/* ------------------------------- Outcomes --------------------------------- */
function Outcomes() {
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
      title:
        "See all required fields up front; submit a clear, competitive bid.",
      icon: FileText,
      audience: "For bidders — Outcomes with Tenderly",
    },
    {
      title: "Keep negotiations in one private thread; get awarded faster.",
      icon: Lock,
      audience: "For bidders — Outcomes with Tenderly",
    },
  ];

  return (
    <section id="outcomes" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Better outcomes with Tenderly.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Eliminate friction, get clarity, and close deals faster — for both
            sides.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            "For tenderers — Outcomes with Tenderly",
            "For bidders — Outcomes with Tenderly",
          ].map((audience) => (
            <div key={audience}>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6 text-center md:text-left">
                {audience}
              </h3>
              <div className="space-y-6">
                {outcomes
                  .filter((o) => o.audience === audience)
                  .map((o, i) => {
                    const Icon = o.icon;
                    return (
                      <motion.div
                        key={o.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#38b6ff]/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#38b6ff]" />
                        </div>
                        <p className="text-base text-[#6e6e73] leading-relaxed">
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

/* ----------------------------- HowItWorks --------------------------------- */
function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Post",
      description:
        "Share your requirements once — title, category, deadline, deliverables, and optional budget.",
    },
    {
      icon: Award,
      title: "Receive & compare bids",
      description:
        "Bids come in with price, ETA, and notes. Use Q/A to clarify anything before comparing side-by-side.",
    },
    {
      icon: MessageSquare,
      title: "Chat & award",
      description:
        "Negotiate privately. Identities revealed only after award — then finalize offline.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            How it works in 3 steps.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Simple, transparent, and fast — from post to award.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
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

/* ------------------------------ UseCases ---------------------------------- */
function UseCases() {
  const cases = [
    {
      title: "Home services (cleaning & maintenance)",
      scenario:
        "NA is moving out of an apartment in Lusail and needs a deep clean on a specific date. Calling companies one by one was slow and prices varied wildly. On Tenderly, NA posted once with the date, apartment size, and checklist. Through Q/A, bidders confirmed building access and timings. NA received multiple quotes the same day, compared inclusions (steam, windows, oven), and awarded the best match—done.",
    },
    {
      title: "Automotive services (repair, detailing, tires)",
      scenario:
        "HM’s SUV needs brake pads and a full detail. Not sure of fair pricing or downtime. HM posted the plate/model and preferred time window. Garages responded with parts options (OEM/aftermarket), ETAs, and warranty notes; a detailer asked in Q/A about interior shampoo vs. quick wash. HM picked a garage that offered pick-up/drop-off and a detail combo—problem solved in one go.",
    },
    {
      title: "Events (weddings, corporate, birthdays)",
      scenario:
        "MA is planning a small wedding in Al Wakrah: catering for 120, décor, DJ, and photo/video. Vendors were scattered and hard to coordinate. MA posted the budget range, menu style, and venue restrictions. Using Q/A, suppliers clarified power load and layout. MA quickly compared package breakdowns, shortlisted two, negotiated extras (LED dance floor), and awarded a single vendor bundle.",
    },
    {
      title: "Construction & renovation (small works, fit-outs, repairs)",
      scenario:
        "AA wants a kitchen refresh—cabinet re-facing and new countertop. Past quotes were inconsistent and missed measurements. AA posted with drawings/photos and a rough timeline. Contractors used Q/A to ask about materials and site access; AA added dimensions. Comparable bids arrived with line-item costs and lead times. AA awarded one contractor and arranged a site visit after award.",
    },
    {
      title: "Facilities management & building maintenance",
      scenario:
        "LT needs a combined soft/hard FM contract: daily cleaning plus quarterly HVAC maintenance. Previous suppliers covered only part of the scope. LT posted a single tender with SLAs and KPIs. In Q/A, bidders confirmed consumables, call-out times, and preventive schedules. LT compared consolidated proposals, checked references, and awarded one provider for the whole site.",
    },
    {
      title: "IT & managed services (support, cloud, networking)",
      scenario:
        "KR’s team needs 24/7 helpdesk, endpoint security, and cloud backups. Cold outreach was noisy; scopes didn’t match. KR posted requirements (users, devices, response times, compliance needs). MSPs asked in Q/A about current stack and ticket volume, then submitted structured bids with SLAs and onboarding plans. KR compared like-for-like, negotiated onboarding fees, and awarded the best-fit MSP.",
    },
  ];

  return (
    <section id="use-cases" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Real use cases in Qatar.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            From home cleaning to enterprise IT — see how Tenderly works in
            practice.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="bg-[#fbfbfd] rounded-[24px] p-8 h-full border border-[#d2d2d7] hover:border-[#38b6ff]/30 transition-all">
                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">
                  {c.title}
                </h3>
                <p className="text-base text-[#6e6e73] leading-relaxed">
                  {c.scenario}
                </p>
              </div>
            </motion.div>
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
            How it works — step by step.
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

/* ------------------------------ KeyFeatures ------------------------------- */
function KeyFeatures() {
  const features = [
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

  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Key features.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Everything you need to post, bid, and award — securely and
            efficiently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                <div className="bg-white rounded-[24px] p-6 h-full border border-[#d2d2d7] hover:border-[#38b6ff]/30 transition-all text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#38b6ff] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#6e6e73] leading-relaxed">
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

/* ------------------------------- Pricing ---------------------------------- */
function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Free to post. Free to bid.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            We’re just the platform: No involvement in contracts, custody, or
            payments.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[32px] p-12 border-2 border-[#38b6ff] text-center"
          >
            <div className="text-6xl font-bold text-[#38b6ff] mb-2">Free</div>
            <p className="text-lg text-[#6e6e73] mb-8">
              Unlimited posts and bids. No hidden fees.
            </p>
            <button className="w-full h-14 bg-[#38b6ff] hover:bg-[#0077ed] text-white rounded-xl font-medium">
              Post your first tender
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ------------------------------- */
function Testimonials() {
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
            Loved by users in Qatar.
          </h2>
          <p className="text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Real people getting real results — faster and fairer.
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
      answer:
        "Register → create a new tender and publish → view bids and award.",
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
            Got questions? We’ve got answers.
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
                  className="bg-white text-[#38b6ff] hover:bg-white/90 rounded-full px-8 h-14 text-lg font-medium shadow-lg flex items-center gap-2"
                >
                  Post your tender for free <ArrowRight className="w-5 h-5" />
                </motion.a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-sm text-white/70 mt-8"
              >
                Anonymous until award • No fees • Takes ~2 minutes
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
    <footer className="bg-[#fbfbfd] border-t border-[#d2d2d7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#38b6ff] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-[#1d1d1f]">
                Tenderly
              </span>
            </div>
            <p className="text-[#6e6e73] leading-relaxed max-w-sm">
              Qatar’s open tender platform — post once, get competitive bids,
              award the best.
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
              © {new Date().getFullYear()} Tenderly. All rights reserved.
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
      <Navbarlanding />
      <Hero />
      <TrustedBy />
      <Problems />
      <Outcomes />
      <HowItWorks />
      <UseCases />
      <HowItWorksDetailed />
      <KeyFeatures />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
