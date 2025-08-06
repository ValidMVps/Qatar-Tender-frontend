"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  Share2,
  AlertTriangle,
  Download,
  Printer,
  Award,
  RefreshCcw,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Sample data with more diverse scenarios
const sampleTenders = [
  {
    id: 1,
    title: "Office Building Construction Project",
    description:
      "We are looking for a qualified contractor to handle this important construction project in West Bay. The project involves complete construction of a 5-story office building with modern amenities.",
    budget: "150,000",
    deadline: "2024-02-15",
    status: "active",
    bidsCount: 8,
    awardedBid: true,
    isCompleted: false,
    category: "Construction",
    location: "West Bay, Doha",
    createdAt: "2024-01-10",
    postedDate: "Jan 10, 2024",
  },
  {
    id: 2,
    title: "Website Development and Design",
    description:
      "Modern responsive website needed for our consulting firm with Arabic and English support. Must include CMS, SEO optimization, and mobile-first design approach.",
    budget: "25,000",
    deadline: "2024-02-20",
    status: "draft", // Changed from pending
    bidsCount: 5,
    awardedBid: false,
    isCompleted: false,
    category: "IT Services",
    location: "Doha, Qatar",
    createdAt: "2024-01-12",
    postedDate: "Not posted yet", // Changed from Pending Admin Approval
  },
  {
    id: 3,
    title: "HVAC System Installation",
    description:
      "Complete HVAC system installation for a 5-story commercial building. Includes design, installation, testing, and 2-year maintenance contract.",
    budget: "85,000",
    deadline: "2024-01-25",
    status: "closed",
    bidsCount: 6,
    awardedBid: true,
    isCompleted: true,
    category: "Maintenance",
    location: "Al Rayyan, Qatar",
    createdAt: "2024-01-05",
    postedDate: "Jan 5, 2024",
  },
  {
    id: 4,
    title: "Legal Advisory Services",
    description:
      "Seeking legal expertise for contract review and compliance with Qatar regulations. Ongoing consultation needed for 6 months.",
    budget: "35,000",
    deadline: "2024-02-28",
    status: "active",
    bidsCount: 4,
    awardedBid: false,
    isCompleted: false,
    category: "Legal",
    location: "Doha, Qatar",
    createdAt: "2024-01-15",
    postedDate: "Jan 15, 2024",
  },
  {
    id: 5,
    title: "Transportation Fleet Management",
    description:
      "Looking for a service provider to manage our company's transportation fleet of 25 vehicles. Includes maintenance, driver management, and route optimization.",
    budget: "120,000",
    deadline: "2024-03-10",
    status: "draft",
    bidsCount: 0,
    awardedBid: false,
    isCompleted: false,
    category: "Transportation",
    location: "Lusail, Qatar",
    createdAt: "2024-01-18",
    postedDate: "Not posted yet",
  },
  {
    id: 6,
    title: "Digital Marketing Campaign",
    description:
      "Comprehensive digital marketing strategy for our new product launch. Includes social media, Google Ads, content creation, and analytics reporting.",
    budget: "45,000",
    deadline: "2024-02-10",
    status: "active",
    bidsCount: 12,
    awardedBid: true,
    isCompleted: false,
    category: "Marketing",
    location: "Doha, Qatar",
    createdAt: "2024-01-08",
    postedDate: "Jan 8, 2024",
  },
  {
    id: 7,
    title: "Security System Upgrade",
    description:
      "Upgrade existing security system with modern CCTV cameras, access control, and monitoring software for our corporate headquarters.",
    budget: "65,000",
    deadline: "2024-02-25",
    status: "draft", // Changed from pending
    bidsCount: 3,
    awardedBid: false,
    isCompleted: false,
    category: "Security",
    location: "West Bay, Doha",
    createdAt: "2024-01-16",
    postedDate: "Not posted yet", // Changed from Pending Admin Approval
  },
  {
    id: 8,
    title: "Catering Services Contract",
    description:
      "Daily catering services for our office of 150 employees. Includes breakfast, lunch, and evening snacks with dietary options.",
    budget: "180,000",
    deadline: "2024-03-01",
    status: "active",
    bidsCount: 15,
    awardedBid: false,
    isCompleted: false,
    category: "Food & Beverage",
    location: "Al Sadd, Doha",
    createdAt: "2024-01-20",
    postedDate: "Jan 20, 2024",
  },
  {
    id: 9,
    title: "Interior Design and Fit-out",
    description:
      "Complete interior design and fit-out for new office space. Modern, functional design with meeting rooms, open workspace, and executive offices.",
    budget: "95,000",
    deadline: "2024-01-30",
    status: "closed",
    bidsCount: 9,
    awardedBid: true,
    isCompleted: true,
    category: "Interior Design",
    location: "The Pearl, Doha",
    createdAt: "2024-01-03",
    postedDate: "Jan 3, 2024",
  },
  {
    id: 10,
    title: "Accounting and Bookkeeping Services",
    description:
      "Monthly accounting and bookkeeping services for small business. Includes tax preparation, financial reporting, and compliance management.",
    budget: "18,000",
    deadline: "2024-02-15",
    status: "draft",
    bidsCount: 0,
    awardedBid: false,
    isCompleted: false,
    category: "Finance",
    location: "Doha, Qatar",
    createdAt: "2024-01-22",
    postedDate: "Not posted yet",
  },
  {
    id: 11,
    title: "Event Management - Annual Conference",
    description:
      "Complete event management for our annual business conference. Expected 300 attendees, venue booking, catering, AV equipment, and logistics.",
    budget: "75,000",
    deadline: "2024-02-05",
    status: "active",
    bidsCount: 7,
    awardedBid: false,
    isCompleted: false,
    category: "Events",
    location: "Doha, Qatar",
    createdAt: "2024-01-14",
    postedDate: "Jan 14, 2024",
  },
  {
    id: 12,
    title: "Solar Panel Installation",
    description:
      "Installation of solar panel system for commercial building. Includes design, installation, grid connection, and 5-year maintenance contract.",
    budget: "220,000",
    deadline: "2024-03-15",
    status: "draft", // Changed from pending
    bidsCount: 2,
    awardedBid: false,
    isCompleted: false,
    category: "Energy",
    location: "Industrial Area, Doha",
    createdAt: "2024-01-19",
    postedDate: "Not posted yet", // Changed from Pending Admin Approval
  },
  {
    id: 13,
    title: "Office Furniture Supply",
    description:
      "Supply and installation of office furniture for 50 employees. Includes desks, chairs, meeting tables, and storage solutions.",
    budget: "65,000",
    deadline: "2024-02-28",
    status: "active",
    bidsCount: 8,
    awardedBid: false,
    isCompleted: false,
    category: "Furniture",
    location: "Doha, Qatar",
    createdAt: "2024-01-21",
    postedDate: "Jan 21, 2024",
  },
  {
    id: 14,
    title: "Translation Services",
    description:
      "Professional translation services for corporate documents from English to Arabic and vice versa. Approximately 500 pages of technical content.",
    budget: "12,000",
    deadline: "2024-02-10",
    status: "rejected",
    bidsCount: 0,
    awardedBid: false,
    isCompleted: false,
    category: "Language Services",
    location: "Doha, Qatar",
    createdAt: "2024-01-15",
    postedDate: "Jan 15, 2024 (Rejected)",
    rejectionReason: "Service category not currently supported on the platform",
  },
  {
    id: 15,
    title: "IT Infrastructure Upgrade",
    description:
      "Complete IT infrastructure upgrade including servers, networking equipment, and cybersecurity solutions for corporate headquarters.",
    budget: "180,000",
    deadline: "2024-03-20",
    status: "active",
    bidsCount: 6,
    awardedBid: true,
    isCompleted: true,
    category: "IT Services",
    location: "West Bay, Doha",
    createdAt: "2024-01-12",
    postedDate: "Jan 12, 2024",
  },
  {
    id: 16,
    title: "Corporate Training Program Development",
    description:
      "Comprehensive corporate training program for 200+ employees covering leadership, digital skills, and compliance. Includes curriculum development, training materials, and delivery across multiple locations.",
    budget: "95,000",
    deadline: "2024-03-05",
    status: "active",
    bidsCount: 4,
    awardedBid: false,
    isCompleted: false,
    category: "Training & Development",
    location: "Multiple Locations, Qatar",
    createdAt: "2024-01-08",
    postedDate: "Jan 8, 2024",
  },
];

