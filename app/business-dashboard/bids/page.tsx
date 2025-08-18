"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { useTranslation } from "../../../lib/hooks/useTranslation";
interface Bid {
  id: string;
  tenderId: string;
  tenderTitle: string;
  bidAmount: number;
  submittedAt: string;
  status: "pending" | "awarded" | "rejected" | "Withdrawn" | "closed";
  rejectionReason?: string;
  bidDescription: string;
  budget: number;
  deadline: string;
  category: string;
  location: string;
  clientName: string;
  description: string;
}

const sampleBids: Bid[] = [
  {
    id: "bid-1",
    tenderId: "tender-101",
    tenderTitle: "Website Redesign Project",
    bidAmount: 5000,
    submittedAt: "2024-07-20",
    status: "awarded",
    bidDescription:
      "Comprehensive redesign focusing on modern UI/UX and performance optimization.",
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
    bidDescription:
      "Development of a cross-platform mobile application for iOS and Android using React Native.",
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
    bidDescription:
      "Monthly SEO services including keyword research, on-page optimization, and link building.",
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
    status: "Withdrawn",
    bidDescription:
      "Creation of a new brand identity, including logo, color palette, and typography guidelines.",
    budget: 3000,
    deadline: "2024-08-01",
    category: "Graphic Design",
    location: "Remote",
    clientName: "Creative Solutions",
    description:
      "Need a graphic designer to develop a comprehensive brand guide for a new startup.",
  },
  {
    id: "bid-5",
    tenderId: "tender-105",
    tenderTitle: "IT Network Setup",
    bidAmount: 8000,
    submittedAt: "2024-07-05",
    status: "closed",
    bidDescription:
      "Installation and configuration of a new office network, including servers and workstations.",
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
    bidDescription:
      "Writing 5 blog posts per month on technology trends, 1000 words each.",
    budget: 800,
    deadline: "2024-08-25",
    category: "Content Creation",
    location: "Remote",
    clientName: "Bloggers United",
    description:
      "Seeking a content writer for regular blog posts on various tech topics.",
  },
];

