"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Plus,
  FileText,
  Home,
  Settings,
  HelpCircle,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  Star,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  PanelLeft,
  PanelRight,
  BarChart,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

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

  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "AM",
    company: "Al-Mahmoud Enterprises",
  };

  const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Tenders", href: "/dashboard/my-tenders", icon: FileText },
    { name: "Active Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Ratings & Reviews", href: "/dashboard/ratings", icon: Star },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-white h-full z-50 shadow-lg">
            <div className="flex items-center justify-between px-4 py-4">
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
            <nav className="mt-4 space-y-1 px-4">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-16" : "w-64"
        } hidden sm:flex flex-col flex-shrink-0 relative z-30`}
      >
        <div className="relative px-4 py-6 pb-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span
              className={`text-2xl font-semibold text-gray-900 transition-opacity duration-200 ${
                sidebarOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              TenderHub
            </span>
          </div>
        </div>
        <nav className="px-2 pb-4 flex-1 space-y-2">
          {sidebarLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`ml-3 text-md transition-all duration-300 origin-left ${
                  sidebarOpen
                    ? "opacity-0 scale-95 w-0 overflow-hidden"
                    : "opacity-100 scale-100"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>{" "}
      </aside>
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarLinks={sidebarLinks}
        />
        <main className="flex-1 w-full px-4 sm:px-0 py-0 overflow-x-auto bg-neutral-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}
