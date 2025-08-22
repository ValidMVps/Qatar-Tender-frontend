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
        <div className="flex flex-col py-9 px-9 rounded-lg   bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200 border ">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="md:text-3xl text-xl font-medium pb-2 text-gray-800">
                {t("welcome_back")} {profile?.fullName}
              </h1>
              <p className="text-md text-gray-700">
                {t("overview_of_your_posting_and_bidding_activity_today")}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                className="flex items-center"
                onClick={() => setOpenTenderModal(true)}
              >
                <Plus className="md:mr-2 mr-0 h-4 w-4" /> {t("post_new_tender")}
              </Button>
            </div>
          </div>

          {/* Stats Cards inside welcome box */}
          <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="transition-shadow duration-200 rounded-lg shadow-0 border-0 bg-white/70"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {t(stat.title)}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-blue-700" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
