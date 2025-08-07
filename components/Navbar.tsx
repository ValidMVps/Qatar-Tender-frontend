"use client";

import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  CreditCard,
  LifeBuoy,
  LogOut,
  Menu,
  Plus,
  Settings,
  Sparkles,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Ensure framer-motion is installed
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface SidebarLink {
  name: string;
  href: string;
}

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarLinks: SidebarLink[];
}

function Navbar({ sidebarOpen, setSidebarOpen, sidebarLinks }: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Convert path to array like ['dashboard', 'tenders']
  const pathSegments = pathname.split("/").filter(Boolean);

  // Capitalize utility
  const toTitleCase = (str: string) =>
    str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-15 py-4">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle */}
        <div className="flex items-center">
          <div className="text text-3xl font-bold text-neutral-800">
            {" "}
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
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

        {/* Right Side Items */}
        <div className="flex items-center space-x-4">
          <Link href="/create-tender">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Post Tender</span>
            </Button>
          </Link>

          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors rounded-full px-3 py-2"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
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
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LifeBuoy className="w-4 h-4 text-gray-500" />
                      Help
                    </Link>

                    {/* Separator */}
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
