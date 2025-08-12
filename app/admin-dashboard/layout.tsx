import type React from "react"
import Link from "next/link"
import { LayoutDashboard, Users, FileText, Handshake, Building2, ShieldCheck, LifeBuoy, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-2">
            <Link href="/admin-dashboard">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin-dashboard/users">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <Users className="mr-3 h-5 w-5" />
                Users
              </Button>
            </Link>
            <Link href="/admin-dashboard/tenders">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <FileText className="mr-3 h-5 w-5" />
                Tenders
              </Button>
            </Link>
            <Link href="/admin-dashboard/bids">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <Handshake className="mr-3 h-5 w-5" />
                Bids
              </Button>
            </Link>
            <Link href="/admin-dashboard/kyc-verification">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <ShieldCheck className="mr-3 h-5 w-5" />
                KYC & Verification
              </Button>
            </Link>
            <Link href="/admin-dashboard/feedback-support">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <LifeBuoy className="mr-3 h-5 w-5" />
                Feedback & Support
              </Button>
            </Link>
            <Link href="/admin-dashboard/settings">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            </Link>
            <Separator className="my-4" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
            {/* Add admin specific header elements here, e.g., user menu */}
          </header>
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
