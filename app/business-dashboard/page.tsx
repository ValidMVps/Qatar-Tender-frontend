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
import { useState } from "react";
import CreateTenderModal from "@/components/CreateTenderModal";
import RecentTenders from "@/components/RecentTenders";

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

interface Tender {
  id: string;
  title: string;
  department: string;
  value: string;
  postedDate: string;
  status: "active" | "draft" | "closed" | "awarded";
  applicants: number;
  publishedDate: string;
  category: string;
}

interface Bid {
  id: string;
  tenderTitle: string;
  bidAmount: string;
  status: "active" | "closed" | "awarded" | "rejected" | "pending";
  submissionDate: string;
}

// Updated dummy bids data
const bidsData: Bid[] = [
  {
    id: "BID001",
    tenderTitle: "Office Renovation Project",
    bidAmount: "$50,000",
    status: "active",
    submissionDate: "2024-07-28",
  },
  {
    id: "BID002",
    tenderTitle: "Software Development Contract",
    bidAmount: "$120,000",
    status: "closed",
    submissionDate: "2024-07-25",
  },
  {
    id: "BID003",
    tenderTitle: "Marketing Campaign for New Product",
    bidAmount: "$15,000",
    status: "awarded",
    submissionDate: "2024-07-20",
  },
  {
    id: "BID004",
    tenderTitle: "IT Support Services",
    bidAmount: "$30,000",
    status: "rejected",
    submissionDate: "2024-07-18",
  },
  {
    id: "BID005",
    tenderTitle: "Event Management for Annual Gala",
    bidAmount: "$75,000",
    status: "pending",
    submissionDate: "2024-07-15",
  },
];

const biddingSuccessData = [
  { month: "Jan", bidsPlaced: 20, bidsWon: 5 },
  { month: "Feb", bidsPlaced: 22, bidsWon: 6 },
  { month: "Mar", bidsPlaced: 18, bidsWon: 4 },
  { month: "Apr", bidsPlaced: 25, bidsWon: 7 },
  { month: "May", bidsPlaced: 20, bidsWon: 6 },
  { month: "Jun", bidsPlaced: 23, bidsWon: 8 },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);

  const getBidStatusBadge = (status: Bid["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500 text-white">{t("active")}</Badge>;
      case "closed":
        return <Badge className="bg-gray-500 text-white">{t("closed")}</Badge>;
      case "awarded":
        return (
          <Badge className="bg-green-500 text-white">{t("awarded")}</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 text-white">{t("rejected")}</Badge>;
      case "pending":
        return <Badge variant="outline">{t("pending")}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Placeholder logic for dynamic CTA button
  const hasPostedTenders = true;
  const hasPlacedBids = false;

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
                {t("welcome_back")} Acme Corp!
              </h1>
              <p className="text-md text-blue-100">
                {t("overview_of_posting_and_bidding_activity")}
              </p>
            </div>
            <div className="flex-shrink-0">{ctaButton}</div>
          </div>

          {/* Dual Column Overview: Recent Tenders & Recent Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentTenders />

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
                    {bidsData.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium">
                          {bid.tenderTitle}
                        </TableCell>
                        <TableCell>{bid.bidAmount}</TableCell>
                        <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                        <TableCell className="text-right">
                          {bid.submissionDate}
                        </TableCell>
                      </TableRow>
                    ))}
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
