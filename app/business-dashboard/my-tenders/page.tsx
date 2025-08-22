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
import { getTender, updateTender } from "@/app/services/tenderService"; // keep available if needed
import { UiTender } from "@/types/ui";
import CreateTenderModal from "@/components/CreateTenderModal";

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
  bidsCount?: number;
  awardedBid?: boolean;
  isCompleted?: boolean;
  rejectionReason?: string;
  [k: string]: any;
};

export default function MyTendersPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    show: boolean;
    action: string;
    tenderId: string | null;
  }>({
    show: false,
    action: "",
    tenderId: null,
  });
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
  const [tenders, setTenders] = useState<UiTender[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  // helper: format date for display
  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(); // browser locale; change if needed
    } catch {
      return iso;
    }
  };

  // Normalize API tender -> UI tender
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
      bidsCount: typeof api.bidsCount === "number" ? api.bidsCount : 0,
      awardedBid: Boolean(api.awardedBid),
      isCompleted: Boolean(api.isCompleted || api.status === "completed"),
      rejectionReason: api.rejectionReason,
    };
  };

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        // Pass profile.user or whatever identifier your service expects
        const data: ApiTender[] = await getUserTenders(profile?.user || "");
        // If your service already returns normalized objects, normalize again is safe
        const normalized = Array.isArray(data) ? data.map(normalizeTender) : [];
        setTenders(normalized);
      } catch (err) {
        console.error("Failed to fetch tenders:", err);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    if (profile) fetchTenders();
    // if profile might come later, keep dependency
  }, [profile?.user]);

  if (loading) return <p>Loading tenders...</p>;

  // Get unique categories for filter (strings)
  const categories = Array.from(
    new Set(tenders.map((tender) => tender.category || "Uncategorized"))
  ).sort();

  // Filtering
  const filteredTenders = tenders.filter((tender) => {
    // Tab filter
    let tabMatch = true;
    if (activeTab === "all") tabMatch = true;
    else if (activeTab === "awarded") tabMatch = tender.awardedBid;
    else if (activeTab === "completed") tabMatch = tender.isCompleted;
    else tabMatch = tender.status === activeTab;

    // Search match
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      q === "" ||
      (tender.title || "").toLowerCase().includes(q) ||
      (tender.description || "").toLowerCase().includes(q) ||
      (tender.category || "").toLowerCase().includes(q);

    // Category filter
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
        return b.bidsCount - a.bidsCount;
      case "least-bids":
        return a.bidsCount - b.bidsCount;
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

  // Actions (use string ids)

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

  const submitReapply = () => {
    if (showReapplyModal.tender) {
      setTenders((prev) =>
        prev.map((t) =>
          t.id === showReapplyModal.tender!.id
            ? {
                ...t,
                title: reapplyFormData.title,
                description: reapplyFormData.description,
                budget: Number(reapplyFormData.budget) || 0,
                status: "draft",
                postedDate: "Not posted yet",
                rejectionReason: undefined,
              }
            : t
        )
      );
      setShowReapplyModal({ show: false, tender: null });
      setReapplyFormData({ title: "", description: "", budget: "" });
    }
  };

  // NEW: update handler called by card/modal after successful API update
  const handleUpdateTender = (apiTender: ApiTender) => {
    try {
      const updated = normalizeTender(apiTender);
      setTenders((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error("Failed to normalize/replace tender after update:", err);
    }
  };

  return (
    <div className="container mx-auto  py-1 px-1 md:py-8 md:px-3 ">
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-2 md:space-y-4 w-full">
        <div className="xl:grid hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Total Tenders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8  transition-all duration-500 ease-out">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <FileText className="h-7 w-7 text-blue-600" />
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 text-blue-600">
                  Total
                </div>
              </div>
              <div>
                <p className="text-sm  font-medium text-slate-600 mb-1">
                  {t("total_tenders")}
                </p>
                <p className="text-4xl font-medium text-blue-600">
                  {tenders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Active Tenders */}
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

          {/* Awarded Tenders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all ">
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

          {/* Completed Tenders */}
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

          {/* Rejected Tenders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border rounded-lg p-8 transition-all duration-500 ease-out ">
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

        <div className="flex flex-col md:flex-row gap-4 w-full bg-white p-4 rounded-xl  border">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={t("search_tenders_by_title_description_or_category")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          {/* Filters & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
            {/* Category Select */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200">
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

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200">
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        <TabsList className=" w-full grid-cols-3 sm:grid-cols-6 gap-2 md:grid hidden">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="active">{t("active")}</TabsTrigger>
          <TabsTrigger value="awarded">{t("awarded")}</TabsTrigger>
          <TabsTrigger value="closed">{t("closed")}</TabsTrigger>
          <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
          <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-2 md:space-y-2 grid grid-cols-1 md:grid-cols-2  gap-4">
            {sortedTenders.length > 0 ? (
              sortedTenders.map((tender) => (
                <MyTenderCard
                  key={tender.id}
                  tender={tender}
                  onReapply={handleReapplyTender}
                  onUpdate={handleUpdateTender} // <-- pass update handler
                  t={t}
                />
              ))
            ) : (
              <div className="text-center py-12 col-span-full bg-white rounded-lg border border-neutral-300">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("no_tenders_found")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ||
                  (selectedCategory && selectedCategory !== "all")
                    ? t("no_tenders_match_search_criteria")
                    : activeTab === "all"
                    ? t("no_tenders_created_yet")
                    : t("no_tenders_match_status", { status: activeTab })}
                </p>
                {activeTab === "all" &&
                  !searchQuery &&
                  (selectedCategory === "all" || !selectedCategory) && (
                    <div
                      onClick={() => setOpenTenderModal(true)}
                      className="cursor-pointer"
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("post_your_first_tender")}
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <CreateTenderModal
        open={openTenderModal}
        onOpenChange={setOpenTenderModal}
      />

      {/* Reapply Tender Modal */}
      <Dialog
        open={showReapplyModal.show}
        onOpenChange={() => setShowReapplyModal({ show: false, tender: null })}
      >
        <DialogContent className="sm:max-w-[600px] w-full">
          <DialogHeader>
            <DialogTitle>
              {t("reapply_for_tender")}: {showReapplyModal.tender?.title}
            </DialogTitle>
            <DialogDescription>
              {t("edit_details_and_reapply")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                {t("title")}
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
                {t("description")}
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
                {t("budget_qar")}
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
              {t("cancel")}
            </Button>
            <Button onClick={submitReapply}>{t("reapply")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
