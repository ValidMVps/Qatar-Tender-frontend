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
import { AnimatePresence, motion } from "framer-motion";
import CreateTenderModal from "./CreateTenderModal";
import { useTranslation } from "../lib/hooks/useTranslation";
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
  const { notifications, unreadCount } = useNotifications();

  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "",
    company: "Al-Mahmoud Enterprises",
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const pageName =
    pathSegments.length > 0
      ? toTitleCase(pathSegments[pathSegments.length - 1])
      : "Business Dashboard";

  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
    <header className="sticky top-0 w-full z-10 border-b bg-white/40 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Left: Sidebar toggle + Page title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Sidebar toggle (mobile only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <PanelLeft className="h-5 w-5 text-gray-700" />
            ) : (
              <PanelRight className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Page Name */}
          <nav className="text-sm sm:text-base md:text-lg font-medium text-neutral-900 truncate max-w-[150px] sm:max-w-none">
            {pageName}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* New Tender Button (hidden on mobile) */}
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

          {/* Bell Icon */}
          <div className="relative">
            <Link
              href={
                profile?.userType === "business"
                  ? "/business-dashboard/notification"
                  : "/dashboard/notification"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <Bell className="h-6 w-6 sm:h-7 sm:w-7" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-semibold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Profile Dropdown */}
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
                  className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
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
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign out
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile New Tender Button (visible on small screens) */}
      {showNewTenderButton && (
        <div className="sm:hidden px-4 pb-2">
          <Button
            variant="default"
            className="w-full flex items-center justify-center"
            onClick={() => setOpenTenderModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tender
          </Button>
        </div>
      )}

      {/* Tender Modal */}
      <CreateTenderModal
        open={openTenderModal}
        onOpenChange={setOpenTenderModal}
      />
    </header>
  );
}
