"use client";

import { Building2, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "../lib/hooks/useTranslation";

function Headerauth() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            GoTenderly Qatar
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t("features")}
          </a>
          <a
            href="#process"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t("process")}
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t("pricing")}
          </a>
        </div>

        {/* Desktop Button */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="flex flex-col space-y-3 px-6 py-4">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {t("features")}
            </a>
            <a
              href="#process"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {t("process")}
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {t("pricing")}
            </a>

            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              <Button className="w-full mt-2">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Headerauth;
