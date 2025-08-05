"use client"

import {
  FileText,
  Users,
  Clock,
  DollarSign,
  Eye,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const mockTenders = [
  {
    id: "T001",
    title: "Construction of New Office Building",
    status: "active",
    bids: 12,
    deadline: "2024-12-31",
  },
  {
    id: "T002",
    title: "IT Network Upgrade",
    status: "pending",
    bids: 0,
    deadline: "2024-08-15",
  },
  {
    id: "T003",
    title: "Catering Services for Event",
    status: "closed",
    bids: 5,
    deadline: "2024-07-20",
  },
  {
    id: "T004",
    title: "Supply of Office Furniture",
    status: "awarded",
    bids: 8,
    deadline: "2024-07-05",
  },
  {
    id: "T005",
    title: "Digital Marketing Campaign",
    status: "active",
    bids: 7,
    deadline: "2024-09-30",
  },
]

const analyticsData = {
  avgBidsPerTender: 8.7,
  avgResponseTime: "2.3 hours",
  totalPostedValue: "260,000",
  completedProjects: 12,
  activeProjects: 3,
}

const recentActivity = [
  {
    message: "You received a new bid on 'Office Building'",
    type: "bid",
    time: "2 minutes ago",
  },
  {
    message: "You posted a new tender 'Digital Marketing Campaign'",
    type: "tender",
    time: "1 hour ago",
  },
  {
    message: "You awarded 'Office Furniture Supply'",
    type: "award",
    time: "1 day ago",
  },
  {
    message: "You closed the tender 'Catering Services'",
    type: "tender",
    time: "2 days ago",
  },
]

export default function DashboardPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      case "awarded":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-500">Awarded</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto  space-y-6">
        {/* Welcome Box */}
        {/* Welcome Box */}
{/* Welcome Box */}
<div className="bg-emerald-600 rounded-lg text-white px-8 py-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  {/* Left Section */}
  <div className="space-y-1">
    <h2 className="text-2xl font-semibold">Welcome back Ahmed Al-Mahmoud</h2>
    <p className="text-sm text-white/90">
      Manage your tenders, track bids, and post new opportunities.
    </p>
   </div>

  {/* Right Section */}
  <Link href="/dashboard/post-tender">
    <Button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold">
      Post a Tender
    </Button>
  </Link>
</div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tenders */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tenders</CardTitle>
              <Link href="/dashboard/my-tenders">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>View All</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTenders.map((tender) => (
                    <TableRow key={tender.id}>
                      <TableCell className="font-medium">{tender.title}</TableCell>
                      <TableCell>{getStatusBadge(tender.status)}</TableCell>
                      <TableCell>{tender.bids}</TableCell>
                      <TableCell>{tender.deadline}</TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/tender/${tender.id}`}>
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "bid"
                            ? "bg-blue-500"
                            : activity.type === "tender"
                            ? "bg-green-500"
                            : activity.type === "award"
                            ? "bg-purple-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
{/* Quick Analytics */}
<Card className="border border-gray-200 shadow-sm">
  <CardHeader>
    <CardTitle className="text-lg font-semibold flex items-center">
      <BarChart3 className="h-5 w-5 mr-2" />
      Quick Analytics
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Total Tenders Posted</span>
        <span className="font-semibold text-gray-900">24</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Pending Approval</span>
        <span className="font-semibold text-gray-900">3</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Active (Live) Tenders</span>
        <span className="font-semibold text-gray-900">8</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Closed/Completed Tenders</span>
        <span className="font-semibold text-gray-900">13</span>
      </div>
    </div>
    <Link href="/dashboard/analytics">
      <Button variant="outline" className="w-full mt-4 bg-transparent">
        View Detailed Analytics
      </Button>
    </Link>
  </CardContent>
</Card>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
