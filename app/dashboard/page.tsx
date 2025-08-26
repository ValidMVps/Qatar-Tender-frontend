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
        // Fetch user's tenders
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];

        setMyTenders(tenders);

        // Compute status summary
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

        // Set other states
        setTendersWithNoBids(
          tenders.filter((t) => !t.bidCount || t.bidCount === 0)
        );
        setAwardedProjects(
          tenders.filter(
            (t) => t.status === "awarded" || t.status === "completed"
          )
        );

        // Fetch bids for each tender
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
    const baseClasses =
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium";

    switch (status) {
      case "accepted":
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700`}>
            Accepted
          </span>
        );
      case "under_review":
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-700`}>
            Under Review
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
            Rejected
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

  // KPI Data
  const totalTenders = myTenders.length;
  const totalBidsReceived = Object.values(bidsReceived).flat().length;
  const awardedCount = awardedProjects.length;

  // Upcoming deadlines
  const upcomingDeadlines = myTenders
    .map((t) => ({
      title: t.title,
      deadline: parseDeadline(t),
    }))
    .filter(
      (item) => item.deadline && (item.deadline as Date).getTime() > Date.now()
    )
    .sort(
      (a, b) => (a.deadline as Date).getTime() - (b.deadline as Date).getTime()
    )
    .slice(0, 3);

  // Recent activity
  const recentActivity = [
    ...myTenders.slice(0, 2).map((t) => ({
      type: "tender",
      title: t.title,
      time: formatShortDate(t.createdAt),
    })),
    ...(Object.values(bidsReceived).flat().slice(0, 1) as Bid[]).map((b) => ({
      type: "bid-received",
      title: `Bid from ${b.contractor?.companyName}`,
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
                      {profile?.fullName || profile?.companyName}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                    Manage your tenders and review contractor bids.
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
                    Post New Tender
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
                          act.type === "tender" ? "bg-blue-500" : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700 truncate max-w-[140px]">
                        {act.type === "tender" ? "Posted: " : "Bid received: "}
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

            {/* Bids Received Summary */}
            <KpiCard title="Bids Received" icon={Users}>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-xl">
                <span className="text-sm text-gray-700 font-medium">
                  Total Bids
                </span>
                <AppleBadge className="bg-blue-100/80 text-blue-700 min-w-[24px] text-center">
                  {totalBidsReceived}
                </AppleBadge>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-xl">
                <span className="text-sm text-gray-700 font-medium">
                  Avg per Tender
                </span>
                <AppleBadge className="bg-purple-100/80 text-purple-700 min-w-[24px] text-center">
                  {myTenders.length > 0
                    ? (totalBidsReceived / myTenders.length).toFixed(1)
                    : "0"}
                </AppleBadge>
              </div>
            </KpiCard>

            {/* Tender Status */}
            <KpiCard title="Tender Status" icon={BarChart2}>
              {Object.entries(tenderStatusSummary).map(([status, count]) => {
                if (count === 0) return null;
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
                  { id: "my-tenders", label: "My Tenders", icon: FileText },
                  { id: "bids-received", label: "Bids Received", icon: Users },
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
                  <p className="text-gray-500 mt-4 text-lg">Loading...</p>
                </div>
              ) : activeTab === "my-tenders" ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      My Tenders
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders"
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
                        {myTenders.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-12 text-gray-500"
                            >
                              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                              <p className="text-lg">No tenders posted yet.</p>
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
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Bids Received on Your Tenders
                    </h3>
                  </div>
                  <div className="space-y-8">
                    {myTenders.length === 0 ? (
                      <p className="text-gray-500 text-center py-6">
                        No tenders posted.
                      </p>
                    ) : Object.values(bidsReceived).flat().length === 0 ? (
                      <p className="text-gray-500 text-center py-6">
                        No bids received yet.
                      </p>
                    ) : (
                      myTenders
                        .filter((t) => bidsReceived[t._id]?.length > 0)
                        .map((tender) => (
                          <div
                            key={tender._id}
                            className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden"
                          >
                            <div className="p-4 border-b border-gray-100/60">
                              <h4 className="font-semibold text-gray-900">
                                {tender.title}
                              </h4>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-100/60 bg-gray-50/50">
                                  <TableHead className="font-semibold text-gray-700">
                                    Contractor
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Proposal
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
                                    <TableCell className="text-gray-600 text-sm max-w-xs line-clamp-1">
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
                                        href={`/individual-dashboard/tender/${tender._id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-3 py-1 rounded-lg transition-colors"
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
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Tenders Awaiting Bids
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders?filter=no-bids"
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
                                  : "Not specified"}
                              </TableCell>
                              <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
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
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Awarded Projects
                    </h3>
                  </div>
                  <div className="bg-white/90 rounded-2xl border border-gray-100/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100/60 bg-gray-50/50">
                          <TableHead className="font-semibold text-gray-700">
                            Project
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Contractor
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
                        {awardedProjects.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-12 text-gray-500"
                            >
                              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                              <p className="text-lg">
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
                                  href={`/individual-dashboard/chat/${tender._id}`}
                                  className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50/80 px-3 py-1 rounded-lg transition-colors"
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
