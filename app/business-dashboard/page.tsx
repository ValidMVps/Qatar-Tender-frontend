"use client";
import {
  FileText,
  Banknote,
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
import { getUserBids } from "../services/BidService";
import { getActiveTenders } from "../services/tenderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/OverviewChart";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

// Types (unchanged)
interface Tender {
  _id: string;
  title: string;
  category: { name: string };
  status: string;
  deadline: string;
  createdAt: string;
  description?: string;
  location?: string;
  estimatedBudget?: number;
  budget?: string | number;
  bidCount?: number;
  awardedTo?: string;
  awardedBidId?: string;
}

export interface Bid {
  _id: string;
  tender: {
    _id: string;
    title: string;
    description?: string;
    deadline: string;
    postedBy?: { companyName?: string };
  };
  amount: number;
  description: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "under_review"
    | "submitted"
    | "completed";
  createdAt: string;
  updatedAt: string;
}

interface ActiveTender {
  _id: string;
  title: string;
  category: { name: string };
  description: string;
  location?: string;
  budget?: string | number;
  deadline: string;
  postedBy?: { companyName?: string; _id: string };
  createdAt: string;
  bidCount?: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [activeTab, setActiveTab] = useState("marketplace");
  const { user, profile } = useAuth();

  const [recentTenders, setRecentTenders] = useState<Tender[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [tendersWithNoBids, setTendersWithNoBids] = useState<Tender[]>([]);
  const [awardedToMe, setAwardedToMe] = useState<Bid[]>([]);
  const [awardedByMe, setAwardedByMe] = useState<Tender[]>([]);
  const [activeTenders, setActiveTenders] = useState<ActiveTender[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper functions
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];

        setRecentTenders(tenders.slice(0, 6));
        setTendersWithNoBids(tenders.filter((t) => t.bidCount === 0));
        setAwardedByMe(
          tenders.filter(
            (t) => t.status === "awarded" || t.status === "completed"
          )
        );

        const bidsRes = await getUserBids();
        const bids = Array.isArray(bidsRes) ? bidsRes : [];

        setMyBids(bids);
        setAwardedToMe(
          bids.filter(
            (b) => b.status === "accepted" || b.status === "completed"
          )
        );

        const activeRes = await getActiveTenders();
        const filtered = Array.isArray(activeRes)
          ? activeRes.filter((tender) => {
              const postedById =
                tender.postedBy?._id ||
                tender.postedBy?.id ||
                tender.userId ||
                tender.postedBy;
              return postedById !== user._id;
            })
          : [];
        setActiveTenders(filtered);
      } catch (error) {
        console.error("Failed to fetch dashboard ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  // KPI Data
  const totalTenders = recentTenders.length;
  const totalBids = myBids.length;
  const totalAwardedToMe = awardedToMe.length;
  const awaitingBidsCount = tendersWithNoBids.length;

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

  // Bid status summary
  const bidStatusSummary = myBids.reduce((acc, bid) => {
    acc[bid.status] = (acc[bid.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
    ...recentTenders.slice(0, 2).map((t) => ({
      type: "tender",
      title: t.title,
      time: formatShortDate(t.createdAt),
    })),
    ...myBids.slice(0, 1).map((b) => ({
      type: "bid",
      title: b.tender.title,
      time: formatShortDate(b.createdAt),
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
    <PageTransitionWrapper>
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
                        {profile?.companyName}
                      </span>
                    </h1>
                    <p className="text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                      {t("overview_of_posting_and_bidding_activity")}
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

                    <Link href="/business-dashboard/browse-tenders">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 px-6 py-3 rounded-2xl font-medium backdrop-blur-xl transition-all duration-200 flex items-center gap-2 border border-gray-200/50"
                      >
                        <Search className="w-5 h-5" />
                        {t("browse_tenders")}
                      </motion.button>
                    </Link>
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
              {/* Recent Activity */}
              <KpiCard title="Recent Activity" icon={ClipboardList}>
                {recentActivity.length === 0 ? (
                  <p className="text-gray-400 text-sm">No recent activity</p>
                ) : (
                  recentActivity.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            act.type === "tender"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-700 truncate max-w-[140px]">
                          {act.type === "tender" ? "Posted: " : "Bid on: "}
                          {act.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {act.time}
                      </span>
                    </div>
                  ))
                )}
              </KpiCard>

              {/* Bid Summary */}
              <KpiCard title="Bid Summary" icon={TrendingUp}>
                {Object.entries(bidStatusSummary).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-xl"
                  >
                    <span className="capitalize text-sm text-gray-700 font-medium">
                      {status}
                    </span>
                    <AppleBadge className="bg-blue-100/80 text-blue-700 min-w-[24px] text-center">
                      {count}
                    </AppleBadge>
                  </div>
                ))}
                {Object.keys(bidStatusSummary).length === 0 && (
                  <p className="text-gray-400 text-sm">No bids yet</p>
                )}
              </KpiCard>

              {/* Tender Status */}
              <KpiCard title="Tender Status" icon={BarChart2}>
                {["active", "awarded", "completed", "rejected", "closed"].map(
                  (status) => {
                    const count = tenderStatusSummary[status];
                    if (!count) return null;
                    return (
                      <div
                        key={status}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-xl"
                      >
                        <span className="capitalize text-sm text-gray-700 font-medium">
                          {status}
                        </span>
                        <AppleBadge
                          className={`min-w-[24px] text-center ${
                            status === "awarded"
                              ? "bg-green-100/80 text-green-700"
                              : status === "active"
                              ? "bg-blue-100/80 text-blue-700"
                              : "bg-red-100/80 text-red-700"
                          }`}
                        >
                          {count}
                        </AppleBadge>
                      </div>
                    );
                  }
                )}
                {Object.values(tenderStatusSummary).every((v) => v === 0) && (
                  <p className="text-gray-400 text-sm">No tenders</p>
                )}
              </KpiCard>

              {/* Upcoming Deadlines */}
              <KpiCard title="Upcoming Deadlines" icon={Timer}>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-gray-400 text-sm">No deadlines soon</p>
                ) : (
                  upcomingDeadlines.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-amber-50/50 rounded-xl border border-amber-100/50"
                    >
                      <span className="text-sm text-gray-700 truncate max-w-[140px]">
                        {item.title}
                      </span>
                      <span className="text-xs text-amber-600 font-semibold">
                        {formatShortDate(item.deadline!.toString())}
                      </span>
                    </div>
                  ))
                )}
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
                    { id: "marketplace", label: "Marketplace", icon: Search },
                    { id: "recent", label: "Recent Tenders", icon: FileText },
                    { id: "bids", label: "My Bids", icon: Banknote },
                    { id: "awaiting", label: "Awaiting Bids", icon: Clock },
                    {
                      id: "awarded",
                      label: "Awarded Projects",
                      icon: MessageSquare,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
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
                ) : activeTab === "marketplace" ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Discover New Tenders
                      </h3>
                      <Link
                        href="/business-dashboard/browse-tenders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                      >
                        Browse All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid gap-6">
                      {activeTenders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                          <p className="text-lg">No active tenders found.</p>
                        </div>
                      ) : (
                        activeTenders.map((tender) => {
                          const budget = resolveBudget(tender);
                          const deadline = parseDeadline(tender);
                          const isUrgent =
                            deadline &&
                            (deadline.getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24) <=
                              7;

                          return (
                            <Link
                              key={tender._id}
                              href={`/business-dashboard/tender-details/${tender._id}`}
                              className="block group"
                            >
                              <motion.div className="p-6 rounded-2xl border border-gray-100/60 hover:border-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-xl">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {tender.title}
                                      </h4>
                                      {isUrgent && (
                                        <AppleBadge className="bg-red-100/80 text-red-700">
                                          Urgent
                                        </AppleBadge>
                                      )}
                                    </div>

                                    <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                      {tender.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                      <AppleBadge variant="outline">
                                        {tender.category?.name || "General"}
                                      </AppleBadge>
                                      {tender.location && (
                                        <AppleBadge
                                          variant="outline"
                                          className="flex items-center gap-1"
                                        >
                                          <MapPin className="w-3 h-3" />
                                          {tender.location}
                                        </AppleBadge>
                                      )}
                                      <AppleBadge variant="outline">
                                        {tender.bidCount || 0} bids
                                      </AppleBadge>
                                    </div>
                                  </div>

                                  <div className="text-right lg:ml-6 whitespace-nowrap bg-gray-50/50 rounded-2xl p-4">
                                    <div className="font-semibold text-xl text-gray-900">
                                      {budget > 0
                                        ? `${new Intl.NumberFormat().format(
                                            budget
                                          )} ${t("QAR")}`
                                        : "Not specified"}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      Due {deadline?.toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : activeTab === "recent" ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Recent Tenders Posted
                      </h3>
                      <Link
                        href="/business-dashboard/my-tenders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700">
                              Title
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Category
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Location
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Budget
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Bids
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Deadline
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
                                  No tenders posted yet.
                                </p>
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
                                    href={`/business-dashboard/tender/${tender._id}`}
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                  >
                                    {tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {tender.category?.name || "General"}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {tender.location || "—"}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {resolveBudget(tender) > 0
                                    ? `${new Intl.NumberFormat().format(
                                        resolveBudget(tender)
                                      )} ${t("QAR")}`
                                    : "Not specified"}
                                </TableCell>
                                <TableCell>
                                  <AppleBadge variant="outline">
                                    {tender.bidCount || 0}
                                  </AppleBadge>
                                </TableCell>
                                <TableCell>
                                  {tender.status === "awarded" ||
                                  tender.status === "completed" ? (
                                    <AppleBadge className="bg-blue-100/80 text-blue-700">
                                      Awarded
                                    </AppleBadge>
                                  ) : (
                                    <AppleBadge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {tender.status}
                                    </AppleBadge>
                                  )}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {parseDeadline(
                                    tender
                                  )?.toLocaleDateString() || "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : activeTab === "bids" ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        My Bids
                      </h3>
                      <Link
                        href="/business-dashboard/bids"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700">
                              Tender
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Description
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Amount
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Submitted
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Deadline
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myBids.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-12 text-gray-500"
                              >
                                <Banknote className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <p className="text-lg">No bids placed yet.</p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            myBids.map((bid) => (
                              <TableRow
                                key={bid._id}
                                className="hover:bg-gray-50/50 cursor-pointer border-gray-100/60 transition-colors"
                              >
                                <TableCell>
                                  <Link
                                    href={`/business-dashboard/tender-details/${bid.tender._id}`}
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                  >
                                    {bid.tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600 text-sm max-w-xs line-clamp-1">
                                  {bid.description || "No description."}
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900">
                                  {new Intl.NumberFormat().format(bid.amount)}{" "}
                                  {t("QAR")}
                                </TableCell>
                                <TableCell>
                                  <AppleBadge
                                    className={
                                      bid.status === "accepted" ||
                                      bid.status === "completed"
                                        ? "bg-green-100/80 text-green-700"
                                        : bid.status === "pending" ||
                                          bid.status === "under_review"
                                        ? "bg-yellow-100/80 text-yellow-700"
                                        : bid.status === "rejected"
                                        ? "bg-red-100/80 text-red-700"
                                        : "bg-blue-100/80 text-blue-700"
                                    }
                                  >
                                    {bid.status.charAt(0).toUpperCase() +
                                      bid.status.slice(1).replace("_", " ")}
                                  </AppleBadge>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {bid.tender.deadline
                                    ? new Date(
                                        bid.tender.deadline
                                      ).toLocaleDateString()
                                    : "—"}
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
                        Tenders Awaiting Bids
                      </h3>
                      <Link
                        href="/business-dashboard/my-tenders?filter=no-bids"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-4 py-2 rounded-xl transition-colors"
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700">
                              Title
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Category
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Location
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Budget
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Description
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Deadline
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tendersWithNoBids.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-12 text-gray-500"
                              >
                                <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-4" />
                                <p className="text-lg">
                                  All tenders have received bids!
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
                                    href={`/business-dashboard/tender/${tender._id}`}
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                  >
                                    {tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {tender.category?.name || "General"}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {tender.location || "—"}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {resolveBudget(tender) > 0
                                    ? `${new Intl.NumberFormat().format(
                                        resolveBudget(tender)
                                      )} ${t("QAR")}`
                                    : "Not specified"}
                                </TableCell>
                                <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
                                  {tender.description || "No description."}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {parseDeadline(
                                    tender
                                  )?.toLocaleDateString() || "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : activeTab === "awarded" ? (
                  <div className="space-y-12">
                    {/* Awarded to Me Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Awarded to Me
                        </h3>
                      </div>

                      {awardedToMe.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white/90 rounded-2xl border border-gray-100/60">
                          <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                          <p className="text-lg">No bids awarded to you.</p>
                        </div>
                      ) : (
                        <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-100/60 bg-gray-50/50">
                                <TableHead className="font-semibold text-gray-700">
                                  Project
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Client
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Amount
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Deadline
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Action
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {awardedToMe.map((bid) => {
                                return (
                                  <TableRow
                                    key={bid._id}
                                    className="hover:bg-gray-50/50 border-gray-100/60 transition-colors"
                                  >
                                    <TableCell className="font-medium text-gray-900">
                                      {bid.tender.title}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                      {bid.tender.postedBy?.companyName ||
                                        "Private"}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900">
                                      {new Intl.NumberFormat().format(
                                        bid.amount
                                      )}{" "}
                                      {t("QAR")}
                                    </TableCell>
                                    <TableCell>
                                      <AppleBadge className="bg-green-100/80 text-green-700">
                                        Accepted
                                      </AppleBadge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                      {new Date(
                                        bid.tender.deadline
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`/business-dashboard/chat/${bid.tender._id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-3 py-1 rounded-lg transition-colors"
                                      >
                                        Go to Chat
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>

                    {/* Awarded by Me Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Awarded by Me
                        </h3>
                      </div>

                      {awardedByMe.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white/90 rounded-2xl border border-gray-100/60">
                          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                          <p className="text-lg">No tenders awarded yet.</p>
                        </div>
                      ) : (
                        <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-100/60 bg-gray-50/50">
                                <TableHead className="font-semibold text-gray-700">
                                  Project
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Winner
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Budget
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Deadline
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                  Action
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {awardedByMe.map((tender) => (
                                <TableRow
                                  key={tender._id}
                                  className="hover:bg-gray-50/50 border-gray-100/60 transition-colors"
                                >
                                  <TableCell className="font-medium text-gray-900">
                                    {tender.title}
                                  </TableCell>
                                  <TableCell className="text-gray-600">
                                    Contractor
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {resolveBudget(tender) > 0
                                      ? `${new Intl.NumberFormat().format(
                                          resolveBudget(tender)
                                        )} ${t("QAR")}`
                                      : "—"}
                                  </TableCell>
                                  <TableCell>
                                    <AppleBadge className="bg-blue-100/80 text-blue-700">
                                      Awarded
                                    </AppleBadge>
                                  </TableCell>
                                  <TableCell className="text-gray-600">
                                    {parseDeadline(
                                      tender
                                    )?.toLocaleDateString() || "—"}
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      href={`/business-dashboard/chat/${tender._id}`}
                                      className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-3 py-1 rounded-lg transition-colors"
                                    >
                                      Go to Chat
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>

            <CreateTenderModal
              open={openTenderModal}
              onOpenChange={setOpenTenderModal}
            />
          </div>
        </motion.div>
      </TooltipProvider>
    </PageTransitionWrapper>
  );
}
