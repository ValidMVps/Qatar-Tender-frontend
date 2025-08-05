"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ActiveProjectsList } from "@/components/active-projects-list"
import {
  Plus,
  FolderOpen,
  DollarSign,
  Calendar,
  Filter,
  Eye,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Star,
  Users,
  Search,
  Edit,
  Download,
} from "lucide-react"
import Link from "next/link"

// Sample data
const sampleProjects = [
  {
    id: 1,
    title: "Office Building Construction Project",
    description:
      "Complete construction of a 5-story office building with modern amenities in West Bay. Awarded to Doha Elite Construction.",
    budget: "152,000",
    startDate: "2024-02-01",
    endDate: "2024-08-30",
    status: "in-progress",
    progress: 60,
    category: "Construction",
    awardedTo: "Doha Elite Construction",
    awardedToRating: 4.9,
    awardedToProjects: 45,
    awardedToOnTime: 98,
    lastUpdate: "2024-04-15",
  },
  {
    id: 2,
    title: "HVAC System Installation for Commercial Building",
    description:
      "Installation of a complete HVAC system for a 5-story commercial building in Al Rayyan. Awarded to CoolAir Solutions.",
    budget: "85,000",
    startDate: "2024-01-10",
    endDate: "2024-03-15",
    status: "completed",
    progress: 100,
    category: "Maintenance",
    awardedTo: "CoolAir Solutions",
    awardedToRating: 4.7,
    awardedToProjects: 30,
    awardedToOnTime: 95,
    lastUpdate: "2024-03-10",
  },
  {
    id: 3,
    title: "Digital Marketing Campaign for New Product",
    description:
      "Comprehensive digital marketing strategy including social media, Google Ads, and content creation. Awarded to Digital Growth Agency.",
    budget: "45,000",
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    status: "in-progress",
    progress: 30,
    category: "Marketing",
    awardedTo: "Digital Growth Agency",
    awardedToRating: 4.8,
    awardedToProjects: 22,
    awardedToOnTime: 92,
    lastUpdate: "2024-03-20",
  },
  {
    id: 4,
    title: "Interior Design and Fit-out for New Office",
    description:
      "Modern interior design and complete fit-out for a new office space in The Pearl. Awarded to Elite Interiors.",
    budget: "95,000",
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    status: "completed",
    progress: 100,
    category: "Interior Design",
    awardedTo: "Elite Interiors",
    awardedToRating: 4.9,
    awardedToProjects: 38,
    awardedToOnTime: 99,
    lastUpdate: "2024-04-25",
  },
  {
    id: 5,
    title: "IT Infrastructure Upgrade",
    description:
      "Complete IT infrastructure upgrade including servers, networking equipment, and cybersecurity solutions. Awarded to Tech Solutions Qatar.",
    budget: "180,000",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "in-progress",
    progress: 10,
    category: "IT Services",
    awardedTo: "Tech Solutions Qatar",
    awardedToRating: 4.7,
    awardedToProjects: 50,
    awardedToOnTime: 96,
    lastUpdate: "2024-03-25",
  },
]

// Mock data for active projects (poster's perspective)
const mockPosterActiveProjects = [
  {
    id: "proj-1",
    title: "Website Redesign for E-commerce",
    bidderName: "Sarah Johnson",
    status: "In Progress",
    lastMessageTime: "10:15 AM",
    unreadMessages: 0,
  },
  {
    id: "proj-3",
    title: "Marketing Campaign for New Product",
    bidderName: "Fatima Khan",
    status: "Awaiting Feedback",
    lastMessageTime: "3 days ago",
    unreadMessages: 1,
  },
]

export default function DashboardProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on-hold":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.awardedTo.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Active Projects</h1>
      <ActiveProjectsList projects={mockPosterActiveProjects} chatBasePath="/dashboard/chats" role="poster" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                      <Badge className={`text-xs border flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span>{project.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Start: {project.startDate}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        End: {project.endDate}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {project.budget} QAR
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                      <span className="flex items-center font-medium text-gray-800">
                        <Award className="h-4 w-4 mr-1 text-yellow-500" />
                        Awarded to: {project.awardedTo}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        {project.awardedToRating}
                      </span>
                      <span>{project.awardedToProjects} projects</span>
                      <span>{project.awardedToOnTime}% on-time</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/project/${project.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <div className="relative group">
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-1">
                          <Link
                            href={`/edit-project/${project.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </Link>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Team
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                            <XCircle className="h-4 w-4 mr-2" />
                            Close Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "No projects match your current filters."
                : "You don't have any active projects yet."}
            </p>
            <Link href="/create-tender">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Post New Tender
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
