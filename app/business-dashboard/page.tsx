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

    fetchDashboardData();
  }, [user?._id]);

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "accepted":
      case "submitted":
        return <Badge className="bg-blue-500 text-white">{t(status)}</Badge>;
      case "closed":
      case "rejected":
        return <Badge className="bg-gray-500 text-white">{t(status)}</Badge>;
      case "awarded":
      case "completed":
        return (
          <Badge className="bg-green-500 text-white">{t("awarded")}</Badge>
        );
      case "pending":
      case "under_review":
        return <Badge variant="outline">{t(status)}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const ctaButton = (
    <div className="flex gap-5">
      <Button
        className="text-blue-700 shadow-none flex items-center"
        onClick={() => setOpenTenderModal(true)}
        variant="secondary"
      >
        <Plus className="md:mr-2 mr-0 h-4 w-4" /> {t("post_new_tender")}
      </Button>
      <Link href={"/business-dashboard/browse-tenders"}>
        <Button
          className="text-blue-800 shadow-md flex items-center"
          variant="secondary"
        >
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-7 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-sm">
            <div className="mb-4 md:mb-0">
              <h1 className="md:text-3xl text-xl font-medium pb-2 text-white">
                {t("welcome_back")} {profile?.fullName || "User"}!
              </h1>
              <p className="text-md text-blue-100">
                {t("overview_of_posting_and_bidding_activity")}
              </p>
            </div>
            <div className="flex-shrink-0">{ctaButton}</div>
          </div>

          {/* Dual Column Overview: Recent Tenders & Recent Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Tenders Posted */}
            {/* <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {t("recent_tenders_posted")}
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/business-dashboard/my-tenders">
                    {t("view_all")}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">{t("loading")}...</p>
                ) : recentTenders.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("no_tenders_posted")}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("tender_title")}</TableHead>
                        <TableHead>{t("category")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                        <TableHead className="text-right">
                          {t("deadline")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTenders.map((tender) => (
                        <TableRow key={tender._id}>
                          <TableCell className="font-medium">
                            {tender.title}
                          </TableCell>
                          <TableCell>{tender.category}</TableCell>
                          <TableCell>
                            {getBidStatusBadge(tender.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(tender.deadline).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card> */}

            {/* Recent Bids Placed */}
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {t("recent_bids_placed")}
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/business-dashboard/bids">
                    {t("view_all_bids")}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("tender_title")}</TableHead>
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">
                        {t("submission_date")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-sm text-gray-500"
                        >
                          {t("loading")}...
                        </TableCell>
                      </TableRow>
                    ) : recentBids.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-sm text-gray-500"
                        >
                          {t("no_bids_placed")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentBids.map((bid) => (
                        <TableRow key={bid._id}>
                          <TableCell className="font-medium">
                            {bid.tenderTitle}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat().format(bid.amount)}{" "}
                            {t("currency")}
                          </TableCell>
                          <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                          <TableCell className="text-right">
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t("posting_performance")}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {t("monthly_trend_of_tenders_posted_vs_bids_received")}
                </p>
              </CardHeader>
              <CardContent>
                <OverviewChart />
              </CardContent>
            </Card>

            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t("bidding_success_rate")}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {t("bids_placed_vs_bids_won")}
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="aspect-video h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={biddingSuccessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="bidsPlaced"
                        fill="#8884d8"
                        name={t("bids_placed")}
                      />
                      <Bar
                        dataKey="bidsWon"
                        fill="#82ca9d"
                        name={t("bids_won")}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
