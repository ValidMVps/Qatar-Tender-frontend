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

// Types
interface Tender {
  _id: string;
  title: string;
  category: string | { name: string };
  status: string;
  deadline: string;
  createdAt: string;
  description?: string;
  location?: string;
  estimatedBudget?: number;
  budget?: string | number;
  bidsCount?: number;
}

interface Bid {
  _id: string;
  contractor: {
    companyName: string;
    _id: string;
  };
  amount: number;
  description: string;
  status: "pending" | "accepted" | "rejected" | "under_review" | "completed";
  createdAt: string;
}

export default function IndividualDashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "my-tenders" | "bids-received" | "awaiting" | "awarded"
  >("my-tenders");
  const { user, profile } = useAuth();

  const [myTenders, setMyTenders] = useState<Tender[]>([]);
  const [bidsReceived, setBidsReceived] = useState<Record<string, Bid[]>>({});
  const [tendersWithNoBids, setTendersWithNoBids] = useState<Tender[]>([]);
  const [awardedProjects, setAwardedProjects] = useState<Tender[]>([]);
  const [tenderStatusSummary, setTenderStatusSummary] = useState({
    open: 0,
    awarded: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);

  // Helper functions
  const resolveCategoryName = (tender: any) => {
    if (typeof tender.category === "string") return tender.category;
    return tender.category?.name || "General";
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];

        setMyTenders(tenders);

        const statusSummary = tenders.reduce(
          (acc, t) => {
            const now = new Date();
            const deadline = new Date(t.deadline);
            const isExpired = deadline < now;
            const isAwarded =
              t.status === "awarded" || t.status === "completed";

            if (isAwarded) {
              acc.awarded += 1;
            } else if (isExpired) {
              acc.expired += 1;
            } else {
              acc.open += 1;
            }
            return acc;
          },
          { open: 0, awarded: 0, expired: 0 }
        );
        setTenderStatusSummary(statusSummary);

        setTendersWithNoBids(
          tenders.filter((t) => !t.bidCount || t.bidCount === 0)
        );
        setAwardedProjects(
          tenders.filter(
            (t) => t.status === "awarded" || t.status === "completed"
          )
        );

        const bidsMap: Record<string, Bid[]> = {};
        for (const tender of tenders) {
          try {
            const bids = await getTenderBids(tender._id);
            bidsMap[tender._id] = Array.isArray(bids) ? bids : [];
          } catch (err) {
            console.error(`Failed to fetch bids for tender ${tender._id}`, err);
            bidsMap[tender._id] = [];
          }
        }
        setBidsReceived(bidsMap);
      } catch (error) {
        console.error("Failed to fetch individual dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            {t("submitted")}
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
            {t("under_review")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {t("rejected")}
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("accepted")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("completed")}
          </Badge>
        );
      case "returned_for_revision":
        return (
          <Badge variant="outline" className="bg-cyan-100 text-cyan-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("needs_revision")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTenderStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium";

    switch (status) {
      case "active":
      case "open":
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700`}>
            Open
          </span>
        );
      case "awarded":
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700`}>
            Awarded
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-gray-50 text-gray-700`}>
            Completed
          </span>
        );
      case "expired":
        return (
          <span className={`${baseClasses} bg-red-50 text-red-700`}>
            Expired
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
            {status}
          </span>
        );
    }
  };

  const totalTenders = myTenders.length;
  const totalBidsReceived = Object.values(bidsReceived).flat().length;
  const awardedCount = awardedProjects.length;

  const upcomingDeadlines = myTenders
    .map((t) => ({
      title: t.title,
      id: t._id,
      deadline: parseDeadline(t),
    }))
    .filter(
      (item) => item.deadline && (item.deadline as Date).getTime() > Date.now()
    )
    .sort(
      (a, b) => (a.deadline as Date).getTime() - (b.deadline as Date).getTime()
    )
    .slice(0, 3);

  const recentActivity = [
    ...myTenders.slice(0, 2).map((t) => ({
      type: "tender",
      title: t.title,
      time: formatShortDate(t.createdAt),
      id: t._id,
    })),
    ...(Object.values(bidsReceived).flat().slice(0, 1) as Bid[]).map((b) => ({
      type: "bid-received",
      title: `Bid from ${b.contractor?.companyName}`,
      time: formatShortDate(b.createdAt),
    })),
  ].slice(0, 3);

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
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide">
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
      "inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium";
    if (variant === "outline") {
      return (
        <span
          className={`${baseClasses} bg-gray-50/80 text-gray-600 border border-gray-200/60 ${className}`}
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100/50 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl sm:rounded-3xl"></div>
              <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                    {t("welcome_back")}{" "}
                    <span className="text-blue-600">
                      {profile?.fullName || profile?.companyName}
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                    Manage your tenders and review contractor bids.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenTenderModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">
                      Post New Tender
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <KpiCard
              title="Recent Activity"
              icon={ClipboardList}
              href="/dashboard/my-tenders"
            >
              {recentActivity.length === 0 ? (
                <p className="text-gray-400 text-xs sm:text-sm">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((act, i) => (
                  <Link
                    key={i}
                    href={
                      act.type === "tender"
                        ? `/dashboard/tender/${(act as any).id || "#"}`
                        : "/dashboard/my-tenders"
                    }
                    className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          act.type === "tender" ? "bg-blue-500" : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-gray-700 truncate max-w-[120px] sm:max-w-[140px]">
                        {act.type === "tender" ? "Posted: " : "Bid received: "}
                        {act.title}
                      </span>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {act.time}
                    </span>
                  </Link>
                ))
              )}
            </KpiCard>

            <KpiCard
              title="Bids Received"
              icon={Users}
              href="/dashboard/my-tenders"
            >
              <div className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Total Bids
                </span>
                <AppleBadge className="bg-blue-100/80 text-blue-700 min-w-[20px] sm:min-w-[24px] text-center">
                  {totalBidsReceived}
                </AppleBadge>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Avg per Tender
                </span>
                <AppleBadge className="bg-purple-100/80 text-purple-700 min-w-[20px] sm:min-w-[24px] text-center">
                  {myTenders.length > 0
                    ? (totalBidsReceived / myTenders.length).toFixed(1)
                    : "0"}
                </AppleBadge>
              </div>
            </KpiCard>

            <KpiCard
              title="Tender Status"
              icon={BarChart2}
              href="/dashboard/my-tenders"
            >
              {Object.entries(tenderStatusSummary).map(([status, count]) => {
                if (count === 0) return null;
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-gray-50/50 rounded-lg sm:rounded-xl"
                  >
                    <span className="capitalize text-gray-700 font-medium text-xs sm:text-sm">
                      {status}
                    </span>
                    <AppleBadge
                      className={`min-w-[20px] sm:min-w-[24px] text-center ${
                        status === "awarded"
                          ? "bg-green-100/80 text-green-700"
                          : status === "open"
                          ? "bg-blue-100/80 text-blue-700"
                          : "bg-red-100/80 text-red-700"
                      }`}
                    >
                      {count}
                    </AppleBadge>
                  </div>
                );
              })}
              {Object.values(tenderStatusSummary).every((v) => v === 0) && (
                <p className="text-gray-400 text-xs sm:text-sm">No tenders</p>
              )}
            </KpiCard>

            <KpiCard
              title="Upcoming Deadlines"
              icon={Timer}
              href="/dashboard/my-tenders"
            >
              {upcomingDeadlines.length === 0 ? (
                <p className="text-gray-400 text-xs sm:text-sm">
                  No deadlines soon
                </p>
              ) : (
                upcomingDeadlines.map((item, i) => (
                  <Link
                    key={i}
                    href={`/dashboard/tender/${item.id}`}
                    className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-amber-50/50 rounded-lg sm:rounded-xl border border-amber-100/50 hover:bg-amber-100 transition text-xs sm:text-sm"
                  >
                    <span className="text-gray-700 truncate max-w-[120px] sm:max-w-[140px]">
                      {item.title}
                    </span>
                    <span className="text-amber-600 font-semibold">
                      {formatShortDate(item.deadline!.toString())}
                    </span>
                  </Link>
                ))
              )}
            </KpiCard>
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden"
          >
            <div className="border-b border-gray-100/50 p-4 sm:p-6 pb-0">
              <nav
                className="
      flex gap-1 sm:gap-2 bg-gray-100/50 rounded-xl sm:rounded-2xl p-1 
      overflow-x-auto sm:overflow-x-visible scrollbar-hide
    "
              >
                <div className="flex flex-nowrap min-w-max">
                  {[
                    { id: "my-tenders", label: "My Tenders", icon: FileText },
                    {
                      id: "bids-received",
                      label: "Bids Received",
                      icon: Users,
                    },
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
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 
              rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm 
              transition-all duration-200 whitespace-nowrap mr-1 sm:mr-2
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
              }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>
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
                    Loading...
                  </p>
                </div>
              ) : activeTab === "my-tenders" ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      My Tenders
                    </h3>
                    <Link
                      href="/dashboard/my-tenders"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                      View All
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                  <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-gray-100/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Title
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Category
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Budget
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Bids
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Deadline
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myTenders.length === 0 ? (
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
                          myTenders.map((tender) => (
                            <TableRow
                              key={tender._id}
                              className="hover:bg-gray-50/50 cursor-pointer border-gray-100/60 transition-colors"
                            >
                              <TableCell>
                                <Link
                                  href={`/dashboard/tender/${tender._id}`}
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
                                  : "Not specified"}
                              </TableCell>
                              <TableCell>
                                <AppleBadge variant="outline">
                                  {tender.bidsCount || 0}
                                </AppleBadge>
                              </TableCell>
                              <TableCell>
                                {getTenderStatusBadge(tender.status)}
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
              ) : activeTab === "bids-received" ? (
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Bids Received on Your Tenders
                  </h3>
                  <div className="space-y-6">
                    {myTenders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 sm:py-6">
                        No tenders posted.
                      </p>
                    ) : Object.values(bidsReceived).flat().length === 0 ? (
                      <p className="text-gray-500 text-center py-4 sm:py-6">
                        No bids received yet.
                      </p>
                    ) : (
                      myTenders
                        .filter((t) => bidsReceived[t._id]?.length > 0)
                        .map((tender) => (
                          <div
                            key={tender._id}
                            className="overflow-x-auto rounded-xl sm:rounded-2xl border border-gray-100/60"
                          >
                            <div className="p-3 sm:p-4 border-b border-gray-100/60">
                              <h4 className="font-semibold text-gray-900">
                                {tender.title}
                              </h4>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-100/60 bg-gray-50/50">
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Contractor
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Proposal
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Amount
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Status
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Submitted
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bidsReceived[tender._id]?.map((bid) => (
                                  <TableRow
                                    key={bid._id}
                                    className="hover:bg-gray-50/50 border-gray-100/60 transition-colors"
                                  >
                                    <TableCell className="font-medium text-gray-900">
                                      {bid.contractor?.companyName}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm max-w-[120px] sm:max-w-xs line-clamp-1">
                                      {bid.description || "No details"}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900">
                                      {new Intl.NumberFormat().format(
                                        bid.amount
                                      )}{" "}
                                      {t("QAR")}
                                    </TableCell>
                                    <TableCell>
                                      {getBidStatusBadge(bid.status)}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                      {new Date(
                                        bid.createdAt
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`/dashboard/tender/${tender._id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg transition-colors text-xs sm:text-sm"
                                      >
                                        Review
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ) : activeTab === "awaiting" ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Tenders Awaiting Bids
                    </h3>
                    <Link
                      href="/dashboard/my-tenders?filter=no-bids"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                      View All
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                  <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-gray-100/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Title
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Category
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Budget
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Description
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
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
                                  href={`/dashboard/tender/${tender._id}`}
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
                                  : "Not specified"}
                              </TableCell>
                              <TableCell className="text-gray-600 text-sm max-w-[120px] sm:max-w-xs line-clamp-1">
                                {tender.description || "No description."}
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
              ) : activeTab === "awarded" ? (
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Awarded Projects
                  </h3>
                  <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-gray-100/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Project
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Contractor
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Budget
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Deadline
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {awardedProjects.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-10 sm:py-12 text-gray-500"
                            >
                              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                              <p className="text-base sm:text-lg">
                                No projects awarded yet.
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          awardedProjects.map((tender) => (
                            <TableRow
                              key={tender._id}
                              className="hover:bg-gray-50/50 border-gray-100/60 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-900">
                                {tender.title}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                Contractor Assigned
                              </TableCell>
                              <TableCell className="font-medium">
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                {getTenderStatusBadge(tender.status)}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {parseDeadline(tender)?.toLocaleDateString() ||
                                  "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/dashboard/projects`}
                                  className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg transition-colors text-xs sm:text-sm"
                                >
                                  Go to Chat
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
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
  );
}
