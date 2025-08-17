"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarLinks?: { name: string; href: string; icon: React.ElementType }[];
}

// Capitalize utility
const toTitleCase = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  sidebarLinks,
}: NavbarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "AM",
    company: "Al-Mahmoud Enterprises",
  };
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentRouteName =
    sidebarLinks?.find((link) => link.href === pathname)?.name || "Dashboard";

  const [open, setOpen] = useState(false);
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // Get the last segment as the page name
  const pageName =
    pathSegments.length > 0
      ? toTitleCase(pathSegments[pathSegments.length - 1])
      : "Dashboard";
  return (
    <header className="md:relative fixed w-full z-10 border-b flex bg-white  px-4 md:px-0">
      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:pe-3 pe-2  py-2 md:py-4 border-r border-gray-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 rounded-0"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <PanelLeft className="h-5 w-5 text-gray-700" />
        ) : (
          <PanelRight className="h-5 w-5 text-gray-700" />
        )}
      </button>{" "}
      <div className="container py-2 mx-auto flex items-center">
        {" "}
        {/* Breadcrumbs container */}
        <nav className="flex-1 min-w-0 ml-2 sm:ml-4 md:flex hidden">
          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;
                  return (
                    <React.Fragment key={href}>
                      <BreadcrumbItem className="text-sm sm:text-base font-medium text-gray-700">
                        {isLast ? (
                          <BreadcrumbPage>
                            {toTitleCase(segment)}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>
                            {toTitleCase(segment)}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
        <nav className="px-4 block md:hidden text-sm sm:text-base font-medium text-gray-700">
          {pageName}
        </nav>
        {/* Actions container */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          {/* New Tender button - hidden on xs, visible on sm+ */}
          <Button
            variant="default"
            className="hidden sm:flex items-center whitespace-nowrap"
            onClick={() => setOpenTenderModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tender
          </Button>

          {/* Notifications dropdown */}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <div className="relative">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900"
                  aria-label={t("notifications")}
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={
                    "absolute md:right-0 right-2 mt-2 md:w-80 w-[90vw] max-w-[100vw] rounded-md border bg-white shadow-xl z-50 " +
                    "md:top-auto top-14" // push down below button on mobile
                  }
                  style={{ left: "auto", right: -50 }} // prevent weird left positioning on mobile
                >
                  <div className="p-3">
                    <div className="text-sm font-semibold px-2 py-1">
                      {t("notifications")}
                    </div>
                    <hr className="my-2" />
                    <div className="flex flex-col space-y-3 max-h-60 overflow-y-auto">
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium text-gray-800">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">
                          5 minutes ago
                        </span>
                      </div>
                      <hr />
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium text-gray-800">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">
                          1 hour ago
                        </span>
                      </div>
                      <hr />
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium text-gray-800">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("yesterday")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </DropdownMenu>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="User menu"
              className="flex items-center space-x-2 rounded-full hover:bg-gray-100 transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AS
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
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      {t("profile")}
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      {t("settings")}
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LifeBuoy className="w-4 h-4 text-gray-500" />
                      {t("help")}
                    </Link>
                    <div className="border-t border-gray-200 my-1" />
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign out
                    </Link>
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
