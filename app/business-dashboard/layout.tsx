"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Home,
  Settings,
  HelpCircle,
  X,
  Briefcase,
  Star,
  BarChart,
  PlusCircle,
  Search,
  PenSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import BNavbar from "@/components/Bnavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  const sidebarGroups = [
    {
      title: "Overview",
      links: [
        { name: "Dashboard", href: "/business-dashboard", icon: Home },
        {
          name: "Analytics",
          href: "/business-dashboard/analytics",
          icon: BarChart,
        },
      ],
    },
    {
      title: "Project Posting",
      links: [
        {
          name: "Post a Tender",
          href: "/business-dashboard/post-tender",
          icon: PlusCircle,
        },
        {
          name: "My Posted Tenders",
          href: "/business-dashboard/my-tenders",
          icon: FileText,
        },
        {
          name: "Active Projects",
          href: "/business-dashboard/projects",
          icon: Briefcase,
        },
      ],
    },
    {
      title: "Bidding",
      links: [
        {
          name: "Browse Tenders",
          href: "/business-dashboard/browse-tenders",
          icon: Search,
        },
        {
          name: "My Bids",
          href: "/business-dashboard/my-bids",
          icon: PenSquare,
        },
      ],
    },
    {
      title: "Company Profile",
      links: [
        {
          name: "Company Profile",
          href: "/business-dashboard/profile",
          icon: Building2,
        },
        {
          name: "Ratings & Reviews",
          href: "/business-dashboard/ratings",
          icon: Star,
        },
      ],
    },
    {
      title: "System",
      links: [
        {
          name: "Settings",
          href: "/business-dashboard/settings",
          icon: Settings,
        },
        {
          name: "Help & Support",
          href: "/business-dashboard/help",
          icon: HelpCircle,
        },
      ],
    },
  ];

  const renderLinks = () =>
    sidebarGroups.map((group) => (
      <div key={group.title} className="mt-4">
        <h4 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {group.title}
        </h4>
        {group.links.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === item.href
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </div>
    ));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile overlay menu */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "keyframes", stiffness: 300, damping: 30 }}
        >
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            className="relative flex w-64 flex-col bg-white h-full z-50 shadow-lg"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ type: "keyframes", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-3 py-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  TenderHub Qatar
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="mt-2 px-2">{renderLinks()}</nav>
          </motion.div>
        </motion.div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 hidden lg:flex flex-col w-64`}
      >
        <div className="px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              TenderHub
            </span>
          </div>
        </div>
        <nav className="px-2 pb-4 flex-1 overflow-y-auto">{renderLinks()}</nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <BNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarLinks={[]} // Navbar no longer needs flat list
        />
        <main className="flex-1 w-full px-2 sm:px-4 py-0  md:mt-0 mt-[70px] bg-neutral-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}
