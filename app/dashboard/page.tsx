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
  Cross,
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
import { useTranslation } from "../../lib/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);

  const { user, isLoading, profile } = useAuth();

  const statsData = [
    {
      title: "total_tenders_posted",
      value: profile?.totalTenders,
      icon: FileText,
    },
    {
      title: "active_tenders",
      value: profile?.activeTenders,
      icon: CheckCircle,
    },
    {
      title: "Rejected Tenders",
      value: profile?.rejectedTenders,
      icon: Cross,
    },
    {
      title: "total_spent",
      value: profile?.totalSpent + "$",
      icon: DollarSign,
    },
  ];
  console.log("profile:", profile);
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="container mx-auto px-0"
    >
      {/* Welcome Box */}
      <main className="flex-1 py-1 px-1 md:py-9 md:px-3 space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-7 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-sm">
          <div className="mb-4 md:mb-0">
            <h1 className="md:text-3xl text-xl font-medium pb-2 text-white">
              {t("welcome_back")} {profile?.fullName}
            </h1>
            <p className="text-md text-blue-100">
              {t("overview_of_your_posting_and_bidding_activity_today")}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              className="text-blue-700 flex items-center"
              onClick={() => setOpenTenderModal(true)}
              variant={"secondary"}
            >
              <Plus className="md:mr-2 mr-0 h-4 w-4" /> {t("post_new_tender")}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="md:grid hidden gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-neutral-200 rounded-md transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {t(stat.title)}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
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
                {t("tenders_overview")}
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
