"use client";
import React, { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "../../../lib/hooks/useTranslation";

// Services
import {
  getUserBids,
  updateBid as apiUpdateBid,
  updateBidStatus as apiUpdateBidStatus,
  deleteBid,
  resubmitRevisedBid,
  retryBidPayment,
} from "@/app/services/BidService";
import { getTender } from "@/app/services/tenderService";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

// Types
interface ApiBid {
  _id: string;
  tender: string | { _id: string; title?: string };
  bidder?: string;
  amount: number;
  description: string;
  paymentStatus?: "pending" | "completed" | "failed";
  paymentAmount?: number;
  paymentId?: string;
  status:
    | "submitted"
    | "rejected"
    | "accepted"
    | "completed"
    | "under_review"
    | "returned_for_revision";
  createdAt: string;
  updatedAt?: string;
  revisionDetails?: {
    requestedAt: Date;
    reason: string;
    requestedBy: {
      _id: string;
      email: string;
    };
  };
}

type BidUI = {
  id: string;
  amount: number;
  description: string;
  status: ApiBid["status"];
  submittedAt: string;
  paymentStatus?: string;
  paymentAmount?: number;
  tenderId: string;
  tenderTitle: string;
  budget?: number | null;
  deadline?: string | null;
  category?: string | null;
  location?: string | null;
  clientName?: string | null;
  tenderDescription?: string | null;
  revisionDetails?: {
    requestedAt: string;
    reason: string;
    requestedBy: {
      _id: string;
      email: string;
    };
  };
};

export default function MyBidsPage() {
  const { t } = useTranslation();
  const [bids, setBids] = useState<BidUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false);
  const [selectedBidForDetails, setSelectedBidForDetails] =
    useState<BidUI | null>(null);
  const [bidToDelete, setBidToDelete] = useState<string | null>(null); // Track bid to delete
  const [resubmitLoading, setResubmitLoading] = useState(false);

  // New state variables for bid editing during resubmission
  const [showEditResubmitModal, setShowEditResubmitModal] = useState(false);
  const [editBidAmount, setEditBidAmount] = useState<number | "">("");
  const [editBidDescription, setEditBidDescription] = useState("");
  const [editingBidId, setEditingBidId] = useState<string | null>(null);
  const [amountError, setAmountError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Fetch bids and enrich with tender details
  const fetchBids = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBids: ApiBid[] = await getUserBids();

      const enriched = await Promise.all(
        apiBids.map(async (b) => {
          const tenderId =
            typeof b.tender === "string" ? b.tender : (b.tender as any)?._id;
          let tenderTitle = "-";
          let budget = null;
          let deadline = null;
          let category = null;
          let location = null;
          let clientName = null;
          let tenderDescription = null;

          try {
            if (tenderId) {
              const tender = await getTender(tenderId);
              tenderTitle = tender?.title || tender?.name || tenderTitle;
              budget = tender?.budget || tender?.estimatedBudget || null;
              deadline = tender?.deadline || tender?.dueDate || null;
              category = tender?.category?.name || tender?.category || null;
              location = tender?.location || null;
              clientName = tender?.clientName || tender?.owner?.name || null;
              tenderDescription = tender?.description || null;
            }
          } catch (err) {
            console.warn("Failed to fetch tender details for", tenderId, err);
          }

          return {
            id: b._id,
            amount: b.amount,
            description: b.description,
            status: b.status,
            submittedAt: b.createdAt,
            paymentStatus: b.paymentStatus,
            paymentAmount: b.paymentAmount,
            tenderId,
            tenderTitle,
            budget,
            deadline,
            category,
            location,
            clientName,
            tenderDescription,
            revisionDetails: b.revisionDetails
              ? {
                  ...b.revisionDetails,
                  requestedAt: new Date(
                    b.revisionDetails.requestedAt
                  ).toLocaleString(),
                }
              : undefined,
          } as BidUI;
        })
      );

      setBids(enriched);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load bids");
      toast({
        title: "Error",
        description: err?.message || "Failed to load bids",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  // Handlers for bid revision
  const handleResubmitBid = async (bidId: string) => {
    if (!bidId) return;

    // Find the bid to get current details
    const bid = bids.find((b) => b.id === bidId);
    if (!bid) {
      toast({
        title: t("error") || "Error",
        description: t("bid_not_found") || "Bid not found",
        variant: "destructive",
      });
      return;
    }

    // Set up editing state
    setEditingBidId(bidId);
    setEditBidAmount(bid.amount);
    setEditBidDescription(bid.description);
    setAmountError("");
    setDescriptionError("");

    // Show the edit modal
    setShowEditResubmitModal(true);
  };

  // Handle the actual resubmit with edited values
  const handleEditResubmit = async () => {
    if (!editingBidId) return;

    // Validate amount
    if (
      editBidAmount === "" ||
      isNaN(Number(editBidAmount)) ||
      Number(editBidAmount) <= 0
    ) {
      setAmountError(
        t("please_enter_valid_bid_amount") || "Please enter a valid bid amount"
      );
      return;
    }

    // Validate description
    if (editBidDescription.trim().length < 10) {
      setDescriptionError(
        t("description_must_be_at_least_10_chars") ||
          "Description must be at least 10 characters long"
      );
      return;
    }

    setResubmitLoading(true);
    try {
      const result = await resubmitRevisedBid(
        editingBidId,
        Number(editBidAmount),
        editBidDescription
      );

      if (result.success) {
        // Update bid status to "submitted"
        setBids((prev) =>
          prev.map((bid) =>
            bid.id === editingBidId
              ? {
                  ...bid,
                  status: "submitted",
                  amount: Number(editBidAmount),
                  description: editBidDescription,
                }
              : bid
          )
        );

        // Close modals
        setShowEditResubmitModal(false);
        setShowBidDetailsModal(false);

        toast({
          title:
            t("bid_updated_and_resubmitted") || "Bid updated and resubmitted",
          description:
            t("bid_has_been_resubmitted_with_changes") ||
            "Your bid has been updated and resubmitted successfully",
        });
      } else {
        throw new Error(result.error || "Failed to resubmit bid");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.message ||
          t("failed_to_resubmit_bid") ||
          "Failed to resubmit your bid",
        variant: "destructive",
      });
    } finally {
      setResubmitLoading(false);
    }
  };

  const handleEditBid = async (id: string) => {
    toast({
      title: "Edit",
      description: "Redirect to edit page (implement route).",
    });
  };

  const handleGoToChat = (bidId: string) => {
    toast({
      title: "Opening Chat",
      description: "Redirecting to chat...",
    });
  };

  // Derived values
  const categories = [
    "all",
    ...Array.from(new Set(bids.map((b) => b.category || "Uncategorized"))),
  ];

  const totalBids = bids.length;
  const activeBids = bids.filter((b) => b.status === "submitted").length;
  const revisionBids = bids.filter(
    (b) => b.status === "returned_for_revision"
  ).length;
  const awardedBids = bids.filter((b) => b.status === "accepted").length;
  const rejectedBids = bids.filter((b) => b.status === "rejected").length;
  const completedBids = bids.filter((b) => b.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200 py-2 gap-2";
      case "submitted":
        return "bg-amber-50 text-amber-700 border-amber-200 py-2 gap-2";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 py-2 gap-2 gap-2";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200 py-2 gap-2";
      case "returned_for_revision":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 py-2 gap-2";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 py-2 gap-2";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "submitted":
        return "Submitted";
      case "rejected":
        return "Rejected";
      case "completed":
        return "Completed";
      case "returned_for_revision":
        return t("needs_revision") || "Needs Revision";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <Trophy className="h-4 w-4" />;
      case "returned_for_revision":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredBids = bids.filter((bid) => {
    let tabFilter = true;
    if (activeTab !== "all") {
      if (activeTab === "revision") {
        tabFilter = bid.status === "returned_for_revision";
      } else {
        tabFilter = bid.status === activeTab;
      }
    }

    const searchFilter =
      searchQuery === "" ||
      (bid.tenderTitle &&
        bid.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bid.clientName &&
        bid.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bid.category &&
        bid.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const categoryFilter =
      selectedCategory === "all" ||
      (bid.category || "Uncategorized") === selectedCategory;

    return tabFilter && searchFilter && categoryFilter;
  });

  // Actions
  const handleViewBidDetails = (bid: BidUI) => {
    setSelectedBidForDetails(bid);
    setShowBidDetailsModal(true);
  };

  const handleDeleteBid = async () => {
    if (!bidToDelete) return;
    try {
      await deleteBid(bidToDelete);
      fetchBids();
      toast({
        title: "Bid Deleted",
        description: "Your bid has been deleted successfully.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Failed to delete bid",
      });
    } finally {
      setBidToDelete(null);
    }
  };
  const router = useRouter();
  const handleRetryPayment = async (bid: any) => {
    router.push(`/business-dashboard/tender-details/${bid.tenderId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="container mx-auto px-6 py-8 space-y-8 bg-gray-50 min-h-screen">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {t("total_bids") || "Total Bids"}
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {totalBids}
              </div>
              <p className="text-sm text-gray-500">
                {t("all_submitted_bids") || "All submitted bids"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {t("active_bids") || "Active Bids"}
              </CardTitle>
              <div className="p-2 bg-amber-50 rounded-xl">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {activeBids + revisionBids}
              </div>
              <p className="text-sm text-gray-500">
                {t("open_bids") || "Open bids"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {t("revision_bids") || "Revision Bids"}
              </CardTitle>
              <div className="p-2 bg-yellow-50 rounded-xl">
                <RefreshCw className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {revisionBids}
              </div>
              <p className="text-sm text-gray-500">
                {t("needs_revision") || "Needs revision"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {t("awarded_bids") || "Awarded Bids"}
              </CardTitle>
              <div className="p-2 bg-green-50 rounded-xl">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {awardedBids}
              </div>
              <p className="text-sm text-gray-500">
                {t("successfully_awarded") || "Successfully awarded"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {t("rejected_bids") || "Rejected Bids"}
              </CardTitle>
              <div className="p-2 bg-red-50 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {rejectedBids}
              </div>
              <p className="text-sm text-gray-500">
                {t("not_successful") || "Not successful"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("search_bids_placeholder") || "Search bids..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 border-0 bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48 h-12 border-0 bg-white shadow-sm rounded-2xl">
                <SelectValue
                  placeholder={t("select_category") || "Select category"}
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                <SelectItem value="all">
                  {t("all_categories") || "All Categories"}
                </SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs + Table */}
        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: t("all") || "All" },
                { key: "accepted", label: t("accepted") || "Accepted" },
                { key: "rejected", label: t("rejected") || "Rejected" },
                { key: "submitted", label: t("submitted") || "Submitted" },
                { key: "completed", label: t("completed") || "Completed" },
                {
                  key: "revision",
                  label: t("needs_revision") || "Needs Revision",
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`py-3 px-6 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="px-6 py-4 font-semibold text-gray-700">
                  {t("tender_title") || "Tender Title"}
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-700">
                  {t("category") || "Category"}
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-700">
                  {t("your_bid") || "Your Bid"}
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-700">
                  {t("submitted") || "Submitted"}
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-700">
                  {t("status") || "Status"}
                </TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold text-gray-700">
                  {t("actions") || "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <TableRow
                    key={bid.id}
                    className="border-none hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="px-6 py-5">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {bid.tenderTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bid.clientName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-50 border-gray-200 text-gray-700 rounded-lg"
                      >
                        {bid.category || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="font-semibold text-gray-900">
                        {bid.amount} QAR
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("budget") || "Budget"}: {bid.budget ?? "-"} QAR
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600">
                      {new Date(bid.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Badge
                        className={`text-xs border flex items-center gap-1 w-fit rounded-lg font-medium ${getStatusColor(
                          bid.status
                        )}`}
                      >
                        {getStatusIcon(bid.status)}
                        {getStatusText(bid.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-0 shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => handleViewBidDetails(bid)}
                            className="rounded-lg"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("view") || "View"}
                          </DropdownMenuItem>

                          {/* Show edit option only for revision bids */}
                          {["submitted", "returned_for_revision"].includes(
                            bid.status
                          ) && (
                            <DropdownMenuItem
                              onClick={() => handleResubmitBid(bid.id)}
                              className="rounded-lg"
                            >
                              <Pencil className="h-4 w-4 mr-2" />

                              {bid.status !== "returned_for_revision"
                                ? t("edit_bid")
                                : t("resubmit_bid")}
                            </DropdownMenuItem>
                          )}

                          {(bid.status === "accepted" ||
                            bid.status === "completed") && (
                            <DropdownMenuItem
                              onClick={() => handleGoToChat(bid.id)}
                              className="rounded-lg"
                            >
                              <Link
                                href={`/business-dashboard/projects`}
                                className="flex"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                {t("go_to_chat") || "Go to Chat"}
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {bid.status === "under_review" && (
                            <DropdownMenuItem
                              onClick={() => handleRetryPayment(bid)}
                              className="rounded-lg text-blue-600"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              {t("retry_payment") || "Retry Payment"}
                            </DropdownMenuItem>
                          )}
                          {bid.status !== "completed" &&
                            bid.status !== "accepted" &&
                            bid.status !== "returned_for_revision" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setBidToDelete(bid.id)}
                                  className="text-red-600 rounded-lg"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  {t("delete_bid") || "Delete Bid"}
                                </DropdownMenuItem>
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">
                        {t("no_bids_found") || "No bids found"}
                      </p>
                      <p className="text-sm">
                        {t("try_adjusting_search_filters") ||
                          "Try adjusting your search filters"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bid Details Modal */}
        {selectedBidForDetails && (
          <Dialog
            open={showBidDetailsModal}
            onOpenChange={setShowBidDetailsModal}
          >
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl rounded-3xl bg-white backdrop-blur-xl animate-in zoom-in-95 duration-200">
              <div className="relative">
                <DialogHeader className="p-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-3xl">
                  <button
                    onClick={() => setShowBidDetailsModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBidForDetails.tenderTitle}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {t("bid_details_description") ||
                      "Detailed information about your bid"}
                  </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-semibold text-xl text-gray-900">
                        {t("your_bid_details") || "Your Bid Details"}
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-xl mr-3">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                {t("bid_amount") || "Bid Amount"}
                              </p>
                              <p className="font-semibold text-gray-900">
                                {selectedBidForDetails.amount} QAR
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-xl mr-3">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("submitted") || "Submitted"}
                            </p>
                            <p className="font-medium text-gray-900">
                              {new Date(
                                selectedBidForDetails.submittedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-xl mr-3">
                            {getStatusIcon(selectedBidForDetails.status)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("status") || "Status"}
                            </p>
                            <Badge
                              className={`text-sm font-medium rounded-lg ${getStatusColor(
                                selectedBidForDetails.status
                              )}`}
                            >
                              {getStatusText(selectedBidForDetails.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Revision Request Section */}

                      <div className="bg-white border border-gray-100 rounded-2xl p-6">
                        <h4 className="font-semibold mb-3 text-gray-900">
                          {t("bid_description") || "Bid Description"}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedBidForDetails.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-semibold text-xl text-gray-900">
                        {t("tender_overview") || "Tender Overview"}
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">
                                {t("budget") || "Budget"}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {selectedBidForDetails.budget ?? "-"} QAR
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">
                                {t("deadline") || "Deadline"}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {selectedBidForDetails.deadline ?? "-"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">
                                {t("category") || "Category"}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {selectedBidForDetails.category ?? "-"}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <Info className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">
                                {t("location") || "Location"}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {selectedBidForDetails.location ?? "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejected Bid Details */}
                  {selectedBidForDetails.status === "rejected" && (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                      <div className="flex items-center">
                        <div className="bg-red-100 rounded-xl mr-4 shrink-0">
                          <Info className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-800">
                            {t("another_bid_was_accepted") ||
                              "Another bid was accepted"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex flex-wrap gap-3 p-8 pt-0 border-t border-gray-100">
                  <Link
                    href={`/business-dashboard/tender-details/${selectedBidForDetails.tenderId}`}
                  >
                    <Button
                      variant="outline"
                      className="rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("view_original_tender") || "View Original Tender"}
                    </Button>
                  </Link>

                  {(selectedBidForDetails.status === "accepted" ||
                    selectedBidForDetails.status === "completed") && (
                    <Link href={`/business-dashboard/projects`}>
                      <Button className="rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t("go_to_chat") || "Go to Chat"}
                      </Button>
                    </Link>
                  )}

                  <Button
                    onClick={() => setShowBidDetailsModal(false)}
                    variant="ghost"
                    className="rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {t("close") || "Close"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit and Resubmit Modal */}
        {showEditResubmitModal && (
          <Dialog
            open={showEditResubmitModal}
            onOpenChange={setShowEditResubmitModal}
          >
            <DialogContent className="max-w-2xl bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {t("edit_bid_details") || "Edit Bid Details"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {t("update_bid_before_resubmit") ||
                    "Update your bid before resubmitting"}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="bid-amount"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("bid_amount")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      QAR
                    </span>
                    <Input
                      id="bid-amount"
                      type="number"
                      placeholder="0.00"
                      value={editBidAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditBidAmount(value === "" ? "" : Number(value));
                        if (
                          value !== "" &&
                          (isNaN(Number(value)) || Number(value) <= 0)
                        ) {
                          setAmountError(
                            t("please_enter_valid_bid_amount") ||
                              "Please enter a valid bid amount"
                          );
                        } else {
                          setAmountError("");
                        }
                      }}
                      className={`p bg-white/80 backdrop-blur-sm border border-gray-200/50 ${
                        amountError ? "border-red-300" : ""
                      }`}
                      min="0"
                    />
                    {amountError && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {amountError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bid-description"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("proposal_description") || "Proposal Description"}
                  </Label>
                  <Textarea
                    id="bid-description"
                    placeholder={t("describe_your_proposal")}
                    value={editBidDescription}
                    onChange={(e) => {
                      setEditBidDescription(e.target.value);
                      if (
                        e.target.value.trim().length > 0 &&
                        e.target.value.trim().length < 10
                      ) {
                        setDescriptionError(
                          t("description_must_be_at_least_10_chars") ||
                            "Description must be at least 10 characters long"
                        );
                      } else {
                        setDescriptionError("");
                      }
                    }}
                    className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300 focus:border-blue-500 transition-colors ${
                      descriptionError ? "border-red-300" : ""
                    }`}
                    rows={5}
                  />
                  {descriptionError && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {descriptionError}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-gray-100/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditResubmitModal(false);
                    setEditingBidId(null);
                    setEditBidAmount("");
                    setEditBidDescription("");
                    setAmountError("");
                    setDescriptionError("");
                  }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50/80 transition-colors"
                >
                  {t("cancel") || "Cancel"}
                </Button>
                <Button
                  onClick={handleEditResubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {resubmitLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {t("update_and_resubmit") || "Update & Resubmit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {bidToDelete && (
          <Dialog
            open={!!bidToDelete}
            onOpenChange={() => setBidToDelete(null)}
          >
            <DialogContent className="sm:max-w-md rounded-3xl p-0 border-0 shadow-2xl bg-white backdrop-blur-xl animate-in zoom-in-95 duration-200">
              <div className="relative">
                <DialogHeader className="p-8 pb-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-t-3xl">
                  <button
                    onClick={() => setBidToDelete(null)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {t("confirm_delete") || "Delete Bid?"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {t("delete_bid_warning") ||
                      "Are you sure you want to delete this bid? This action cannot be undone."}
                  </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6">
                  <div className="flex items-start text-sm text-gray-600">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p>
                      {t("this_will_permanently_remove_your_bid") ||
                        "This will permanently remove your bid from the system."}
                    </p>
                  </div>
                </div>

                <DialogFooter className="flex flex-wrap gap-3 p-8 pt-0 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => setBidToDelete(null)}
                    className="rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {t("cancel") || "Cancel"}
                  </Button>
                  <Button
                    onClick={handleDeleteBid}
                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    {t("delete_forever") || "Delete Forever"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTransitionWrapper>
  );
}