export default function MyBidsPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("all");
  const [bids, setBids] = useState<Bid[]>(sampleBids);
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false);
  const [selectedBidForDetails, setSelectedBidForDetails] =
    useState<Bid | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "awarded":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Withdrawn":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "closed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "awarded":
        return "Awarded";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      case "Withdrawn":
        return "Withdrawn";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "awarded":
        return <Trophy className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "Withdrawn":
        return <FileText className="h-4 w-4" />;
      case "closed":
        return <Lock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get unique categories for the filter
  const categories = ["all", ...new Set(bids.map((bid) => bid.category))];

  // Analytics calculations
  const totalBids = bids.length;
  const activeBids = bids.filter(
    (bid) => bid.status === "pending" || bid.status === "awarded"
  ).length;
  const awardedBids = bids.filter((bid) => bid.status === "awarded").length;
  const rejectedBids = bids.filter((bid) => bid.status === "rejected").length;
  const closedBids = bids.filter((bid) => bid.status === "closed").length;

  const filteredBids = bids.filter((bid) => {
    // Filter by tab
    let tabFilter = true;
    if (activeTab !== "all") {
      if (activeTab === "active") {
        tabFilter = bid.status === "pending" || bid.status === "awarded";
      } else {
        tabFilter = bid.status === activeTab;
      }
    }

    // Filter by search query
    const searchFilter =
      searchQuery === "" ||
      bid.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const categoryFilter =
      selectedCategory === "all" || bid.category === selectedCategory;

    return tabFilter && searchFilter && categoryFilter;
  });

  const handleViewBidDetails = (bid: Bid) => {
    setSelectedBidForDetails(bid);
    setShowBidDetailsModal(true);
  };

  const handleEditBid = (bidId: string) => {
    toast({
      title: "Edit Bid",
      description: `Navigating to edit bid ${bidId}. (Functionality not yet implemented)`,
    });
  };

  const handleDeleteBid = (bidId: string) => {
    toast({
      title: "Delete Bid",
      description: `Deleting bid ${bidId}. (Functionality not yet implemented)`,
    });
    setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
  };

  const handleReapply = (bidId: string) => {
    toast({
      title: "Reapplication Submitted",
      description: `You have reapplied for bid ${bidId}.`,
    });
    setShowBidDetailsModal(false);
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid.id === bidId
          ? { ...bid, status: "pending", rejectionReason: undefined }
          : bid
      )
    );
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t("total_bids")}
            </CardTitle>
            <FileText className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalBids}</div>
            <p className="text-xs text-white opacity-80">
              {t("all_submitted_bids")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t("active_bids")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeBids}</div>
            <p className="text-xs text-white opacity-80">
              {t("pending_and_awarded")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t("awarded_bids")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{awardedBids}</div>
            <p className="text-xs text-white opacity-80">
              {t("successfully_awarded")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t("rejected_bids")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{rejectedBids}</div>
            <p className="text-xs text-white opacity-80">
              {t("not_successful")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {t("closed_bids")}
            </CardTitle>
            <Lock className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{closedBids}</div>
            <p className="text-xs text-white opacity-80">
              {t("tender_completed")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-lg ">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("search_bids_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("select_category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_categories")}</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 rounded-lg border bg-gray-50 p-1">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="active">{t("active")}</TabsTrigger>
          <TabsTrigger value="awarded">{t("awarded")}</TabsTrigger>
          <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
          <TabsTrigger value="closed">{t("closed")}</TabsTrigger>
          <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3">
                    {t("tender_title")}
                  </TableHead>
                  <TableHead className="px-6 py-3">{t("category")}</TableHead>
                  <TableHead className="px-6 py-3">{t("your_bid")}</TableHead>
                  <TableHead className="px-6 py-3">{t("submitted")}</TableHead>
                  <TableHead className="px-6 py-3">{t("status")}</TableHead>
                  <TableHead className="px-6 py-3 text-right">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBids.length > 0 ? (
                  filteredBids.map((bid) => (
                    <TableRow
                      key={bid.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="px-6 py-4 font-medium">
                        <div>
                          <div className="font-semibold">{bid.tenderTitle}</div>
                          <div className="text-sm text-gray-500">
                            {bid.clientName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="text-xs">
                          {bid.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-semibold">{bid.bidAmount} QAR</div>
                        <div className="text-xs text-gray-500">
                          {t("budget")}: {bid.budget} QAR
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {bid.submittedAt}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          className={`text-xs border flex items-center gap-1 w-fit ${getStatusColor(
                            bid.status
                          )}`}
                        >
                          {getStatusIcon(bid.status)}
                          {getStatusText(bid.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewBidDetails(bid)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("view")}
                            </DropdownMenuItem>
                            {bid.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleEditBid(bid.id)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                {t("edit")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteBid(bid.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-gray-300" />
                        <p>{t("no_bids_found")}</p>
                        <p className="text-sm">
                          {t("try_adjusting_search_filters")}
                        </p>
                      </div>
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
        <Dialog
          open={showBidDetailsModal}
          onOpenChange={setShowBidDetailsModal}
        >
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedBidForDetails.tenderTitle}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {t("bid_details_description")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {t("your_bid_details")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("bid")}:</strong>{" "}
                      {selectedBidForDetails.bidAmount} QAR
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("submitted")}:</strong>{" "}
                      {selectedBidForDetails.submittedAt}
                    </p>
                    <p className="flex items-center">
                      {getStatusIcon(selectedBidForDetails.status)}
                      <strong className="ml-2">{t("status")}:</strong>
                      <Badge
                        className={`ml-2 text-xs border ${getStatusColor(
                          selectedBidForDetails.status
                        )}`}
                      >
                        {getStatusText(selectedBidForDetails.status)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("bid_description")}:
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedBidForDetails.bidDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {t("tender_overview")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("budget")}:</strong>{" "}
                      {selectedBidForDetails.budget} QAR
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("deadline")}:</strong>{" "}
                      {selectedBidForDetails.deadline}
                    </p>
                    <p className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("category")}:</strong>{" "}
                      {selectedBidForDetails.category}
                    </p>
                    <p className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("location")}:</strong>{" "}
                      {selectedBidForDetails.location}
                    </p>
                    <p className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      <strong>{t("client")}:</strong>{" "}
                      {selectedBidForDetails.clientName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {t("tender_description")}:
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedBidForDetails.description}
                    </p>
                  </div>
                </div>
              </div>

              {selectedBidForDetails.status === "rejected" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-red-600 mr-3 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-1">
                        {t("rejection_reason")}
                      </h3>
                      <p className="text-sm text-red-800">
                        {selectedBidForDetails.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-wrap gap-2">
              <Link
                href={`/business-dashboard/service-providing/tender-details/${selectedBidForDetails.tenderId}`}
              >
                <Button variant="outline">{t("view_original_tender")}</Button>
              </Link>
              {selectedBidForDetails.status === "rejected" && (
                <Button onClick={() => handleReapply(selectedBidForDetails.id)}>
                  {t("reapply")}
                </Button>
              )}
              <Button onClick={() => setShowBidDetailsModal(false)}>
                {t("close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
