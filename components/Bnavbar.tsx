"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Plus,
  LifeBuoy,
  LogOut,
  PanelLeft,
  PanelRight,
  Settings,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import CreateTenderModal from "./CreateTenderModal";

import { useTranslation } from "../lib/hooks/useTranslation";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
// Utility to capitalize and space hyphenated words
const toTitleCase = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

// Utility to get initials from a full name
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarLinks?: { name: string; href: string; icon: React.ElementType }[];
}

export default function BNavbar({
  sidebarOpen,
  setSidebarOpen,
  sidebarLinks,
}: NavbarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { logout, profile } = useAuth();
  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "", // fallback to initials
    company: "Al-Mahmoud Enterprises",
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const { notifications, unreadCount, isLoading } = useNotifications();
  const pageName =
    pathSegments.length > 0
      ? toTitleCase(pathSegments[pathSegments.length - 1])
      : "Business Dashboard";

  const [open, setOpen] = useState(false);
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Show "New Tender" button only in Project Posting section
  const showNewTenderButton = [
    "/business-dashboard/post-tender",
    "/business-dashboard/my-posted-tenders",
    "/business-dashboard/active-projects",
  ].some((route) => pathname.startsWith(route));

  const logoutfunction = () => {
    setProfileDropdownOpen(false);
    logout();
  };
  return (
    <header className=" sticky top-0 w-full z-10 border-b flex bg-white/40 backdrop-blur-md px-4 py-3 md:px-0">
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:pe-3 pe-2 py-2 md:py-4 border-r border-gray-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <PanelLeft className="h-5 w-5 text-gray-700" />
        ) : (
          <PanelRight className="h-5 w-5 text-gray-700" />
        )}
      </button>

      <div className="container py-2 mx-auto flex items-center">
        {/* Breadcrumb (Desktop) */}

        {/* Page Title (Mobile) */}
        <nav className="px-4  text-sm sm:text-lg font-medium text-neutral-900">
          {pageName}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          {showNewTenderButton && (
            <Button
              variant="default"
              className="hidden sm:flex items-center whitespace-nowrap"
              onClick={() => setOpenTenderModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Tender
            </Button>
          )}
          <div className="relative">
            <Link
              href={
                profile?.userType == "business"
                  ? "/business-dashboard/notification"
                  : "/dashboard/notification"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <Bell className="h-7 w-7" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white  text-[9px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 rounded-full hover:bg-gray-100 px-2 py-1"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {currentUser.avatar || getInitials(currentUser.name)}
              </div>
            </button>
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <Link
                      href="/business-dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      {t("profile")}
                    </Link>
                    <Link
                      href="/business-dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      {t("settings")}
                    </Link>
                    <Link
                      href="/business-dashboard/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LifeBuoy className="w-4 h-4 text-gray-500" />
                      {t("help")}
                    </Link>
                    <div className="border-t border-gray-200 my-1" />
                    <div
                      onClick={logoutfunction}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign out
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <CreateTenderModal
              open={openTenderModal}
              onOpenChange={setOpenTenderModal}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
