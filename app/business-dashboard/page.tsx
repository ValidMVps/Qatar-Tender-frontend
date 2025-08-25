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
import { getUserTenders } from "../services/tenderService";
import { getUserBids } from "../services/BidService";

// Import API services

// Define types
interface Tender {
  _id: string;
  title: string;
  category: string;
  status: string;
  deadline: string;
  createdAt: string;
  budget?: number;
}

export interface Bid {
  _id: string;
  tender: string;
  tenderTitle: string; // Ensure backend populates this
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

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const { user, profile } = useAuth();

  const [recentTenders, setRecentTenders] = useState<Tender[]>([]);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        // Fetch recent tenders posted by the user
        const tendersRes = await getUserTenders(user._id);
        setRecentTenders(tendersRes.slice(0, 5)); // Get latest 5

        // Fetch recent bids placed by the user
        const bidsRes = await getUserBids();
        setRecentBids(bidsRes.slice(0, 5)); // Get latest 5
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log("User ID:", profile);

    fetchDashboardData();
  }, [user?._id]);

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "accepted":
        return <Badge className="bg-blue-500 text-white">{t(status)}</Badge>;
      case "submitted":
        return <Badge className="bg-indigo-500 text-white">{t(status)}</Badge>;
      case "rejected":
        return <Badge className="bg-gray-500 text-white">{t(status)}</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-600 text-white">{t("completed")}</Badge>
        );
      case "under_review":
        return <Badge variant="outline">{t(status)}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const ctaButton = (
    <div className="flex gap-5">
      <Button
        className="bg-blue-600 shadow-none flex items-center"
        onClick={() => setOpenTenderModal(true)}
      >
        <Plus className="md:mr-2 mr-0 h-4 w-4" /> {t("post_new_tender")}
      </Button>
      <Link href={"/business-dashboard/browse-tenders"}>
        <Button className="bg-blue-600 shadow-md flex items-center">
          <Search className="md:mr-2 mr-0 h-4 w-4" /> {t("browse_tenders")}
        </Button>
      </Link>
    </div>
  );

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="container mx-auto px-0 py-5"
      >
        <main className="flex-1 py-1 px-1 md:py-5 md:px-3 space-y-7">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-10 px-8 rounded-lg bg-white backdrop-blur-xl shadow-xs border border-gray-200 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.02),transparent_50%)]"></div>

            <div className="mb-6 md:mb-0 relative z-10">
              <h1 className="md:text-3xl text-xl font-semibold pb-3 text-gray-900 tracking-tight leading-tight">
                {t("welcome_back")}{" "}
                <span className="text-blue-700">{profile?.companyName}</span>
              </h1>
              <p className="text-base text-gray-700 font-medium leading-relaxed">
                {t("overview_of_posting_and_bidding_activity")}
              </p>
            </div>
            <div className="flex-shrink-0 relative z-10">{ctaButton}</div>
          </div>

          {/* Dual Column Overview: Recent Tenders & Recent Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Tenders Posted */}
            <Card className="shadow-sm rounded-xl border-gray-100 bg-white/80 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
                  {t("recent_tenders_posted")}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                >
                  <Link href="/business-dashboard/my-tenders">
                    {t("view_all")}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {loading ? (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    {t("loading")}...
                  </p>
                ) : recentTenders.length === 0 ? (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    {t("no_tenders_posted")}
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-100">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow className="border-gray-100 hover:bg-gray-50/50">
                          <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                            {t("tender_title")}
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                            {t("category")}
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                            {t("status")}
                          </TableHead>
                          <TableHead className="text-right text-gray-700 font-semibold text-sm px-6 py-4">
                            {t("deadline")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {recentTenders.map((tender) => (
                          <TableRow
                            key={tender._id}
                            className="border-gray-100 hover:bg-gray-50/30 transition-colors duration-150 cursor-pointer"
                          >
                            <TableCell className="font-medium text-gray-900 px-6 py-4">
                              <Link
                                href={`/business-dashboard/tender/${tender._id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                              >
                                {tender.title}
                              </Link>
                            </TableCell>
                            <TableCell className="text-gray-700 px-6 py-4">
                              {tender.category.name}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              {getBidStatusBadge(tender.status)}
                            </TableCell>
                            <TableCell className="text-right text-gray-700 px-6 py-4">
                              {new Date(tender.deadline).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bids Placed */}
            <Card className="shadow-sm rounded-xl border-gray-100 bg-white/80 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
                  {t("recent_bids_placed")}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                >
                  <Link href="/business-dashboard/bids">
                    {t("view_all_bids")}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow className="border-gray-100 hover:bg-gray-50/50">
                        <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                          {t("tender_title")}
                        </TableHead>
                        <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                          {t("amount")}
                        </TableHead>
                        <TableHead className="text-gray-700 font-semibold text-sm px-6 py-4">
                          {t("status")}
                        </TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold text-sm px-6 py-4">
                          {t("submission_date")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {loading ? (
                        <TableRow className="border-gray-100">
                          <TableCell
                            colSpan={4}
                            className="text-center text-sm text-gray-500 py-12 px-6"
                          >
                            {t("loading")}...
                          </TableCell>
                        </TableRow>
                      ) : recentBids.length === 0 ? (
                        <TableRow className="border-gray-100">
                          <TableCell
                            colSpan={4}
                            className="text-center text-sm text-gray-500 py-12 px-6"
                          >
                            {t("no_bids_placed")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentBids.map(
                          (bid) => (
                            console.log(bid),
                            (
                              <TableRow
                                key={bid._id}
                                className="border-gray-100 hover:bg-gray-50/30 transition-colors duration-150 cursor-pointer"
                              >
                                <TableCell className="font-medium text-gray-900 px-6 py-4">
                                  <Link
                                    href={`/business-dashboard/tender-details/${bid.tender._id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                                  >
                                    {bid.tender.title}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-700 px-6 py-4">
                                  {new Intl.NumberFormat().format(bid.amount)}{" "}
                                  {t("QAR")}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  {getBidStatusBadge(bid.status)}
                                </TableCell>
                                <TableCell className="text-right text-gray-700 px-6 py-4">
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            )
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardContent>
                <OverviewChart />
              </CardContent>
            </Card>
          </div>

          <CreateTenderModal
            open={openTenderModal}
            onOpenChange={setOpenTenderModal}
          />
        </main>
      </motion.div>
    </TooltipProvider>
  );
}

// Mock data for charts (keep as-is unless replaced with real data)
const biddingSuccessData = [
  { month: "Jan", bidsPlaced: 12, bidsWon: 3 },
  { month: "Feb", bidsPlaced: 15, bidsWon: 5 },
  { month: "Mar", bidsPlaced: 18, bidsWon: 4 },
  { month: "Apr", bidsPlaced: 22, bidsWon: 8 },
  { month: "May", bidsPlaced: 20, bidsWon: 6 },
  { month: "Jun", bidsPlaced: 25, bidsWon: 9 },
];