export default function MyTendersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [tenders, setTenders] = useState(sampleTenders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState<{
    show: boolean;
    action: string;
    tenderId: number | null;
  }>({
    show: false,
    action: "",
    tenderId: null,
  });
  const [showReapplyModal, setShowReapplyModal] = useState<{
    show: boolean;
    tender: (typeof sampleTenders)[0] | null;
  }>({
    show: false,
    tender: null,
  });
  const [reapplyFormData, setReapplyFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  // Get unique categories for filter
  const categories = [
    ...new Set(tenders.map((tender) => tender.category)),
  ].sort();

  const getStatusColor = (tender: (typeof sampleTenders)[0]) => {
    if (tender.isCompleted) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    if (tender.awardedBid) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    switch (tender.status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      // Removed 'pending' case
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (tender: (typeof sampleTenders)[0]) => {
    if (tender.isCompleted) {
      return "Completed";
    }
    if (tender.awardedBid) {
      return "Awarded";
    }
    switch (tender.status) {
      case "active":
        return "Active";
      // Removed 'pending' case
      case "closed":
        return "Closed";
      case "draft":
        return "Draft";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (tender: (typeof sampleTenders)[0]) => {
    if (tender.isCompleted) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (tender.awardedBid) {
      return <Award className="h-4 w-4" />;
    }
    switch (tender.status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      // Removed 'pending' case
      case "closed":
        return <AlertCircle className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredTenders = tenders.filter((tender) => {
    // Filter by tab
    let tabMatch = true;
    if (activeTab === "all") tabMatch = true;
    else if (activeTab === "awarded") tabMatch = tender.awardedBid;
    else if (activeTab === "completed") tabMatch = tender.isCompleted;
    else tabMatch = tender.status === activeTab;

    // Filter by search query
    const searchMatch =
      searchQuery === "" ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const categoryMatch =
      selectedCategory === "all" || tender.category === selectedCategory;

    return tabMatch && searchMatch && categoryMatch;
  });

  const handleDeleteTender = (id: number) => {
    setTenders(tenders.filter((tender) => tender.id !== id));
    setShowConfirmModal({ show: false, action: "", tenderId: null });
  };

  const handleCloseTender = (id: number) => {
    setTenders(
      tenders.map((tender) =>
        tender.id === id ? { ...tender, status: "closed" } : tender
      )
    );
    setShowConfirmModal({ show: false, action: "", tenderId: null });
  };

  const handleDuplicateTender = (id: number) => {
    const tenderToDuplicate = tenders.find((tender) => tender.id === id);
    if (tenderToDuplicate) {
      const newTender = {
        ...tenderToDuplicate,
        id: Math.max(...tenders.map((t) => t.id)) + 1,
        title: `Copy of ${tenderToDuplicate.title}`,
        status: "draft",
        bidsCount: 0,
        awardedBid: false,
        isCompleted: false, // New duplicated tender is not completed
        createdAt: new Date().toISOString().split("T")[0],
        postedDate: "Not posted yet",
      };
      setTenders([newTender, ...tenders]);
    }
  };

  const handleReapplyTender = (tenderId: number) => {
    const tenderToReapply = tenders.find((tender) => tender.id === tenderId);
    if (tenderToReapply) {
      setReapplyFormData({
        title: tenderToReapply.title,
        description: tenderToReapply.description,
        budget: tenderToReapply.budget,
      });
      setShowReapplyModal({ show: true, tender: tenderToReapply });
    }
  };

  const submitReapply = () => {
    if (showReapplyModal.tender) {
      setTenders(
        tenders.map((t) =>
          t.id === showReapplyModal.tender?.id
            ? {
                ...t,
                title: reapplyFormData.title,
                description: reapplyFormData.description,
                budget: reapplyFormData.budget,
                status: "draft", // Changed from pending
                postedDate: "Not posted yet", // Changed from Pending Admin Approval
                rejectionReason: undefined, // Clear rejection reason on reapply
              }
            : t
        )
      );
      setShowReapplyModal({ show: false, tender: null });
      setReapplyFormData({ title: "", description: "", budget: "" }); // Clear form
    }
  };

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tenders by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px] h-11 border-neutral-300 focus:border-blue-500 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results counter 
        <div className="text-sm text-gray-600">
          Showing {filteredTenders.length} of {tenders.length} tenders
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory && selectedCategory !== "all" && ` in ${selectedCategory}`}
        </div>*/}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          {" "}
          {/* Changed grid-cols-7 to grid-cols-6 */}
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="awarded">Awarded</TabsTrigger>
          {/* Removed Pending tab */}
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredTenders.length > 0 ? (
              filteredTenders.map((tender) => (
                <Card
                  key={tender.id}
                  className="border border-neutral-200/50 rounded-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {tender.title}
                          </h3>
                          <Badge
                            className={`text-xs border flex items-center space-x-1 ${getStatusColor(
                              tender
                            )}`}
                          >
                            {getStatusIcon(tender)}
                            <span>{getStatusText(tender)}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {tender.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Posted: {tender.postedDate}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tender.bidsCount} bids
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {tender.budget} QAR
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {tender.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {tender.status !== "rejected" && (
                          <Link href={`/tender/${tender.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        )}
                        <div className="relative group">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-1">
                              {tender.status !== "closed" &&
                                tender.status !== "rejected" && (
                                  <Link
                                    href={`/edit-tender/${tender.id}`}
                                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Tender
                                  </Link>
                                )}

                              {tender.status === "active" &&
                                !tender.awardedBid && (
                                  <button
                                    onClick={() =>
                                      setShowConfirmModal({
                                        show: true,
                                        action: "close",
                                        tenderId: tender.id,
                                      })
                                    }
                                    className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Close Tender
                                  </button>
                                )}

                              {/* Reapply button moved to rejection reason modal */}

                              <button
                                onClick={() => handleDuplicateTender(tender.id)}
                                className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate Tender
                              </button>

                              <button className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Tender
                              </button>

                              <button className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Export as PDF
                              </button>

                              <button className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <Printer className="h-4 w-4 mr-2" />
                                Print Tender
                              </button>

                              <button
                                onClick={() =>
                                  setShowConfirmModal({
                                    show: true,
                                    action: "delete",
                                    tenderId: tender.id,
                                  })
                                }
                                className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Tender
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rejection reason if applicable */}
                    {tender.status === "rejected" && tender.rejectionReason && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {tender.rejectionReason}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleReapplyTender(tender.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 ml-4"
                        >
                          <RefreshCcw className="h-4 w-4 mr-1" />
                          Reapply
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-neutral-300">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tenders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ||
                  (selectedCategory && selectedCategory !== "all")
                    ? "No tenders match your search criteria. Try adjusting your search or filters."
                    : activeTab === "all"
                    ? "You haven't created any tenders yet."
                    : `No tenders match the "${activeTab}" status.`}
                </p>
                {activeTab === "all" &&
                  !searchQuery &&
                  (selectedCategory === "all" || !selectedCategory) && (
                    <Link href="/create-tender">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Tender
                      </Button>
                    </Link>
                  )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 border border-neutral-300">
            <CardContent className="p-6">
              <div className="mb-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {showConfirmModal.action === "delete"
                    ? "Confirm Delete"
                    : showConfirmModal.action === "close"
                    ? "Confirm Close Tender"
                    : "Confirm Action"}
                </h3>
                <p className="text-gray-600">
                  {showConfirmModal.action === "delete"
                    ? "Are you sure you want to delete this tender? This action cannot be undone."
                    : showConfirmModal.action === "close"
                    ? "Are you sure you want to close this tender? No more bids will be accepted."
                    : "Are you sure you want to proceed with this action?"}
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowConfirmModal({
                      show: false,
                      action: "",
                      tenderId: null,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={
                    showConfirmModal.action === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  onClick={() => {
                    if (
                      showConfirmModal.action === "delete" &&
                      showConfirmModal.tenderId
                    ) {
                      handleDeleteTender(showConfirmModal.tenderId);
                    } else if (
                      showConfirmModal.action === "close" &&
                      showConfirmModal.tenderId
                    ) {
                      handleCloseTender(showConfirmModal.tenderId);
                    }
                  }}
                >
                  {showConfirmModal.action === "delete"
                    ? "Delete"
                    : showConfirmModal.action === "close"
                    ? "Close Tender"
                    : "Confirm"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reapply Tender Modal */}
      <Dialog
        open={showReapplyModal.show}
        onOpenChange={() => setShowReapplyModal({ show: false, tender: null })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Reapply for Tender: {showReapplyModal.tender?.title}
            </DialogTitle>
            <DialogDescription>
              Edit the details below and reapply for this tender. Its status
              will change to draft.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                value={reapplyFormData.title}
                onChange={(e) =>
                  setReapplyFormData({
                    ...reapplyFormData,
                    title: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                value={reapplyFormData.description}
                onChange={(e) =>
                  setReapplyFormData({
                    ...reapplyFormData,
                    description: e.target.value,
                  })
                }
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="budget" className="text-right">
                Budget (QAR)
              </label>
              <Input
                id="budget"
                type="number"
                value={reapplyFormData.budget}
                onChange={(e) =>
                  setReapplyFormData({
                    ...reapplyFormData,
                    budget: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReapplyModal({ show: false, tender: null })}
            >
              Cancel
            </Button>
            <Button onClick={submitReapply}>Reapply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
