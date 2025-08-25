"use client";
import {
  Eye,
  Banknote,
  Users,
  FileText,
  Wallet,
  UserRoundCheck,
  BadgeCheck,
  Plus,
  CalendarDays,
  MoreHorizontal,
  DollarSign,
  Edit,
  CheckCircle,
  Bell,
  Search,
  MapPin,
  ChevronRight,
  MessageSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { OverviewChart } from "@/components/OverviewChart";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { awardTender, getUserTenders } from "../services/tenderService";
import { getUserBids } from "../services/BidService";
import { getActiveTenders } from "../services/tenderService";

// Define types
interface Tender {
  _id: string;
  title: string;
  category: string | { name: string; title?: string };
  status: string;
  deadline: string;
  createdAt: string;
  budget?: number;
  bidsCount?: number;
}

export interface Bid {
  _id: string;
  tender: {
    _id: string;
    title: string;
  };
  amount: number;
  description: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentAmount: number;
  paymentId?: string;
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

interface ActiveProject {
  _id: string;
  title: string;
  status: string;
  lastMessage?: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const { user, profile } = useAuth();
  const [recentTenders, setRecentTenders] = useState<Tender[]>([]);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [activeTenders, setActiveTenders] = useState<any[]>([]);
  const [tendersWithNoBids, setTendersWithNoBids] = useState<Tender[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [awardTenders, setAwardTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper functions remain the same
  const resolveCategoryName = (tender: any) => {
    if (typeof tender.category === "string") return tender.category;
    if (tender.category?.name) return tender.category.name;
    if (tender.category?.title) return tender.category.title;
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        // Fetch recent tenders posted by the user
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];
        setRecentTenders(tenders.slice(0, 3));

        // Filter tenders with no bids
        const noBidTenders = tenders.filter(
          (tender) => tender.bidsCount === 0 || !tender.bidsCount
        );
        setTendersWithNoBids(noBidTenders.slice(0, 3));

        // Fetch recent bids placed by the user
        const bidsRes = await getUserBids();
        setRecentBids(Array.isArray(bidsRes) ? bidsRes.slice(0, 3) : []);

        // Fetch active tenders for marketplace glimpse
        const activeRes = await getActiveTenders();
        const filteredTenders = Array.isArray(activeRes)
          ? activeRes.filter((tender) => {
              const tenderUserId =
                tender.postedBy?._id ||
                tender.postedBy?.id ||
                tender.userId ||
                tender.postedBy;
              return tenderUserId !== user._id;
            })
          : [];
        setActiveTenders(filteredTenders.slice(0, 4));
        const awardedtenderlocla = tenders.filter(
          (i) => i.status === "awarded" || i.status === "completed"
        );
        console.log("awardedtenderlocla", awardedtenderlocla, activeRes);
        setAwardTenders(awardedtenderlocla);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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
      case "active":
      case "accepted":
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700`}>
            {t(status)}
          </span>
        );
      case "submitted":
        return (
          <span className={`${baseClasses} bg-indigo-50 text-indigo-700`}>
            {t(status)}
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
            {t(status)}
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("completed")}
          </span>
        );
      case "under_review":
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-700`}>
            {t(status)}
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

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="min-h-screen bg-gray-50/30"
      >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Apple-style Clean Header */}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-10 px-8 rounded-lg bg-white backdrop-blur-xl shadow-xs border border-gray-200 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.02),transparent_50%)]"></div>

            <div className="mb-6 md:mb-0 relative z-10">
              <h1 className="md:text-3xl text-xl font-semibold pb-3 text-gray-900 tracking-tight leading-tight">
                {t("welcome_back")}{" "}
                <span className="text-blue-600">{profile?.companyName}</span>
              </h1>
              <p className="text-base text-gray-700 font-medium leading-relaxed">
                {t("overview_of_posting_and_bidding_activity")}
              </p>
            </div>
            <div className="flex-shrink-0 flex relative z-10 gap-5">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium transition-all duration-200 shadow-xs border-0"
                onClick={() => setOpenTenderModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("post_new_tender")}
              </Button>
              <Link href={"/business-dashboard/browse-tenders"}>
                <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-6 py-2.5 font-medium transition-all duration-200 shadow-xs">
                  <Search className="w-4 h-4 mr-2" />
                  {t("browse_tenders")}
                </Button>
              </Link>
            </div>
          </div>
          {/* 2x2 Grid Layout for Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Tenders Posted */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("recent_tenders_posted")}
                  </h3>
                  <Link
                    href="/business-dashboard/my-tenders"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors"
                  >
                    {t("view_all")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {t("loading")}...
                    </p>
                  </div>
                ) : recentTenders.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {t("no_tenders_posted")}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100 hover:bg-transparent">
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("tender_title")}
                        </TableHead>
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("category")}
                        </TableHead>
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("status")}
                        </TableHead>
                        <TableHead className="text-right text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("deadline")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTenders.map((tender, index) => (
                        <TableRow
                          key={tender._id}
                          className={`border-gray-100/50 hover:bg-gray-50/30 transition-colors cursor-pointer ${
                            index === recentTenders.length - 1
                              ? "border-b-0"
                              : ""
                          }`}
                        >
                          <TableCell className="px-6 py-4">
                            <Link
                              href={`/business-dashboard/tender/${tender._id}`}
                              className="text-gray-900 hover:text-blue-600 font-medium text-sm transition-colors"
                            >
                              {tender.title}
                            </Link>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 text-sm">
                            {typeof tender.category === "string"
                              ? tender.category
                              : tender.category?.name || "General"}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {getBidStatusBadge(tender.status)}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4 text-gray-600 text-sm">
                            {new Date(tender.deadline).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Recent Bids Placed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("recent_bids_placed")}
                  </h3>
                  <Link
                    href="/business-dashboard/bids"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors"
                  >
                    {t("view_all_bids")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {t("loading")}...
                    </p>
                  </div>
                ) : recentBids.length === 0 ? (
                  <div className="text-center py-12">
                    <Banknote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {t("no_bids_placed")}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100 hover:bg-transparent">
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("tender_title")}
                        </TableHead>
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("amount")}
                        </TableHead>
                        <TableHead className="text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("status")}
                        </TableHead>
                        <TableHead className="text-right text-gray-600 font-medium text-xs uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                          {t("submission_date")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBids.map((bid, index) => (
                        <TableRow
                          key={bid._id}
                          className={`border-gray-100/50 hover:bg-gray-50/30 transition-colors cursor-pointer ${
                            index === recentBids.length - 1 ? "border-b-0" : ""
                          }`}
                        >
                          <TableCell className="px-6 py-4">
                            <Link
                              href={`/business-dashboard/tender-details/${bid.tender._id}`}
                              className="text-gray-900 hover:text-blue-600 font-medium text-sm transition-colors"
                            >
                              {bid.tender.title}
                            </Link>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-900 font-semibold">
                            {new Intl.NumberFormat().format(bid.amount)}{" "}
                            {t("QAR")}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {getBidStatusBadge(bid.status)}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4 text-gray-600 text-sm">
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Tenders With No Bids */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Tenders Awaiting Bids
                    </h3>
                    <AlertCircle className="w-4 h-4 ml-2 text-amber-500" />
                  </div>
                  <Link
                    href="/business-dashboard/my-tenders?filter=no-bids"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {t("loading")}...
                    </p>
                  </div>
                ) : tendersWithNoBids.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      All tenders have received bids!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tendersWithNoBids.map((tender) => (
                      <div key={tender._id} className="group">
                        <Link href={`/business-dashboard/tender/${tender._id}`}>
                          <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50/50 transition-colors border border-amber-100 bg-amber-50/20">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm mb-1">
                                {tender.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">
                                {typeof tender.category === "string"
                                  ? tender.category
                                  : tender.category?.name || "General"}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  No bids yet
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    tender.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Awarded Projects
                    </h3>
                    <MessageSquare className="w-4 h-4 ml-2 text-green-500" />
                  </div>
                  <Link
                    href="/business-dashboard/projects"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {t("loading")}...
                    </p>
                  </div>
                ) : activeProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No active projects</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {awardTenders.map((project) => {
                      console.log("project", project);
                      return (
                        <div key={project._id} className="group">
                          <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50/50 transition-colors border border-green-100 bg-green-50/20">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">
                                {project.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                {project.lastMessage}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                                  In Progress
                                </span>
                                <Link
                                  href={`/business-dashboard/chat/${project._id}`}
                                  className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Chat
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Marketplace Section - Full Width */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50">
            <div className="p-6 border-b border-gray-100/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-1">
                    {t("explore_new_tenders")}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {t("discover_recently_posted_opportunities")}
                  </p>
                </div>
                <Link
                  href="/business-dashboard/browse-tenders"
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t("browse_all_tenders")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-gray-400 mt-3">{t("loading")}...</p>
                </div>
              ) : activeTenders.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {t("no_active_tenders_found")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTenders.map((tender) => {
                    const budget = resolveBudget(tender);
                    const deadline = parseDeadline(tender);
                    const isUrgent = deadline
                      ? (deadline.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24) <=
                        7
                      : false;

                    return (
                      <Link
                        key={tender._id}
                        href={`/business-dashboard/tender-details/${tender._id}`}
                        className="block group"
                      >
                        <div className="p-5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-xs transition-all duration-200 bg-white/50">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 pr-2">
                              {tender.title}
                            </h4>
                            {isUrgent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 whitespace-nowrap">
                                {t("urgent")}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                            {tender.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                              {resolveCategoryName(tender)}
                            </span>
                            {tender.location && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                <MapPin className="w-3 h-3 mr-1" />
                                {tender.location}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {budget > 0
                                ? `${new Intl.NumberFormat().format(
                                    budget
                                  )} ${t("QAR")}`
                                : t("budget_not_specified")}
                            </span>
                            {deadline && (
                              <span className="text-xs text-gray-400">
                                Due {deadline.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <CreateTenderModal
            open={openTenderModal}
            onOpenChange={setOpenTenderModal}
          />
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
