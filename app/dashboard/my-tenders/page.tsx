// app/dashboard/my-tenders/page.tsx
"use client";

import { useEffect, useState } from "react";
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
  MapPin,
  Mail,
  Clock,
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
import EditTenderModal from "@/components/EdittenderModal";

import { useTranslation } from "../../../lib/hooks/useTranslation";
import { getUserTenders } from "@/app/services/tenderService";
import { useAuth } from "@/context/AuthContext";
import MyTenderCard from "@/components/MyTenderCard";
import { UiTender } from "@/types/ui";
import CreateTenderModal from "@/components/CreateTenderModal";
import { api } from "@/lib/apiClient";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

type ApiTender = {
  _id: string;
  title: string;
  description: string;
  category?: { _id?: string; name?: string } | string;
  location?: string;
  contactEmail?: string;
  image?: string;
  estimatedBudget?: number;
  postedBy?: { _id?: string; email?: string; userType?: string };
  status?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  bidCount?: number;
  awardedBid?: boolean;
  isCompleted?: boolean;
  rejectionReason?: string;
  [k: string]: any;
};

export default function MyTendersPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [showReapplyModal, setShowReapplyModal] = useState<{
    show: boolean;
    tender: UiTender | null;
  }>({
    show: false,
    tender: null,
  });
  const [reapplyFormData, setReapplyFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [reapplyLoading, setReapplyLoading] = useState(false);
  const [tenders, setTenders] = useState<UiTender[]>([]);
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  // Normalize API tender → UI tender
  const normalizeTender = (api: ApiTender): UiTender => {
    const categoryName =
      typeof api.category === "string"
        ? api.category
        : api.category?.name || "Uncategorized";

    const categoryId =
      typeof api.category === "string" ? undefined : api.category?._id;

    const created = api.createdAt || api.updatedAt || undefined;
    const deadline = api.deadline;

    return {
      id: api._id,
      title: api.title || "Untitled",
      description: api.description || "",
      category: categoryName,
      categoryId,
      location: api.location,
      contactEmail: api.contactEmail || api.postedBy?.email,
      image: api.image,
      budget: typeof api.estimatedBudget === "number" ? api.estimatedBudget : 0,
      postedBy: api.postedBy,
      status: api.status || "draft",
      deadline,
      createdAt: created,
      updatedAt: api.updatedAt,
      postedDate: formatDate(created),
      deadlineDate: formatDate(deadline),
      bidCount: typeof api.bidCount === "number" ? api.bidCount : 0,
      awardedBid: Boolean(api.awardedBid),
      isCompleted: Boolean(api.isCompleted || api.status === "completed"),
      rejectionReason: api.rejectionReason,
    };
  };
  const fetchTenders = async () => {
    setLoading(true);
    try {
      if (!profile?.user) return;
      const data: ApiTender[] = await getUserTenders(profile.user._id);
      const normalized = Array.isArray(data) ? data.map(normalizeTender) : [];
      setTenders(normalized);
    } catch (err) {
      console.error("Failed to fetch tenders:", err);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (profile) fetchTenders();
  }, [profile]);

  if (loading) return <p className="text-center py-8">{t("loading")}...</p>;

  // Get unique categories
  const categories = Array.from(
    new Set(tenders.map((t) => t.category || "Uncategorized"))
  ).sort();

  // Filtering logic
  const filteredTenders = tenders.filter((tender) => {
    const tabMatch =
      activeTab === "all"
        ? true
        : activeTab === "awarded"
        ? tender.status === "awarded" || tender.awardedBid
        : activeTab === "completed"
        ? tender.isCompleted
        : tender.status === activeTab;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      q === "" ||
      tender.title.toLowerCase().includes(q) ||
      tender.description.toLowerCase().includes(q) ||
      (tender.category || "").toLowerCase().includes(q);

    const categoryMatch =
      selectedCategory === "all" || tender.category === selectedCategory;

    return tabMatch && searchMatch && categoryMatch;
  });

  // Sorting
  const sortedTenders = [...filteredTenders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      case "highest-budget":
        return b.budget - a.budget;
      case "lowest-budget":
        return a.budget - b.budget;
      case "most-bids":
        return b.bidCount - a.bidCount;
      case "least-bids":
        return a.bidCount - b.bidCount;
      case "deadline-soonest":
        return (
          new Date(a.deadline || 0).getTime() -
          new Date(b.deadline || 0).getTime()
        );
      case "deadline-farthest":
        return (
          new Date(b.deadline || 0).getTime() -
          new Date(a.deadline || 0).getTime()
        );
      default:
        return 0;
    }
  });

  // Handle reapply: open modal with current tender data
  const handleReapplyTender = (tenderId: string) => {
    const tenderToReapply = tenders.find((t) => t.id === tenderId);
    if (tenderToReapply) {
      setReapplyFormData({
        title: tenderToReapply.title,
        description: tenderToReapply.description,
        budget: String(tenderToReapply.budget),
      });
      setShowReapplyModal({ show: true, tender: tenderToReapply });
    }
  };

  // Submit reapply to backend

  // Update UI after successful API update
  const handleUpdateTender = (apiTender: ApiTender) => {
    try {
      const updated = normalizeTender(apiTender);
      setTenders((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error("Failed to normalize tender after update:", err);
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="container mx-auto py-3 px-1 md:py-8 md:px-3">
        {/* Stats Cards */}
        <div className="mb-6 space-y-2 md:space-y-4 w-full">
          <div className="xl:grid hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all duration-500 ease-out">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <FileText className="h-7 w-7 text-blue-600" />
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                    Total
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("total_tenders")}
                  </p>
                  <p className="text-4xl font-medium text-blue-600">
                    {tenders.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all duration-500 ease-out">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <CheckCircle className="h-7 w-7 text-blue-600" />
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                    Active
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("active_tenders")}
                  </p>
                  <p className="text-4xl font-light text-blue-600">
                    {tenders.filter((t) => t.status === "active").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <Award className="h-7 w-7 text-blue-600" />
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                    Awarded
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("awarded_tenders")}
                  </p>
                  <p className="text-4xl font-light text-blue-600">
                    {tenders.filter((t) => t.awardedBid).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all duration-500 ease-out">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <CheckCircle className="h-7 w-7 text-blue-600" />
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                    Done
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("completed_tenders")}
                  </p>
                  <p className="text-4xl font-light text-blue-600">
                    {tenders.filter((t) => t.isCompleted).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all duration-500 ease-out">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <XCircle className="h-7 w-7 text-blue-600" />
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                    Rejected
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("rejected_tenders")}
                  </p>
                  <p className="text-4xl font-light text-blue-600">
                    {tenders.filter((t) => t.status === "rejected").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 w-full bg-white p-4 rounded-xl border">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t(
                  "search_tenders_by_title_description_or_category"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-400">
                  <div className="flex items-center px-3">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder={t("all_categories")} />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-md">
                  <SelectItem value="all">{t("all_categories")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-400">
                  <div className="flex items-center px-3">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder={t("sort_by")} />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-md">
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="oldest">{t("oldest")}</SelectItem>
                  <SelectItem value="highest-budget">
                    {t("highest_budget")}
                  </SelectItem>
                  <SelectItem value="lowest-budget">
                    {t("lowest_budget")}
                  </SelectItem>
                  <SelectItem value="most-bids">{t("most_bids")}</SelectItem>
                  <SelectItem value="least-bids">{t("least_bids")}</SelectItem>
                  <SelectItem value="deadline-soonest">
                    {t("deadline_soonest")}
                  </SelectItem>
                  <SelectItem value="deadline-farthest">
                    {t("deadline_farthest")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        >
          <div className="w-full overflow-x-auto sm:overflow-visible">
            <TabsList className="flex sm:grid sm:grid-cols-7 gap-2 w-max sm:w-full md:grid hidden-scrollbar">
              <TabsTrigger value="all">{t("all")}</TabsTrigger>
              <TabsTrigger value="active">{t("active")}</TabsTrigger>
              <TabsTrigger value="awarded">{t("awarded")}</TabsTrigger>
              <TabsTrigger value="closed">{t("closed")}</TabsTrigger>
              <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
              <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
              <TabsTrigger value="draft">{t("draft")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-2 md:space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTenders.length > 0 ? (
                sortedTenders.map((tender) => (
                  <MyTenderCard
                    key={tender.id}
                    tender={tender}
                    onReapply={handleReapplyTender}
                    onUpdate={handleUpdateTender}
                    fetchTenders={fetchTenders}
                  />
                ))
              ) : (
                <div className="text-center py-12 col-span-full bg-white rounded-lg border border-neutral-300">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("no_tenders_found")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedCategory !== "all"
                      ? t("no_tenders_match_search_criteria")
                      : activeTab === "all"
                      ? t("no_tenders_created_yet")
                      : t("no_tenders_match_status", { status: activeTab })}
                  </p>
                  {activeTab === "all" &&
                    !searchQuery &&
                    selectedCategory === "all" && (
                      <Button
                        onClick={() => setOpenTenderModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("post_your_first_tender")}
                      </Button>
                    )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Tender Modal */}
        <CreateTenderModal
          open={openTenderModal}
          onOpenChange={setOpenTenderModal}
        />
      </div>
    </PageTransitionWrapper>
  );
}
