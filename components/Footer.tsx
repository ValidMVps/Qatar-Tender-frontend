"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";
import logo from "../public/favicon.png";

export default function Footer() {
  return (
    <footer className="bg-gray-50/70 w-full   text-Color-Scheme-1-Text py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={logo}
                alt="GoTenderly Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-xl font-semibold font-outfit">
                GoTenderly
              </span>
            </Link>
            <p className="text-sm md:text-base font-inter leading-relaxed opacity-80">
              Qatar’s open tender platform. Post projects, get bids, pick the
              best, anonymous, fast, and fair.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold font-outfit">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#process"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold font-outfit">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tenders"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Browse Tenders
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm md:text-base font-inter hover:opacity-80 transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold font-outfit">
              Connect With Us
            </h4>
            <p className="text-sm md:text-base font-inter opacity-80">
              support@gotenderly.com
            </p>
            <p className="text-sm md:text-base font-inter opacity-80">
              +974 1234 5678
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-inter opacity-80">
          <p>© {new Date().getFullYear()} GoTenderly. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:opacity-80 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:opacity-80 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
