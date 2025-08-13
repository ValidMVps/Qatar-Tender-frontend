"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Star,
  Users,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Plus,
  Minus,
} from "lucide-react";
import Lenis from "lenis";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  company: string;
  title: string;
  content: string;
  rating: number;
  image: string;
}

interface Stat {
  number: string;
  label: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const styles = `
  @import "tailwindcss";
  @import "tw-animate-css";

  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.45 0.224 263.325);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.94 0.05 240);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.88 0.08 240);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.55 0.224 263.325);
    --chart-2: oklch(0.65 0.15 220);
    --chart-3: oklch(0.75 0.12 200);
    --chart-4: oklch(0.45 0.18 280);
    --chart-5: oklch(0.35 0.2 250);
    --radius: 0.625rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.45 0.224 263.325);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.145 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.145 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.65 0.224 263.325);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.396 0.141 25.723);
    --destructive-foreground: oklch(0.637 0.237 25.331);
    --border: oklch(0.269 0 0);
    --input: oklch(0.269 0 0);
    --ring: oklch(0.439 0 0);
    --chart-1: oklch(0.55 0.224 263.325);
    --chart-2: oklch(0.65 0.15 220);
    --chart-3: oklch(0.75 0.12 200);
    --chart-4: oklch(0.45 0.18 280);
    --chart-5: oklch(0.35 0.2 250);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.55 0.224 263.325);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(0.269 0 0);
    --sidebar-ring: oklch(0.439 0 0);
  }

  html {
    scroll-behavior: smooth;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleX {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 30s linear infinite;
  }

  .pause-marquee:hover {
    animation-play-state: paused;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-scale-x {
    animation: scaleX 0.8s ease-out 0.5s both;
  }

  .animate-pulse-subtle {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.4s ease-out;
  }

  .animate-reveal {
    animation: reveal 0.7s ease-out forwards;
  }

  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .reveal-on-scroll.animate-reveal {
    opacity: 1;
    transform: translateY(0);
  }

  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .glass-effect {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-border {
    position: relative;
    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #2563eb, #60a5fa) border-box;
    border: 2px solid transparent;
  }
`;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-400 font-sans hover:scale-105 transition-transform duration-200 cursor-pointer">
              Qatar Tender Platform
            </h1>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-gray-700 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-all duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-400 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 transform">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100 rounded-b-lg shadow-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-400 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-gray-700 hover:text-blue-400 hover:bg-gray-50 font-medium py-2 rounded-lg transition-all duration-200"
                >
                  Login
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-md">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section
      id="home"
      className="pt-16 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-center mb-8 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">
              Trusted by 500+ Qatar businesses
            </span>
          </div>
        </div>

        <div className="max-w-3xl reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-sans leading-tight mb-6">
            More control. Less chaos.{" "}
            <span className="block">A perfectly synced</span>
            <span className="text-blue-400 relative">
              tendering workflow.
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transform scale-x-0 animate-scale-x"></div>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
            Smart tendering, effortless bid tracking, and seamless project
            management — all in one place.
          </p>

