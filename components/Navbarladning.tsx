"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../media/logo.png";
import { Menu, X } from "lucide-react";

export default function Navbarlanding() {
  const { user } = useAuth(); // get current auth state
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
          <a href="/">
            <Image src={logo} alt="GoTenderly Logo" width={160} height={48} />
          </a>

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

            {!user && (
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
            )}

            {user && (
              <a
                href="/dashboard"
                className="px-6 py-2 bg-[#38b6ff] hover:bg-[#0077ed] text-white rounded-full transition-colors"
              >
                Dashboard
              </a>
            )}
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

          {!user && (
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
          )}

          {user && (
            <a
              href="/dashboard"
              className="block py-2 bg-[#38b6ff] text-white rounded-full text-center hover:bg-[#0077ed]"
            >
              Dashboard
            </a>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
