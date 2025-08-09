"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  LogOut,
  Menu,
  PanelLeft,
  PanelRight,
  Plus,
  Settings,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarLinks?: { name: string; href: string; icon: React.ElementType }[]; // Made optional
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

  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "AM",
    company: "Al-Mahmoud Enterprises",
  };
  const pathSegments = pathname.split("/").filter(Boolean);
  // Safely access sidebarLinks using optional chaining
  const currentRouteName =
    sidebarLinks?.find((link) => link.href === pathname)?.name || "Dashboard";
  const [open, setOpen] = useState(false);
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [profileDropdownOpen, setprofileDropdownOpen] = useState(false);

  return (
    <header className="flex border-b">
      {" "}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="px-5 border-e me-4"
      >
        <span
          className="flex items-center justify-center transition-all  duration-300 ease-in-out"
          key={sidebarOpen ? "left" : "right"}
        >
          {sidebarOpen ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelRight className="h-5 w-5" />
          )}
        </span>
      </button>
      <div className="flex container mxauto py-4">
        <div className="flex items-center justify-start container">
          <div className="flex items-center gap-5">
            <div className="text text-3xl flex items-center justify-start gap-5 font-bold text-neutral-800">
              {" "}
              <Breadcrumb>
                <BreadcrumbList>
                  {pathSegments.map((segment, index) => {
                    const href =
                      "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbItem className="text-xl font-medium">
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
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="default"
            className="hidden sm:flex items-center"
            onClick={() => setOpenTenderModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tender
          </Button>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <div className="relative">
              <DropdownMenuTrigger asChild className="border">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              {/* Add relative wrapper here */}
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute right-0 mt-4 w-80 rounded-md border bg-white shadow-xl z-50"
                >
                  <div className="p-2">
                    <div className="text-sm font-semibold px-2 py-1">
                      Notifications
                    </div>
                    <hr className="my-1" />
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">
                          5 minutes ago
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">
                          1 hour ago
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="flex flex-col items-start gap-1 px-2 py-1">
                        <span className="font-medium">
                          You received a new bid on 'Office Renovation Project'.
                        </span>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </DropdownMenu>

          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors rounded-full px-3 py-2"
              onClick={() => setprofileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AS
              </div>
            </div>
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden"
                >
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setprofileDropdownOpen(false)}
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setprofileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setprofileDropdownOpen(false)}
                    >
                      <LifeBuoy className="w-4 h-4 text-gray-500" />
                      Help
                    </Link>

                    {/* Separator */}
                    <div className="border-t border-gray-200 my-1" />

                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-all"
                      onClick={() => setprofileDropdownOpen(false)}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign out
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>{" "}
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
