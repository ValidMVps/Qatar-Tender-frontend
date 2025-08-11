"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState } from "react"
import Link from "next/link"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Eye,
  XCircle,
  Clock,
  Info,
  DollarSign,
  Calendar,
  FileText,
  Lock,
  Trophy,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define Bid interface and sampleBids directly for demonstration
interface Bid {
  id: string
  tenderId: string
  tenderTitle: string
  bidAmount: number
  submittedAt: string
  status: "pending" | "awarded" | "rejected" | "Withdrawn" | "closed"
  rejectionReason?: string
  bidDescription: string
  budget: number
  deadline: string
  category: string
  location: string
  clientName: string
  description: string // Original tender description
}

const sampleBids: Bid[] = [
  {
    id: "bid-1",
    tenderId: "tender-101",
    tenderTitle: "Website Redesign Project",
    bidAmount: 5000,
    submittedAt: "2024-07-20",
    status: "awarded",
    bidDescription: "Comprehensive redesign focusing on modern UI/UX and performance optimization.",
    budget: 7500,
    deadline: "2024-08-30",
    category: "Web Development",
    location: "Doha, Qatar",
    clientName: "Tech Solutions Inc.",
    description:
      "Client requires a complete overhaul of their existing corporate website to improve user engagement and brand image.",
  },
  {
    id: "bid-2",
    tenderId: "tender-102",
    tenderTitle: "Mobile App Development",
    bidAmount: 12000,
    submittedAt: "2024-07-18",
    status: "pending",
    bidDescription: "Development of a cross-platform mobile application for iOS and Android using React Native.",
    budget: 15000,
    deadline: "2024-09-15",
    category: "Mobile Development",
    location: "Remote",
    clientName: "Innovate Apps LLC",
    description:
      "Seeking a developer to build a new mobile application for their e-commerce platform, including user authentication and product listings.",
  },
  {
    id: "bid-3",
    tenderId: "tender-103",
    tenderTitle: "SEO Optimization Service",
    bidAmount: 1500,
    submittedAt: "2024-07-15",
    status: "rejected",
    rejectionReason: "Bid amount was higher than other competitive offers.",
    bidDescription: "Monthly SEO services including keyword research, on-page optimization, and link building.",
    budget: 1000,
    deadline: "2024-07-25",
    category: "Digital Marketing",
    location: "Doha, Qatar",
    clientName: "Marketing Pros",
    description:
      "Looking for an SEO expert to improve search engine rankings and organic traffic for their online business.",
  },
  {
    id: "bid-4",
    tenderId: "tender-104",
    tenderTitle: "Graphic Design for Branding",
    bidAmount: 2500,
    submittedAt: "2024-07-10",
    status: "Withdrawn", // Using "Withdrawn" as a status for demonstration
    bidDescription: "Creation of a new brand identity, including logo, color palette, and typography guidelines.",
    budget: 3000,
    deadline: "2024-08-01",
    category: "Graphic Design",
    location: "Remote",
    clientName: "Creative Solutions",
    description: "Need a graphic designer to develop a comprehensive brand guide for a new startup.",
  },
  {
    id: "bid-5",
    tenderId: "tender-105",
    tenderTitle: "IT Network Setup",
    bidAmount: 8000,
    submittedAt: "2024-07-05",
    status: "closed",
    bidDescription: "Installation and configuration of a new office network, including servers and workstations.",
    budget: 9000,
    deadline: "2024-07-28",
    category: "IT Services",
    location: "Al Khor, Qatar",
    clientName: "Enterprise Systems",
    description:
      "Require an IT professional to set up a secure and efficient network infrastructure for their new office.",
  },
  {
    id: "bid-6",
    tenderId: "tender-106",
    tenderTitle: "Content Writing for Blog",
    bidAmount: 700,
    submittedAt: "2024-07-22",
    status: "pending",
    bidDescription: "Writing 5 blog posts per month on technology trends, 1000 words each.",
    budget: 800,
    deadline: "2024-08-25",
    category: "Content Creation",
    location: "Remote",
    clientName: "Bloggers United",
    description: "Seeking a content writer for regular blog posts on various tech topics.",
  },
]

