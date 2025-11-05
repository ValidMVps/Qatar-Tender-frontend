"use client";
import {
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronRight,
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  Plus,
  BarChart2,
  TrendingUp,
  Timer,
  ClipboardList,
  RefreshCw,
  Bell,
  Banknote,
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
import { getTenderBids } from "../services/BidService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/context/NotificationContext"; // ← NEW
import { getUserBids } from "../services/BidService";
import { getActiveTenders } from "../services/tenderService";
import { OverviewChart } from "@/components/OverviewChart";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { useRouter } from "next/navigation";
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
  awardedTo?: any;
  awardedBidId?: string;
}
export interface Bid {
  _id: string;
  tender: {
    _id: string;
    title: string;
    description?: string;
    deadline: string;
    postedBy?: any;
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
  const [hasDraftTender, setHasDraftTender] = useState(false);
  // All helper and effect functions remain unchanged (as requested)
  const DRAFT_TENDER_DONT_SHOW_KEY = "draftTenderDontShow";
  const [dontShowDraftPrompt, setDontShowDraftPrompt] = useState(false);
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    isLoading: notifLoading,
  } = useNotifications() || {};

  // Live clock for “X minutes ago”
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const NotificationCard = () => {
    const prefix =
      profile?.userType === "business" ? "business-dashboard" : "dashboard";

    const getRoute = (n: any) => {
      // Same routing logic you already use in NotificationDemo
      const tenderId = n.relatedTender?._id || n.relatedTender;
      const bidId = n.relatedBid?._id || n.relatedBid;
      switch (n.type) {
        case "new_bid_received":
        case "tender_status":
        case "tender_created":
          return tenderId
            ? `/${prefix}/tender/${tenderId}`
            : `/${prefix}/my-tenders`;
        case "bid_submitted":
        case "bid_status_update":
          return tenderId
            ? `/${prefix}/tender-details/${tenderId}`
            : `/${prefix}/bids`;
        case "tender_awarded":
          return `/${prefix}/projects`;
        default:
          return tenderId
            ? `/${prefix}/tender-details/${tenderId}`
            : `/${prefix}`;
      }
    };

    const timeAgo = (date: string) => {
      const d = new Date(date);
      return differenceInDays(now, d) >= 7
        ? format(d, "dd MMM yyyy")
        : formatDistanceToNow(d, { addSuffix: true });
    };

    const theme = (type: string) => {
      const map: Record<string, any> = {
        new_bid_received: {
          dot: "bg-blue-500",
          iconBg: "bg-blue-100",
          icon: "text-blue-600",
        },
        tender_awarded: {
          dot: "bg-emerald-500",
          iconBg: "bg-emerald-100",
          icon: "text-emerald-600",
        },
        default: {
          dot: "bg-gray-500",
          iconBg: "bg-gray-100",
          icon: "text-gray-600",
        },
      };
      return map[type] || map.default;
    };
    const router = useRouter();
    const handleClick = async (n: any) => {
      router.push(getRoute(n));
    };

    return (
      <KpiCard
        title={t("recent_activity")}
        icon={Bell}
        href="/business-dashboard/notification"
      >
        {notifLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-400 text-xs sm:text-sm text-center py-3">
            {t("no_notifications")}
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n) => {
              const th = theme(n.type);
              return (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50/70 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-800 font-medium truncate">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </KpiCard>
    );
  };
  // init from localStorage (client-only)
  useEffect(() => {
    try {
      const val = localStorage.getItem(DRAFT_TENDER_DONT_SHOW_KEY);
      if (val === "1") setDontShowDraftPrompt(true);
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);
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
        const hasDraft = tenders.some((t) => t.status === "draft");
        setHasDraftTender(hasDraft);
        setRecentTenders(tenders);
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

  const totalTenders = recentTenders.length;
  const totalBids = myBids.length;
  const totalAwardedToMe = awardedToMe.length;
  const awaitingBidsCount = tendersWithNoBids.length;

  const upcomingDeadlines = recentTenders
    .map((t) => ({
      title: t.title,
      id: t._id,
      deadline: parseDeadline(t),
    }))
    .filter((item) => item.deadline)
    .sort(
      (a, b) => (a.deadline as Date).getTime() - (b.deadline as Date).getTime()
    )
    .slice(0, 3);

  const bidStatusSummary = myBids.reduce((acc, bid) => {
    acc[bid.status] = (acc[bid.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tenderStatusSummary = recentTenders.reduce(
    (acc, t) => {
      const status = t.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      active: 0,
      awarded: 0,
      completed: 0,
      rejected: 0,
      closed: 0,
      draft: 0,
    } as Record<string, number>
  );

  const toTs = (d?: string | Date | number) => (d ? new Date(d).getTime() : 0);

  // 2) build and filter items
  const tenderItems = recentTenders
    .filter((t) => t && t.status !== "draft") // remove drafts
    .map((t) => ({
      type: "tender" as const,
      title: t.title,
      id: t._id,
      createdAt: t.createdAt,
      ts: toTs(t.createdAt),
      status: t.status,
    }));

  const bidItems = myBids
    .filter((b) => b && b.tender && b.tender.title) // ignore bids on draft tenders
    .map((b) => ({
      type: "bid" as const,
      title: b.tender.title,
      id: b._id,
      createdAt: b.createdAt,
      ts: toTs(b.createdAt),
      tenderId: b.tender._id,
    }));

  // 3) combine, sort by timestamp desc, take top 3, then format time
  const recentActivity = [...tenderItems, ...bidItems]
    .sort((a, b) => b.ts - a.ts) // newest first
    .slice(0, 3)
    .map((act) => ({
      ...act,
      time: formatShortDate(act.createdAt),
    }));

  const KpiCard = ({
    title,
    icon: Icon,
    children,
    href,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    href?: string;
  }) => {
    const cardContent = (
      <motion.div
        whileHover={{ scale: href ? 1.02 : 1 }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 transition-all duration-300 h-full group cursor-pointer"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center transition-transform duration-300">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 tracking-wide">
              {title}
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">{children}</div>
        </div>
      </motion.div>
    );
    return href ? <Link href={href}>{cardContent}</Link> : cardContent;
  };

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
      "inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-all duration-200";
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
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
            {/* Apple-style Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden"
            >
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm border border-gray-100/50 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl sm:rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                      {t("welcome_back")}{" "}
                      <span className="text-blue-600">
                        {profile?.companyName}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                      {t("overview_of_posting_and_bidding_activity")}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenTenderModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs lg:text-lg text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t("post_new_tender")}
                    </motion.button>
                    <Link href="/business-dashboard/browse-tenders">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-100/80 hover:bg-gray-200/80 text-xs lg:text-lg text-gray-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-medium backdrop-blur-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200/50 w-full sm:w-auto"
                      >
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t("browse_tenders")}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Apple-style KPI Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <NotificationCard />

              <KpiCard
                title="Bid Summary"
                icon={TrendingUp}
                href="/business-dashboard/bids"
              >
                {Object.entries(bidStatusSummary).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl"
                  >
                    <span className="capitalize text-xs sm:text-sm text-gray-700 font-medium">
                      {status}
                    </span>
                    <AppleBadge className="bg-blue-100/80 text-blue-700 min-w-[20px] sm:min-w-[24px] text-center">
                      {count}
                    </AppleBadge>
                  </div>
                ))}
                {Object.keys(bidStatusSummary).length === 0 && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    No bids yet
                  </p>
                )}
              </KpiCard>

              <KpiCard
                title="Tender Status"
                icon={BarChart2}
                href="/business-dashboard/my-tenders"
              >
                {[
                  "active",
                  "awarded",
                  "completed",
                  "rejected",
                  "closed",
                  "draft",
                ].map((status) => {
                  const count = tenderStatusSummary[status];
                  if (!count) return null;
                  return (
                    <div
                      key={status}
                      className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl"
                    >
                      <span className="capitalize text-xs sm:text-sm text-gray-700 font-medium">
                        {status}
                      </span>
                      <AppleBadge
                        className={`min-w-[20px] sm:min-w-[24px] text-center ${
                          status === "awarded" || status === "completed"
                            ? "bg-green-100/80 text-green-700"
                            : status === "active"
                            ? "bg-blue-100/80 text-blue-700"
                            : status === "draft"
                            ? "bg-gray-100/80 text-gray-700"
                            : "bg-red-100/80 text-red-700"
                        }`}
                      >
                        {count}
                      </AppleBadge>
                    </div>
                  );
                })}
              </KpiCard>

              <KpiCard title="Upcoming Deadlines" icon={Timer}>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    No deadlines soon
                  </p>
                ) : (
                  upcomingDeadlines.map((item, i) => (
                    <Link
                      key={i}
                      href={`/business-dashboard/tender/${item.id}`}
                      className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-amber-50/50 rounded-lg sm:rounded-xl border border-amber-100/50 hover:bg-amber-100 transition"
                    >
                      <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[140px]">
                        {item.title}
                      </span>
                      <span className="text-xs text-amber-600 font-semibold">
                        {formatShortDate(item.deadline!.toString())}
                      </span>
                    </Link>
                  ))
                )}
              </KpiCard>
            </motion.div>
            {/* Apple-style Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden"
            >
              <div className="border-b border-gray-100/50 p-4 sm:p-6 pb-0">
                <div className="overflow-x-auto sm:overflow-visible -mx-2 sm:mx-0">
                  <nav className="flex flex-nowrap gap-1 sm:gap-2 bg-gray-100/50 rounded-xl sm:rounded-2xl p-1 px-2 sm:px-1 min-w-max sm:min-w-0">
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
                          className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                            activeTab === tab.id
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-4 sm:p-6 md:p-8"
              >
                {loading ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-3 sm:mt-4 text-base sm:text-lg">
                      {t("loading")}...
                    </p>
                  </div>
                ) : activeTab === "marketplace" ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Discover New Tenders
                      </h3>
                      <Link
                        href="/business-dashboard/browse-tenders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors mt-2 sm:mt-0"
                      >
                        Browse All
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                    <div className="grid gap-2 sm:gap-6">
                      {activeTenders.length === 0 ? (
                        <div className="text-center py-10 sm:py-12 text-gray-500">
                          <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                          <p className="text-base sm:text-lg">
                            No active tenders found.
                          </p>
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
                              <motion.div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100/60 hover:border-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-xl">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {tender.title}
                                      </h4>
                                      {isUrgent && (
                                        <AppleBadge className="bg-red-100/80 text-red-700 text-[10px] sm:text-xs">
                                          Urgent
                                        </AppleBadge>
                                      )}
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                                      {tender.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                      <AppleBadge variant="outline">
                                        {tender.category?.name || "General"}
                                      </AppleBadge>
                                      {tender.location && (
                                        <AppleBadge
                                          variant="outline"
                                          className="flex items-center gap-0.5 sm:gap-1"
                                        >
                                          <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                          {tender.location}
                                        </AppleBadge>
                                      )}
                                      <AppleBadge variant="outline">
                                        {tender.bidCount || 0} bids
                                      </AppleBadge>
                                    </div>
                                  </div>
                                  <div className="text-left lg:text-right lg:ml-4 lg:mt-0 mt-2 whitespace-nowrap bg-gray-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                    <div className="font-semibold text-base sm:text-xl text-gray-900">
                                      {budget > 0
                                        ? `${new Intl.NumberFormat().format(
                                            budget
                                          )} ${t("QAR")}`
                                        : "Not specified"}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Recent Tenders Posted
                      </h3>
                      <Link
                        href="/business-dashboard/my-tenders"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors mt-2 sm:mt-0"
                      >
                        View All
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Title
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Category
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Location
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Budget
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Bids
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Deadline
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTenders.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-10 sm:py-12 text-gray-500"
                              >
                                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg">
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
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                                  >
                                    {tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
                                  {tender.category?.name || "General"}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
                                  {tender.location || "—"}
                                </TableCell>
                                <TableCell className="font-medium text-xs sm:text-sm">
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
                                    <AppleBadge className="bg-blue-100/80 text-blue-700 text-xs sm:text-sm">
                                      Awarded
                                    </AppleBadge>
                                  ) : (
                                    <AppleBadge
                                      variant="outline"
                                      className="capitalize text-xs sm:text-sm"
                                    >
                                      {tender.status}
                                    </AppleBadge>
                                  )}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        My Bids
                      </h3>
                      <Link
                        href="/business-dashboard/bids"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors mt-2 sm:mt-0"
                      >
                        View All
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Tender
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Description
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Amount
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Submitted
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Deadline
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myBids.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-10 sm:py-12 text-gray-500"
                              >
                                <Banknote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg">
                                  No bids placed yet.
                                </p>
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
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                                  >
                                    {bid.tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm max-w-[120px] sm:max-w-xs line-clamp-1">
                                  {bid.description || "No description."}
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900 text-sm">
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
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Tenders Awaiting Bids
                      </h3>
                      <Link
                        href="/business-dashboard/my-tenders?filter=no-bids"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors mt-2 sm:mt-0"
                      >
                        View All
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100/60 bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Title
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Category
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Location
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Budget
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Description
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                              Deadline
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tendersWithNoBids.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-10 sm:py-12 text-gray-500"
                              >
                                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-green-300 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg">
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
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                                  >
                                    {tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
                                  {tender.category?.name || "General"}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
                                  {tender.location || "—"}
                                </TableCell>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  {resolveBudget(tender) > 0
                                    ? `${new Intl.NumberFormat().format(
                                        resolveBudget(tender)
                                      )} ${t("QAR")}`
                                    : "Not specified"}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm line-clamp-1 max-w-[120px] sm:max-w-xs">
                                  {tender.description || "No description."}
                                </TableCell>
                                <TableCell className="text-gray-600 text-xs sm:text-sm">
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
                  <div className="space-y-8 sm:space-y-12">
                    {/* Awarded to Me Section */}
                    <div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                          Awarded to Me
                        </h3>
                      </div>
                      {awardedToMe.length === 0 ? (
                        <div className="text-center py-10 sm:py-12 text-gray-500 bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60">
                          <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                          <p className="text-base sm:text-lg">
                            No bids awarded to you.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-100/60 bg-gray-50/50">
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Project
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Client
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Amount
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Deadline
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
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
                                    <TableCell className="font-medium text-gray-900 text-sm">
                                      {bid.tender.title}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-xs sm:text-sm">
                                      {bid.tender.postedBy?.email || "Private"}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900 text-sm">
                                      {new Intl.NumberFormat().format(
                                        bid.amount
                                      )}{" "}
                                      {t("QAR")}
                                    </TableCell>
                                    <TableCell>
                                      <AppleBadge className="bg-green-100/80 text-green-700 text-xs sm:text-sm">
                                        Accepted
                                      </AppleBadge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-xs sm:text-sm">
                                      {new Date(
                                        bid.tender.deadline
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`/business-dashboard/project`}
                                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm transition-colors"
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
                      <div className="flex items-center gap-2 sm:gap-3 mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                          Awarded by Me
                        </h3>
                      </div>
                      {awardedByMe.length === 0 ? (
                        <div className="text-center py-10 sm:py-12 text-gray-500 bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60">
                          <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                          <p className="text-base sm:text-lg">
                            No tenders awarded yet.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/90 rounded-xl sm:rounded-2xl border border-gray-100/60 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-100/60 bg-gray-50/50">
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Project
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Winner
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Budget
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                                  Deadline
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
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
                                  <TableCell className="font-medium text-gray-900 text-sm">
                                    {tender.title}
                                  </TableCell>
                                  <TableCell className="text-gray-600 text-xs sm:text-sm">
                                    {tender?.awardedTo?.email}
                                  </TableCell>
                                  <TableCell className="font-medium text-xs sm:text-sm">
                                    {resolveBudget(tender) > 0
                                      ? `${new Intl.NumberFormat().format(
                                          resolveBudget(tender)
                                        )} ${t("QAR")}`
                                      : "—"}
                                  </TableCell>
                                  <TableCell>
                                    <AppleBadge className="bg-blue-100/80 text-blue-700 text-xs sm:text-sm">
                                      Awarded
                                    </AppleBadge>
                                  </TableCell>
                                  <TableCell className="text-gray-600 text-xs sm:text-sm">
                                    {parseDeadline(
                                      tender
                                    )?.toLocaleDateString() || "—"}
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      href={`/business-dashboard/projects}`}
                                      className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm transition-colors"
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
            />{" "}
            {hasDraftTender && !dontShowDraftPrompt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={() => setHasDraftTender(false)} // background click just closes for now
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Complete Your Tender Now
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      You have a draft tender waiting. Finish it to start
                      receiving bids.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // persist "don't show again"
                          try {
                            localStorage.setItem(
                              DRAFT_TENDER_DONT_SHOW_KEY,
                              "1"
                            );
                          } catch (e) {
                            /* ignore */
                          }
                          setDontShowDraftPrompt(true);
                          setHasDraftTender(false);
                        }}
                        className="w-full"
                      >
                        Later
                      </Button>

                      <Button
                        asChild
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          // optional: also mark as dismissed when going to My Tenders
                          try {
                            localStorage.setItem(
                              DRAFT_TENDER_DONT_SHOW_KEY,
                              "1"
                            );
                          } catch (e) {}
                          setDontShowDraftPrompt(true);
                        }}
                      >
                        <Link href="/business-dashboard/my-tenders">
                          Go to My Tenders
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </TooltipProvider>
    </PageTransitionWrapper>
  );
}
