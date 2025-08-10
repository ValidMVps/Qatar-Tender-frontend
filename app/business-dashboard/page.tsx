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

// Updated getBidStatusBadge
const getBidStatusBadge = (status: Bid["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-blue-500 text-white">Active</Badge>;
    case "closed":
      return <Badge className="bg-gray-500 text-white">Closed</Badge>;
    case "awarded":
      return <Badge className="bg-green-500 text-white">Awarded</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
const biddingSuccessData = [
  { month: "Jan", bidsPlaced: 20, bidsWon: 5 },
  { month: "Feb", bidsPlaced: 22, bidsWon: 6 },
  { month: "Mar", bidsPlaced: 18, bidsWon: 4 },
  { month: "Apr", bidsPlaced: 25, bidsWon: 7 },
  { month: "May", bidsPlaced: 20, bidsWon: 6 },
  { month: "Jun", bidsPlaced: 23, bidsWon: 8 },
];

export default function DashboardPage() {
  const [openTenderModal, setOpenTenderModal] = useState(false);

  const getBidStatusBadge = (status: Bid["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "closed":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
            closed
          </Badge>
        );
      case "awarded":
        return <Badge className="bg-emerald-600 text-white">Awarded</Badge>;
      case "closed":
        return <Badge variant="destructive">closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Placeholder logic for dynamic CTA button
  const hasPostedTenders = true; // Replace with actual logic based on user's company data
  const hasPlacedBids = false; // Replace with actual logic based on user's company data

  const ctaButton = hasPostedTenders ? (
    <Button
      className=" text-blue-700 shadow-none flex items-center"
      onClick={() => setOpenTenderModal(true)}
      variant={"secondary"}
    >
      <Plus className="md:mr-2 mr-0 h-4 w-4" /> Post New Tender
    </Button>
  ) : (
    <Button
      className="bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center"
      // You might want to use Next.js router for navigation here:
      // onClick={() => router.push("/browse-tenders")}
    >
      <Eye className="md:mr-2 mr-0 h-4 w-4" /> Browse Tenders
    </Button>
  );

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="container mx-auto px-0  py-5"
      >
        <main className="flex-1 py-1 px-1 md:py-5 md:px-3 space-y-7">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-7 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-sm">
            <div className="mb-4 md:mb-0">
              <h1 className="md:text-3xl text-xl font-medium pb-2 text-white">
                Welcome back Acme Corp!
              </h1>
              <p className="text-md text-blue-100">
                Here's an overview of your posting and bidding activity today.
              </p>
            </div>
            <div className="flex-shrink-0">{ctaButton}</div>
          </div>

          {/* Stats Cards - Grouped into two main cards */}

          {/* Dual Column Overview: Recent Tenders & Recent Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column: Recent Tenders Posted by Your Company */}
            <RecentTenders />

            {/* Right Column: Recent Bids You’ve Placed */}
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Recent Bids You&apos;ve Placed
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#">View All Bids</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tender Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        Submission Date
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
            {/* Posting Performance Chart */}
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Posting Performance
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Monthly trend of tenders posted vs bids received.
                </p>
              </CardHeader>
              <CardContent>
                <OverviewChart />
              </CardContent>
            </Card>

            {/* Bidding Success Rate Chart */}
            <Card className="shadow-xs rounded-md border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Bidding Success Rate
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Bids placed vs bids won.
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
                        name="Bids Placed"
                      />
                      <Bar dataKey="bidsWon" fill="#82ca9d" name="Bids Won" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Reminders / Notifications */}

          <CreateTenderModal
            open={openTenderModal}
            onOpenChange={setOpenTenderModal}
          />
        </main>
      </motion.div>
    </TooltipProvider>
  );
}
