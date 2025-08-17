"use client";

import {
  Eye,
  BarChart3,
  Banknote,
  Users,
  FileText,
  LayoutDashboard,
  Wallet,
  UserRoundCheck,
  BadgeCheck,
  Plus,
  Building2,
  CalendarDays,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Edit,
  CheckCircle,
  Icon,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import CreateTenderModal from "@/components/CreateTenderModal";
import { TenderCarder } from "@/components/TenderCarder";
import { OverviewChart } from "@/components/OverviewChart";
import RecentTenders from "@/components/RecentTenders";
import GoogleTranslate from "next-google-translate-widget";

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

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  active: {
    label: "Active",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: BadgeCheck,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: FileText,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Edit,
  },
  awarded: {
    label: "Awarded",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: UserRoundCheck,
  },
};

const statsData = [
  {
    title: "Total Tenders Posted",
    value: "12",
    icon: FileText,
    description: "Last 30 days",
  },
  {
    title: "Active Tenders",
    value: "3",
    icon: CheckCircle,
    description: "Currently open",
  },
  {
    title: "Bids Received",
    value: "47",
    icon: Users,
    description: "Across all tenders",
  },
  {
    title: "Total Spent",
    value: "$2,500",
    icon: DollarSign,
    description: "This month",
  },
];

export default function DashboardPage() {
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            Active
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "awarded":
        return <Badge className="bg-emerald-600 text-white">Awarded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="container mx-auto px-0"
    >
      {/* Welcome Box */}
      <main className="flex-1  py-1 px-1 md:py-9 md:px-3  space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-7 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-sm">
          <div className="mb-4 md:mb-0">
            <h1 className="md:text-3xl text-xl font-medium pb-2 text-white">
              Welcome back Ahmed
            </h1>
            <p className="text-md text-blue-100">
              Here's an overview of your posting and bidding activity today.
            </p>
          </div>
          <div className="flex-shrink-0">
            {" "}
            <Button
              className=" text-blue-700 flex items-center "
              onClick={() => setOpenTenderModal(true)}
              variant={"secondary"}
            >
              <Plus className="md:mr-2 mr-0 h-4 w-4" /> Post New Tender
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="md:grid hidden gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon; // Capitalized so JSX knows it's a component
            return (
              <Card
                key={index}
                className="border-neutral-200 rounded-md transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  {stat.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Overview Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentTenders />
          <Card className="mb-8 shadow-xs rounded-md border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Tenders Overview
              </CardTitle>
            </CardHeader>
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
  );
}
