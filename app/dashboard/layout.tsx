"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()

  // Mock user data - in real app this would come from auth context
  const currentUser = {
    name: "Ahmed Al-Mahmoud",
    email: "ahmed@example.com",
    avatar: "AM",
    company: "Al-Mahmoud Enterprises",
  }

  const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Tenders", href: "/dashboard/my-tenders", icon: FileText },
    { name: "Active Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Ratings & Reviews", href: "/dashboard/ratings", icon: Star }, // Added Ratings & Reviews link
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ]

  const getCurrentPageName = () => {
    const currentLink = sidebarLinks.find((link) => pathname === link.href)
    return currentLink?.name || "Dashboard"
  }

  return (
    <AuthGuard requiredRole="poster">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-shrink-0 items-center px-4 py-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">TenderHub Qatar</span>
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {sidebarLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        pathname === item.href
                          ? "bg-emerald-100 text-emerald-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          pathname === item.href ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } flex-shrink-0 hidden lg:flex lg:flex-col`}
        >
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && <span className="text-xl font-semibold text-gray-900">TenderHub</span>}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-12 bg-white border border-gray-200 rounded-full p-1 shadow-sm"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="px-4 pb-4 flex-1">
            <div className="space-y-2">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href || (item.href === "/dashboard" && pathname === "/")
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button type="button" className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">{getCurrentPageName()}</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/create-tender">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Post Tender</span>
                  </Button>
                </Link>

                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <div
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {currentUser.avatar}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">{currentUser.company}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                        <Link
                          href="/dashboard/help"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Help
                        </Link>
                        <Link href="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Sign out
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