          <div className="flex items-center space-x-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-blue-300 text-blue-300"
                  />
                ))}
              </div>
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>10,000+ active users</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="group border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-400 font-medium px-8 py-4 rounded-lg text-base transition-all duration-300 bg-transparent hover:shadow-md hover:scale-105 transform"
            >
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button className="group bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-medium px-8 py-4 rounded-lg text-base transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
              <MessageCircle className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
              Book a demo
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
          </p>
        </div>

        <div className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-500 group">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GmDcxiPPCc65AIB1WNnIySfLoRpFLn.png"
              alt="TenderHub Dashboard - Complete tender management interface showing dashboard overview, tender listings, and analytics"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: "📊",
      title: "Tender Analytics",
      description:
        "Get deeper insights into tender opportunities and track your bidding success rate across Qatar markets.",
    },
    {
      icon: "📁",
      title: "Document Management",
      description:
        "Easily organize, store, and manage all tender documents with our secure cloud-based system.",
    },
    {
      icon: "⚡",
      title: "Real-time Notifications",
      description:
        "Never miss a tender deadline with instant alerts for new opportunities and important updates.",
    },
    {
      icon: "🔗",
      title: "Bid Collaboration",
      description:
        "Enable seamless team collaboration on tender proposals with role-based access controls.",
    },
    {
      icon: "💾",
      title: "Compliance Tracking",
      description:
        "Ensure all submissions meet Qatar's regulatory requirements with built-in compliance checks.",
    },
    {
      icon: "ℹ️",
      title: "Vendor Management",
      description:
        "Manage supplier relationships and track vendor performance across multiple projects.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-blue-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
            Explore the powerful features
            <br />
            of Qatar Tender Platform easily
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 hover:scale-105 p-6"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-6 text-2xl hover:from-blue-200 hover:to-blue-300 transition-all duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 font-sans mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Dashboard Showcase Section Component
function DashboardShowcaseSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Top Left - Overall Performance */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Al-Rashid Construction
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                Tender Performance
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs mb-4">
                <div className="text-gray-900">12</div>
                <div className="text-gray-900">32</div>
                <div className="text-gray-900">43</div>
                <div className="text-gray-900">23</div>
                <div className="text-gray-900">84</div>
                <div className="text-gray-900">15</div>
                <div className="text-gray-900">54</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      21,950
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">March 2025</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                Tender Dashboard
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor your tender submissions, win rates, and upcoming
                opportunities in one centralized dashboard.
              </p>
            </div>
          </div>

          {/* Top Right - Success */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                Tender Won
              </div>
              <div className="text-sm text-gray-500 mb-4">
                You have successfully won the tender
              </div>
              <div className="text-sm text-gray-500 mb-2">Contract value</div>
              <div className="text-3xl font-bold text-gray-900">QAR 2.7M</div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                Success Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Track your successful tender wins and monitor contract values
                across all projects.
              </p>
            </div>
          </div>

          {/* Bottom Left - Automate Tasks */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <div className="mb-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center">
                  <Button className="bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
                    ✓ Automate Workflows
                  </Button>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span>Deadline Reminders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span>Document Auto-Classification</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                Process Automation
              </h3>
              <p className="text-gray-600 text-sm">
                Automate repetitive tender processes and never miss important
                deadlines again.
              </p>
            </div>
          </div>

          {/* Bottom Right - Financial Tracking */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                QAR 21.6M ↗
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Total tender value pipeline
              </div>
              <div className="relative h-24 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4">
                <div className="absolute bottom-4 right-4 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                  QAR 1.2M
                </div>
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <path
                    d="M 10 50 Q 50 20 100 30 T 190 25"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                  />
                  <circle cx="190" cy="25" r="3" fill="#60a5fa" />
                </svg>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                Pipeline Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Track your tender pipeline value and forecast potential revenue
                from active bids.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
            Trusted by Qatar businesses,
            <br />
            designed for growth
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            See how Qatar companies streamline their tendering processes and win
            more contracts with our platform.
          </p>

          <div className="flex justify-center space-x-4 mb-12">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
            >
              Construction
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
            >
              Engineering
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
            >
              Consulting
            </Button>
          </div>
        </div>

        {/* Testimonial Card with Background Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Modern Qatar office workspace"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

          <div className="absolute bottom-6 right-6 bg-white rounded-xl p-6 max-w-md shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-300 rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Ahmed Al-Mansouri
                </div>
                <div className="text-sm text-gray-500">
                  CEO, Al-Mansouri Construction
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              "Qatar Tender Platform has revolutionized how we manage tenders.
              We've increased our win rate by 40% and saved countless hours on
              administrative tasks."
            </p>
            <Button className="bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
              Start your growth →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// How It Works Section Component
function HowItWorksSection() {
  const steps = [
    {
      icon: "💾",
      title: "Register & Setup",
      description:
        "Create your account and configure your company profile with Qatar business registration details.",
    },
    {
      icon: "🪄",
      title: "Find Opportunities",
      description:
        "Browse and filter tender opportunities from government and private sector organizations across Qatar.",
    },
    {
      icon: "💙",
      title: "Submit & Track",
      description:
        "Submit your bids with confidence and track their progress through our comprehensive dashboard.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-blue-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
            Guide on how Qatar Tender Platform works
            <br />
            for your startup
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-2/5 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Professional working with analytics dashboard"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
              <div className="absolute bottom-6 right-6 bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total clients
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      5,259
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg
                      className="w-16 h-16 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        strokeDasharray="76, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">
                        76%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 group"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 mt-12 w-px h-8 border-l-2 border-dashed border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ahmed Al-Mansouri",
      company: "Al-Mansouri Construction",
      title: "CEO",
      content:
        "Qatar Tender Platform has transformed our tendering process. We've increased our success rate by 40% since using the platform.",
      rating: 3,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Fatima Al-Zahra",
      company: "Zahra Engineering Solutions",
      title: "Founder",
      content:
        "The platform is intuitive and comprehensive. It has streamlined our bid management and helped us win major infrastructure projects in Qatar.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mohammed Al-Thani",
      company: "Thani Group",
      title: "Procurement Director",
      content:
        "As a growing company, having organized tender management was crucial. Qatar Tender Platform gave us the competitive edge we needed.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Sarah Al-Kuwari",
      company: "Al-Kuwari Ventures",
      title: "Project Manager",
      content:
        "The automated notifications and deadline tracking have been game-changers. We never miss opportunities anymore.",
      rating: 2,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Omar Al-Rashid",
      company: "Rashid Technologies",
      title: "CTO",
      content:
        "The platform's document management and collaboration features have saved us countless hours on tender preparation.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Layla Al-Mahmoud",
      company: "Mahmoud Consulting",
      title: "Managing Partner",
      content:
        "Excellent support team and powerful analytics. Qatar Tender Platform has become essential to our business operations.",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Qatar Companies",
    },
    {
      number: "95%",
      label: "Success Rate",
    },
    {
      number: "60%",
      label: "Time Saved",
    },
    {
      number: "24/7",
      label: "Local Support",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Testimonial
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-16">
            Hear what our users say
            <br />
            about Qatar Tender Platform
          </h2>
        </div>

        <div className="relative overflow-hidden mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="flex animate-marquee gap-6 hover:pause-marquee">
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-gray-900 text-gray-900"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-gray-900 text-gray-900"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section Component
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What is Qatar Tender Platform?",
      answer:
        "Qatar Tender Platform is a powerful tendering SaaS tool designed to help businesses efficiently manage tender opportunities, track bids, and streamline procurement processes.",
    },
    {
      question: "How can I customize the template?",
      answer:
        "Our platform offers extensive customization options including branding, layout modifications, and workflow configurations to match your business requirements.",
    },
    {
      question: "Is Qatar Tender Platform mobile-friendly?",
      answer:
        "Yes, our platform is fully responsive and optimized for mobile devices, allowing you to manage tenders on-the-go from any device.",
    },
    {
      question: "Can I integrate third-party tools with Qatar Tender Platform?",
      answer:
        "We support integrations with popular business tools including CRM systems, accounting software, and project management platforms.",
    },
    {
      question: "Do I need coding knowledge to use Qatar Tender Platform?",
      answer:
        "No coding knowledge is required. Our platform is designed with a user-friendly interface that allows anyone to manage tenders effectively without technical expertise.",
    },
    {
      question: "What support is available with Qatar Tender Platform?",
      answer:
        "We provide comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-b from-blue-50/20 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            FAQs
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
            Everything you need to know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-blue-50/20 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200"
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                {openFAQ === index ? (
                  <Minus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4 animate-fade-in-up">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-400 to-blue-300 rounded-3xl p-12 text-center relative overflow-hidden shadow-lg reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-500/20 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <div className="text-blue-400 text-2xl">⚡</div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white font-sans mb-8">
                Start using Qatar Tender Platform today
                <br />& grow your business
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-400 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg text-base transition-all duration-300 hover:scale-105 shadow-lg">
                  Get started
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-base transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-blue-300 font-sans mb-4">
              Qatar Tender Platform
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Streamlining the tendering process for businesses across Qatar
              with innovative technology and secure solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-gray-300">+974 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-gray-300">info@qatartender.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-gray-300">Doha, Qatar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Qatar Tender Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function HomePage() {
  useEffect(() => {
    let lenis: any;

    const initLenis = async () => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    const initRevealAnimations = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      }, observerOptions);

      // Observe all elements with reveal class
      const revealElements = document.querySelectorAll(".reveal-on-scroll");
      revealElements.forEach((el) => observer.observe(el));

      return observer;
    };

    initLenis();
    const observer = initRevealAnimations();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const features: Feature[] = [
    {
      icon: "📊",
      title: "Tender Analytics",
      description:
        "Get deeper insights into tender opportunities and track your bidding success rate across Qatar markets.",
    },
    {
      icon: "📁",
      title: "Document Management",
      description:
        "Easily organize, store, and manage all tender documents with our secure cloud-based system.",
    },
    {
      icon: "⚡",
      title: "Real-time Notifications",
      description:
        "Never miss a tender deadline with instant alerts for new opportunities and important updates.",
    },
    {
      icon: "🔗",
      title: "Bid Collaboration",
      description:
        "Enable seamless team collaboration on tender proposals with role-based access controls.",
    },
    {
      icon: "💾",
      title: "Compliance Tracking",
      description:
        "Ensure all submissions meet Qatar's regulatory requirements with built-in compliance checks.",
    },
    {
      icon: "ℹ️",
      title: "Vendor Management",
      description:
        "Manage supplier relationships and track vendor performance across multiple projects.",
    },
  ];

  const steps: Step[] = [
    {
      icon: "💾",
      title: "Register & Setup",
      description:
        "Create your account and configure your company profile with Qatar business registration details.",
    },
    {
      icon: "🪄",
      title: "Find Opportunities",
      description:
        "Browse and filter tender opportunities from government and private sector organizations across Qatar.",
    },
    {
      icon: "💙",
      title: "Submit & Track",
      description:
        "Submit your bids with confidence and track their progress through our comprehensive dashboard.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Ahmed Al-Mansouri",
      company: "Al-Mansouri Construction",
      title: "CEO",
      content:
        "Qatar Tender Platform has transformed our tendering process. We've increased our success rate by 40% since using the platform.",
      rating: 3,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Fatima Al-Zahra",
      company: "Zahra Engineering Solutions",
      title: "Founder",
      content:
        "The platform is intuitive and comprehensive. It has streamlined our bid management and helped us win major infrastructure projects in Qatar.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mohammed Al-Thani",
      company: "Thani Group",
      title: "Procurement Director",
      content:
        "As a growing company, having organized tender management was crucial. Qatar Tender Platform gave us the competitive edge we needed.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Sarah Al-Kuwari",
      company: "Al-Kuwari Ventures",
      title: "Project Manager",
      content:
        "The automated notifications and deadline tracking have been game-changers. We never miss opportunities anymore.",
      rating: 2,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Omar Al-Rashid",
      company: "Rashid Technologies",
      title: "CTO",
      content:
        "The platform's document management and collaboration features have saved us countless hours on tender preparation.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Layla Al-Mahmoud",
      company: "Mahmoud Consulting",
      title: "Managing Partner",
      content:
        "Excellent support team and powerful analytics. Qatar Tender Platform has become essential to our business operations.",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const stats: Stat[] = [
    { number: "500+", label: "Qatar Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "60%", label: "Time Saved" },
    { number: "24/7", label: "Local Support" },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is Qatar Tender Platform?",
      answer:
        "Qatar Tender Platform is a powerful tendering SaaS tool designed to help businesses efficiently manage tender opportunities, track bids, and streamline procurement processes.",
    },
    {
      question: "How can I customize the template?",
      answer:
        "Our platform offers extensive customization options including branding, layout modifications, and workflow configurations to match your business requirements.",
    },
    {
      question: "Is Qatar Tender Platform mobile-friendly?",
      answer:
        "Yes, our platform is fully responsive and optimized for mobile devices, allowing you to manage tenders on-the-go from any device.",
    },
    {
      question: "Can I integrate third-party tools with Qatar Tender Platform?",
      answer:
        "We support integrations with popular business tools including CRM systems, accounting software, and project management platforms.",
    },
    {
      question: "Do I need coding knowledge to use Qatar Tender Platform?",
      answer:
        "No coding knowledge is required. Our platform is designed with a user-friendly interface that allows anyone to manage tenders effectively without technical expertise.",
    },
    {
      question: "What support is available with Qatar Tender Platform?",
      answer:
        "We provide comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState<number>(0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <section
          id="home"
          className="pt-16 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 min-h-screen"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-center justify-center mb-8 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Trusted by 500+ Qatar businesses
                </span>
              </div>
            </div>

            <div className="max-w-3xl reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-sans leading-tight mb-6">
                More control. Less chaos.{" "}
                <span className="block">A perfectly synced</span>
                <span className="text-blue-400 relative">
                  tendering workflow.
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transform scale-x-0 animate-scale-x"></div>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Smart tendering, effortless bid tracking, and seamless project
                management — all in one place.
              </p>

              <div className="flex items-center space-x-6 mb-8 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-blue-300 text-blue-300"
                      />
                    ))}
                  </div>
                  <span className="ml-1">4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>10,000+ active users</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="group border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-400 font-medium px-8 py-4 rounded-lg text-base transition-all duration-300 bg-transparent hover:shadow-md hover:scale-105 transform"
                >
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button className="group bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-medium px-8 py-4 rounded-lg text-base transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
                  <MessageCircle className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  Book a demo
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel
                anytime
              </p>
            </div>

            <div className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
              <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-500 group">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GmDcxiPPCc65AIB1WNnIySfLoRpFLn.png"
                  alt="TenderHub Dashboard - Complete tender management interface showing dashboard overview, tender listings, and analytics"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 bg-gradient-to-b from-white to-blue-50/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
                Explore the powerful features
                <br />
                of Qatar Tender Platform easily
              </h2>
            </div>

            <div className="grid gap-8 max-w-6xl mx-auto pb-20">
              {" "}
              {/* Dashboard Showcase Section */}
              <section className=" bg-gradient-to-b from-blue-50/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {/* Dashboard mockups with reveal animations */}
                    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">
                          Al-Rashid Construction
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mb-4">
                          Tender Performance
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
                          <div>Sun</div>
                          <div>Mon</div>
                          <div>Tue</div>
                          <div>Wed</div>
                          <div>Thu</div>
                          <div>Fri</div>
                          <div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-xs mb-4">
                          <div className="text-gray-900">12</div>
                          <div className="text-gray-900">32</div>
                          <div className="text-gray-900">43</div>
                          <div className="text-gray-900">23</div>
                          <div className="text-gray-900">84</div>
                          <div className="text-gray-900">15</div>
                          <div className="text-gray-900">54</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">
                                21,950
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              March 2025
                            </div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                          Tender Dashboard
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Monitor your tender submissions, win rates, and
                          upcoming opportunities in one centralized dashboard.
                        </p>
                      </div>
                    </div>

                    {/* Additional dashboard cards... */}
                    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          Tender Won
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          You have successfully won the tender
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Contract value
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          QAR 2.7M
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                          Success Tracking
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Track your successful tender wins and monitor contract
                          values across all projects.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          QAR 21.6M ↗
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          Total tender value pipeline
                        </div>
                        <div className="relative h-24 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4">
                          <div className="absolute bottom-4 right-4 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                            QAR 1.2M
                          </div>
                          <svg className="w-full h-full" viewBox="0 0 200 60">
                            <path
                              d="M 10 50 Q 50 20 100 30 T 190 25"
                              stroke="#60a5fa"
                              strokeWidth="2"
                              fill="none"
                              className="animate-pulse"
                            />
                            <circle cx="190" cy="25" r="3" fill="#60a5fa" />
                          </svg>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2">
                          Pipeline Analytics
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Track your tender pipeline value and forecast
                          potential revenue from active bids.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Section */}
                  <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
                      Trusted by Qatar businesses,
                      <br />
                      designed for growth
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      See how Qatar companies streamline their tendering
                      processes and win more contracts with our platform.
                    </p>

                    <div className="flex justify-center space-x-4 mb-12">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
                      >
                        Construction
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
                      >
                        Engineering
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full bg-transparent"
                      >
                        Consulting
                      </Button>
                    </div>
                  </div>

                  {/* Testimonial Card with Background Image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-lg reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                    <img
                      src="/placeholder.svg?height=400&width=800"
                      alt="Modern Qatar office workspace"
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 right-6 bg-white rounded-xl p-6 max-w-md shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-300 rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Ahmed Al-Mansouri
                          </div>
                          <div className="text-sm text-gray-500">
                            CEO, Al-Mansouri Construction
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        "Qatar Tender Platform has revolutionized how we manage
                        tenders. We've increased our win rate by 40% and saved
                        countless hours on administrative tasks."
                      </p>
                      <Button className="bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-200 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
                        Start your growth →
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-b from-blue-50/30 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
                Guide on how Qatar Tender Platform works
                <br />
                for your startup
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-2/5 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=400&width=500"
                    alt="Professional working with analytics dashboard"
                    className="rounded-2xl shadow-lg w-full h-auto"
                  />
                  <div className="absolute bottom-6 right-6 bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Total clients
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          5,259
                        </div>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg
                          className="w-16 h-16 transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            strokeDasharray="76, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-400">
                            76%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-3/5 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-6 group"
                      style={{ transitionDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 font-sans mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute left-6 mt-12 w-px h-8 border-l-2 border-dashed border-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Testimonial
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-16">
                Hear what our users say
                <br />
                about Qatar Tender Platform
              </h2>
            </div>

            <div className="relative overflow-hidden mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
              <div className="flex animate-marquee gap-6 hover:pause-marquee">
                {/* First set of testimonials */}
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-gray-900 text-gray-900"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="flex-shrink-0 w-80 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-gray-900 text-gray-900"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-20 bg-gradient-to-b from-blue-50/20 to-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-block bg-gradient-to-r from-gray-200 to-blue-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                FAQs
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
                Everything you need to know
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-blue-50/20 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200"
                    onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {openFAQ === index ? (
                      <Minus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 animate-fade-in-up">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-400 to-blue-300 rounded-3xl p-12 text-center relative overflow-hidden shadow-lg reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-500/20 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <div className="text-blue-400 text-2xl">⚡</div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-sans mb-8">
                    Start using Qatar Tender Platform today
                    <br />& grow your business
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-blue-400 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg text-base transition-all duration-300 hover:scale-105 shadow-lg">
                      Get started
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-base transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      View Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="contact"
          className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-blue-300 font-sans mb-4">
                  Qatar Tender Platform
                </h3>
                <p className="text-gray-300 mb-6 max-w-md">
                  Streamlining the tendering process for businesses across Qatar
                  with innovative technology and secure solutions.
                </p>
                <div className="flex space-x-4">
                  <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
                  <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
                  <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
                  <Instagram className="h-6 w-6 text-gray-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-300 transition-colors duration-200"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-300 mr-3" />
                    <span className="text-gray-300">+974 1234 5678</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-300 mr-3" />
                    <span className="text-gray-300">info@qatartender.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-300 mr-3" />
                    <span className="text-gray-300">Doha, Qatar</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 Qatar Tender Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
