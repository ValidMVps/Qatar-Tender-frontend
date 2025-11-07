"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../media/logo.png";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function NavbarLanding() {
  const { user } = useAuth();
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
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0)",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b border-gray-300" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="GoTenderly Logo"
              width={140}
              height={42}
              priority
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-black hover:text-gray-600 transition-colors"
              >
                {item.name}
              </a>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-black border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
        transition={{ duration: 0.25 }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-300"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-black hover:text-gray-600 transition-colors"
            >
              {item.name}
            </a>
          ))}

          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block py-2 bg-black text-white rounded-full text-center hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-full border border-gray-300 text-center hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 bg-black text-white rounded-full text-center hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