export default function MyBidsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [bids, setBids] = useState<Bid[]>(sampleBids)
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false)
  const [selectedBidForDetails, setSelectedBidForDetails] = useState<Bid | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "awarded":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Withdrawn":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "closed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "awarded":
        return "Awarded"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      case "Withdrawn":
        return "Withdrawn"
      case "closed":
        return "Closed"
      default:
        return "Unknown"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "awarded":
        return <Trophy className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "Withdrawn":
        return <FileText className="h-4 w-4" />
      case "closed":
        return <Lock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredBids = bids.filter((bid) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return bid.status === "pending" || bid.status === "awarded"
    return bid.status === activeTab
  })

  const handleViewBidDetails = (bid: Bid) => {
    setSelectedBidForDetails(bid)
    setShowBidDetailsModal(true)
  }

  const handleEditBid = (bidId: string) => {
    toast({
      title: "Edit Bid",
      description: `Navigating to edit bid ${bidId}. (Functionality not yet implemented)`,
    })
    console.log(`Edit bid: ${bidId}`)
    // Implement navigation to an edit page or open an edit modal
  }

  const handleDeleteBid = (bidId: string) => {
    toast({
      title: "Delete Bid",
      description: `Deleting bid ${bidId}. (Functionality not yet implemented)`,
    })
    console.log(`Delete bid: ${bidId}`)
    setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId))
  }

  const handleReapply = (bidId: string) => {
    toast({
      title: "Reapplication Submitted",
      description: `You have reapplied for bid ${bidId}.`,
    })
    setShowBidDetailsModal(false)
    setBids((prevBids) =>
      prevBids.map((bid) => (bid.id === bidId ? { ...bid, status: "pending", rejectionReason: undefined } : bid)),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Bids</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="awarded">Awarded</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender Title</TableHead>
                  <TableHead>Your Bid Amount</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBids.length > 0 ? (
                  filteredBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">{bid.tenderTitle}</TableCell>
                      <TableCell>{bid.bidAmount} QAR</TableCell>
                      <TableCell>{bid.submittedAt}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border flex items-center space-x-1 ${getStatusColor(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          <span>{getStatusText(bid.status)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewBidDetails(bid)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Bid
                            </DropdownMenuItem>
                            {bid.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleEditBid(bid.id)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Bid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteBid(bid.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Bid
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-600">
                      No bids found for this status.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bid Details Modal */}
      {selectedBidForDetails && (
        <Dialog open={showBidDetailsModal} onOpenChange={setShowBidDetailsModal}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedBidForDetails.tenderTitle}</DialogTitle>
              <DialogDescription>Details of your submitted bid and the original tender.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Your Bid Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Your Bid Amount:</strong> {selectedBidForDetails.bidAmount} QAR
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Submitted On:</strong> {selectedBidForDetails.submittedAt}
                    </p>
                    <p className="flex items-center">
                      {getStatusIcon(selectedBidForDetails.status)}
                      <strong className="ml-2">Status:</strong>{" "}
                      <Badge
                        className={`ml-2 text-xs border flex items-center space-x-1 ${getStatusColor(selectedBidForDetails.status)}`}
                      >
                        <span>{getStatusText(selectedBidForDetails.status)}</span>
                      </Badge>
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-base mb-2">Your Bid Description:</h4>
                    <p className="text-sm text-gray-700">{selectedBidForDetails.bidDescription}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Original Tender Overview</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Budget:</strong> {selectedBidForDetails.budget} QAR
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Deadline:</strong> {selectedBidForDetails.deadline}
                    </p>
                    <p className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Category:</strong> {selectedBidForDetails.category}
                    </p>
                    <p className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Location:</strong> {selectedBidForDetails.location}
                    </p>
                    <p className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>Client:</strong> {selectedBidForDetails.clientName}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-base mb-2">Tender Description:</h4>
                    <p className="text-sm text-gray-700">{selectedBidForDetails.description}</p>
                  </div>
                </div>
              </div>

              {selectedBidForDetails.status === "rejected" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-red-600 mr-3 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-1">Rejection Reason</h3>
                      <p className="text-sm text-red-800">{selectedBidForDetails.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Link href={`/business-dashboard/service-providing/tender-details/${selectedBidForDetails.tenderId}`}>
                <Button variant="outline" className="mr-2 bg-transparent">
                  View Original Tender
                </Button>
              </Link>
              {selectedBidForDetails.status === "rejected" && (
                <Button onClick={() => handleReapply(selectedBidForDetails.id)} className="mr-2">
                  Reapply
                </Button>
              )}
              <Button onClick={() => setShowBidDetailsModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
