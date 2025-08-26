"use client";
import {
  FileText,
  Clock,
  MessageSquare,
  Search,
  ChevronRight,
  MapPin,
  AlertCircle,
  CheckCircle,
  Users,
  Eye,
  DollarSign,
  CalendarDays,
  Plus,
  BarChart2,
  TrendingUp,
  Timer,
  ClipboardList,
  PieChart,
} from "lucide-react";
import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import CreateTenderModal from "@/components/CreateTenderModal";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { getUserTenders } from "../services/tenderService";

// Define types
interface Tender {
  _id: string;
  title: string;
  category: { name: string } | string;
  status: string;
  deadline: string;
  createdAt: string;
  description?: string;
  location?: string;
  estimatedBudget?: number;
  budget?: string | number;
  bidsCount?: number;
  awardedTo?: string;
  awardedBidId?: string;
}

interface TenderStats {
  totalTenders: number;
  tendersWithBids: number;
  averageBids: number;
  highestBidCount: number;
}

export default function IndividualDashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "recent" | "awaiting" | "awarded" | "performance"
  >("recent");
  const { user, profile } = useAuth();
  const [recentTenders, setRecentTenders] = useState<Tender[]>([]);
  const [tendersWithNoBids, setTendersWithNoBids] = useState<Tender[]>([]);
  const [awardedTenders, setAwardedTenders] = useState<Tender[]>([]);
  const [tenderStats, setTenderStats] = useState<TenderStats>({
    totalTenders: 0,
    tendersWithBids: 0,
    averageBids: 0,
    highestBidCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Helper functions
  const resolveCategoryName = (tender: any) => {
    if (typeof tender.category === "string") return tender.category;
    if (tender.category?.name) return tender.category.name;
    return "General";
  };

  const resolveBudget = (tender: any) => {
    if (typeof tender.estimatedBudget === "number")
      return tender.estimatedBudget;
    if (tender.budget && !isNaN(Number(tender.budget)))
      return Number(tender.budget);
    if (typeof tender.budget === "string") {
      const digits = tender.budget.replace(/[^0-9.]/g, "");
      return digits ? Number(digits) : 0;
    }
    return 0;
  };

  const parseDeadline = (tender: any) => {
    if (!tender?.deadline) return null;
    const d = new Date(tender.deadline);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const getTenderProgress = (tender: Tender) => {
    const now = new Date();
    const deadline = parseDeadline(tender);

    if (!deadline) return 0;

    const totalDuration =
      deadline.getTime() - new Date(tender.createdAt).getTime();
    const elapsed = now.getTime() - new Date(tender.createdAt).getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        // Fetch tenders posted by the user
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];

        // Get bid counts for each tender
        const tendersWithBidCounts = await Promise.all(
          tenders.map(async (tender) => {
            try {
              const bidCount = await tender.bidCount;
              return { ...tender, bidsCount: bidCount };
            } catch (error) {
              console.error(
                `Failed to get bid count for tender ${tender._id}:`,
                error
              );
              return { ...tender, bidsCount: 0 };
            }
          })
        );

        // Set recent tenders (limit to 6)
        setRecentTenders(tendersWithBidCounts.slice(0, 6));

        // Filter tenders with no bids
        const noBidTenders = tendersWithBidCounts.filter(
          (tender) => tender.bidsCount === 0
        );
        setTendersWithNoBids(noBidTenders.slice(0, 6));

        // Filter awarded tenders
        const awarded = tendersWithBidCounts.filter(
          (t) => t.status === "awarded" || t.status === "completed"
        );
        setAwardedTenders(awarded);

        // Calculate stats
        const totalTenders = tendersWithBidCounts.length;
        const tendersWithBids = tendersWithBidCounts.filter(
          (t) => t.bidsCount > 0
        ).length;
        const totalBids = tendersWithBidCounts.reduce(
          (sum, t) => sum + (t.bidsCount || 0),
          0
        );
        const averageBids = totalTenders > 0 ? totalBids / totalTenders : 0;
        const highestBidCount = Math.max(
          ...tendersWithBidCounts.map((t) => t.bidsCount || 0),
          0
        );

        setTenderStats({
          totalTenders,
          tendersWithBids,
          averageBids: Math.round(averageBids * 10) / 10,
          highestBidCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = recentTenders
    .map((t) => ({
      title: t.title,
      deadline: parseDeadline(t),
    }))
    .filter((item) => item.deadline)
    .sort(
      (a, b) => (a.deadline as Date).getTime() - (b.deadline as Date).getTime()
    )
    .slice(0, 3);

  // Tender status summary
  const tenderStatusSummary = recentTenders.reduce(
    (acc, t) => {
      const status =
        t.status === "awarded" || t.status === "completed"
          ? "awarded"
          : t.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { active: 0, awarded: 0, expired: 0, draft: 0 } as Record<string, number>
  );

  // Recent activity (last 3 actions)
  const recentActivity = [
    ...recentTenders.slice(0, 3).map((t) => ({
      type: "tender",
      title: t.title,
      time: formatShortDate(t.createdAt),
    })),
  ].slice(0, 3);

  // Apple-style KPI Card
  const KpiCard = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <motion.div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 transition-all duration-300 h-full group">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center transition-transform duration-300">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 tracking-wide">
            {title}
          </h3>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </motion.div>
  );

  // Apple-style Badge Component
  const AppleBadge = ({
    variant,
    className,
    children,
  }: {
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200";
    if (variant === "outline") {
      return (
        <span
          className={`${baseClasses} bg-gray-50/80 text-gray-600 border border-gray-200/60 hover:bg-gray-100/80 ${className}`}
        >
          {children}
        </span>
      );
    }
    return <span className={`${baseClasses} ${className}`}>{children}</span>;
  };

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.01 } } }}
        className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30"
      >
        <div className="mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-8">
          {/* Apple-style Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100/50 relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                    {t("welcome_back")}{" "}
                    <span className="text-blue-600">
                      {profile?.firstName || profile?.companyName}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                    {t("overview_of_your_tenders_and_bids")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenTenderModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t("post_new_tender")}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Apple-style KPI Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Total Tenders */}
            <KpiCard title={t("total_tenders_posted")} icon={FileText}>
              <div className="text-3xl font-bold text-gray-900">
                {tenderStats.totalTenders}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (tenderStats.totalTenders / 10) * 10
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {t("total_tenders_posted_description")}
              </div>
            </KpiCard>

            {/* Tenders With Bids */}
            <KpiCard title={t("tenders_with_bids")} icon={CheckCircle}>
              <div className="text-3xl font-bold text-gray-900">
                {tenderStats.tendersWithBids}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (tenderStats.tendersWithBids / tenderStats.totalTenders) *
                        100 || 0
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {t("tenders_with_bids_description")}
              </div>
            </KpiCard>

            {/* Average Bids */}
            <KpiCard title={t("average_bids_per_tender")} icon={TrendingUp}>
              <div className="text-3xl font-bold text-gray-900">
                {tenderStats.averageBids}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (tenderStats.averageBids / 5) * 20
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {t("average_bids_per_tender_description")}
              </div>
            </KpiCard>

            {/* Highest Bid Count */}
            <KpiCard title={t("highest_bid_count")} icon={BarChart2}>
              <div className="text-3xl font-bold text-gray-900">
                {tenderStats.highestBidCount}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (tenderStats.highestBidCount / 20) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {t("highest_bid_count_description")}
              </div>
            </KpiCard>
          </motion.div>

          {/* Apple-style Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="border-b border-gray-100/50 p-6 pb-0">
              <nav className="flex space-x-1 bg-gray-100/50 rounded-2xl p-1">
                {[
                  {
                    id: "recent",
                    label: t("recent_tenders_posted"),
                    icon: FileText,
                  },
                  {
                    id: "awaiting",
                    label: t("tenders_awaiting_bids"),
                    icon: Clock,
                  },
                  {
                    id: "awarded",
                    label: t("awarded_tenders"),
                    icon: MessageSquare,
                  },
                  {
                    id: "performance",
                    label: t("tender_performance"),
                    icon: BarChart2,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4 text-lg">
                    {t("loading")}...
                  </p>
                </div>
              ) : activeTab === "recent" ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {t("recent_tenders_posted")}
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                    >
                      {t("view_all")}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700">
                            {t("title")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("category")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("location")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("budget")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("bids")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("status")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("deadline")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTenders.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-12 text-gray-500"
                            >
                              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                              <p className="text-lg">
                                {t("no_tenders_posted_yet")}
                              </p>
                              <Button
                                variant="outline"
                                className="mt-4 border-blue-100 text-blue-600 hover:bg-blue-50"
                                onClick={() => setOpenTenderModal(true)}
                              >
                                {t("post_your_first_tender")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentTenders.map((tender) => (
                            <TableRow
                              key={tender._id}
                              className="hover:bg-gray-50/50 cursor-pointer border-gray-100/60 transition-colors"
                            >
                              <TableCell>
                                <Link
                                  href={`/individual-dashboard/tender/${tender._id}`}
                                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {tender.title}
                                </Link>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {resolveCategoryName(tender)}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {tender.location || "—"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
                                  : t("not_specified")}
                              </TableCell>
                              <TableCell>
                                <AppleBadge variant="outline">
                                  {tender.bidsCount || 0} {t("bids")}
                                </AppleBadge>
                              </TableCell>
                              <TableCell>
                                {tender.status === "awarded" ||
                                tender.status === "completed" ? (
                                  <AppleBadge className="bg-blue-100/80 text-blue-700">
                                    {t("awarded")}
                                  </AppleBadge>
                                ) : (
                                  <AppleBadge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {t(tender.status)}
                                  </AppleBadge>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {parseDeadline(tender)?.toLocaleDateString() ||
                                  "—"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : activeTab === "awaiting" ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {t("tenders_awaiting_bids")}
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders?filter=no-bids"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                    >
                      {t("view_all")}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700">
                            {t("title")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("category")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("location")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("budget")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("description")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("deadline")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("progress")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tendersWithNoBids.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-12 text-gray-500"
                            >
                              <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-4" />
                              <p className="text-lg">
                                {t("all_tenders_have_bids")}
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          tendersWithNoBids.map((tender) => (
                            <TableRow
                              key={tender._id}
                              className="hover:bg-gray-50/50 cursor-pointer border-gray-100/60 transition-colors"
                            >
                              <TableCell>
                                <Link
                                  href={`/individual-dashboard/tender/${tender._id}`}
                                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {tender.title}
                                </Link>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {resolveCategoryName(tender)}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {tender.location || "—"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
                                  : t("not_specified")}
                              </TableCell>
                              <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
                                {tender.description || t("no_description")}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {parseDeadline(tender)?.toLocaleDateString() ||
                                  "—"}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                      {Math.round(getTenderProgress(tender))}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${getTenderProgress(tender)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : activeTab === "awarded" ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {t("awarded_tenders")}
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders?filter=awarded"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                    >
                      {t("view_all")}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700">
                            {t("title")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("category")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("location")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("budget")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("bids")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("awarded_to")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("deadline")}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t("action")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {awardedTenders.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center py-12 text-gray-500"
                            >
                              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                              <p className="text-lg">
                                {t("no_awarded_tenders_yet")}
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          awardedTenders.map((tender) => (
                            <TableRow
                              key={tender._id}
                              className="hover:bg-gray-50/50 border-gray-100/60 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-900">
                                {tender.title}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {resolveCategoryName(tender)}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {tender.location || "—"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                <AppleBadge variant="outline">
                                  {tender.bidsCount || 0} {t("bids")}
                                </AppleBadge>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {tender.awardedTo || t("contractor")}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {parseDeadline(tender)?.toLocaleDateString() ||
                                  "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/individual-dashboard/chat/${tender._id}`}
                                  className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-3 py-1 rounded-lg transition-colors"
                                >
                                  {t("go_to_chat")}
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : activeTab === "performance" ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {t("tender_performance")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <PieChart className="w-4 h-4 mr-2" />
                        {t("overview")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        {t("details")}
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-400 mt-3">{t("loading")}...</p>
                    </div>
                  ) : recentTenders.length === 0 ? (
                    <div className="text-center py-12">
                      <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm mb-4">
                        {t("no_data_to_display")}
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-xl border-blue-100 text-blue-600"
                        onClick={() => setOpenTenderModal(true)}
                      >
                        {t("post_first_tender_to_view_performance")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recentTenders.map((tender, index) => (
                        <div key={tender._id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {tender.title}
                              </h4>
                              <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 mr-2">
                                  {resolveCategoryName(tender)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {t("deadline")}:{" "}
                                  {parseDeadline(tender)?.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                              {tender.bidsCount || 0} {t("bids")}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{t("progress")}</span>
                              <span>
                                {Math.round(getTenderProgress(tender))}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${getTenderProgress(tender)}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500">
                                {t("budget")}
                              </p>
                              <p className="font-medium text-gray-900">
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
                                  : t("not_specified")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                {t("bids_received")}
                              </p>
                              <p className="font-medium text-gray-900">
                                {tender.bidsCount || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                {t("status")}
                              </p>
                              <div className="mt-1">
                                {tender.status === "awarded" ||
                                tender.status === "completed" ? (
                                  <AppleBadge className="bg-blue-100/80 text-blue-700">
                                    {t("awarded")}
                                  </AppleBadge>
                                ) : (
                                  <AppleBadge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {t(tender.status)}
                                  </AppleBadge>
                                )}
                              </div>
                            </div>
                          </div>

                          {index < recentTenders.length - 1 && (
                            <div className="border-b border-gray-100 my-4"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          </motion.div>

          {/* Tips & Guidance Section */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {t("tips_for_successful_tenders")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("clear_description")}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t("clear_description_tip")}
                  </p>
                </div>

                <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100/50">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("realistic_budget")}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t("realistic_budget_tip")}
                  </p>
                </div>

                <div className="bg-green-50/50 rounded-xl p-5 border border-green-100/50">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("timely_evaluation")}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t("timely_evaluation_tip")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <CreateTenderModal
            open={openTenderModal}
            onOpenChange={setOpenTenderModal}
          />
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
