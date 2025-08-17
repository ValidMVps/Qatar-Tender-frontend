import { Building2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

import { useTranslation } from '../lib/hooks/useTranslation';
function Headerauth() {
    const { t } = useTranslation();

  return (
    <header className="bg-white border-b   border-gray-200 fixed w-full top-0 z-50">
      <div className=" mx-auto px-16 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            TenderHub Qatar
          </span>
        </Link>
        <div className="flex gap-6">
          {" "}
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t('features')}
          </a>
          <a
            href="#process"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t('process')}
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t('pricing')}
          </a>{" "}
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t('features')}
          </a>
          <a
            href="#process"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium scroll-smooth"
          >
            {t('process')}
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/signup">
            <Button className="">Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Headerauth;
