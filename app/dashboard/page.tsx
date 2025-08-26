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

  // Reusable KPI Card
  const KpiCard = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100/60 hover:shadow-xs transition-all h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-600" />
          <CardTitle className="text-sm font-medium text-gray-900">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="min-h-screen bg-gray-50/30"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-8 rounded-lg bg-white backdrop-blur-xl shadow-xs border border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.02),transparent_50%)]"></div>

            <div className="mb-6 md:mb-0 relative z-10">
              <h1 className="md:text-3xl text-xl font-semibold text-gray-900">
                {t("welcome_back")}{" "}
                <span className="text-blue-600">
                  {profile?.fullName || profile?.companyName}
                </span>
              </h1>
              <p className="text-base text-gray-700 font-medium">
                Manage your tenders and review contractor bids.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-4">
              <Button
                onClick={() => setOpenTenderModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Tender
              </Button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="My Tenders" icon={ClipboardList}>
              <div className="text-2xl font-bold text-gray-900">
                {totalTenders}
              </div>
              <p className="text-xs text-gray-500">Total posted</p>
            </KpiCard>

            <KpiCard title="Bids Received" icon={TrendingUp}>
              <div className="text-2xl font-bold text-gray-900">
                {totalBidsReceived}
              </div>
              <p className="text-xs text-gray-500">From contractors</p>
            </KpiCard>

            {/* ✅ Tender Status KPI Card */}
            <KpiCard title="Tender Status" icon={BarChart2}>
              <div className="space-y-1.5 text-sm">
                {tenderStatusSummary.open > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Open</span>
                    <Badge className="bg-green-50 text-green-700">
                      {tenderStatusSummary.open}
                    </Badge>
                  </div>
                )}
                {tenderStatusSummary.awarded > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Awarded</span>
                    <Badge className="bg-blue-50 text-blue-700">
                      {tenderStatusSummary.awarded}
                    </Badge>
                  </div>
                )}
                {tenderStatusSummary.expired > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Expired</span>
                    <Badge className="bg-red-50 text-red-700">
                      {tenderStatusSummary.expired}
                    </Badge>
                  </div>
                )}
                {Object.values(tenderStatusSummary).every((v) => v === 0) && (
                  <p className="text-gray-400 text-xs">No tenders</p>
                )}
              </div>
            </KpiCard>

            {/* Optional: Keep Upcoming Deadlines */}
            <KpiCard title="Upcoming Deadlines" icon={Timer}>
              <div className="space-y-2 text-sm">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-gray-400 text-xs">No deadlines soon</p>
                ) : (
                  upcomingDeadlines.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span className="truncate max-w-[160px]">
                        {item.title}
                      </span>
                      <span className="text-amber-600 font-medium">
                        {formatShortDate(item.deadline!.toString())}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </KpiCard>
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50 overflow-hidden">
            <div className="border-b border-gray-100/50 px-6 py-4">
              <nav className="flex space-x-8 overflow-x-auto">
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
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 pb-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
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
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-3">Loading...</p>
                </div>
              ) : activeTab === "my-tenders" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      My Tenders
                    </h3>
                    <Link
                      href="/individual-dashboard/my-tenders"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Bids</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTenders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-500"
                          >
                            No tenders posted yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        myTenders.map((tender) => (
                          <TableRow
                            key={tender._id}
                            className="hover:bg-gray-50/50 cursor-pointer"
                          >
                            <TableCell>
                              <Link
                                href={`/individual-dashboard/tender/${tender._id}`}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {tender.title}
                              </Link>
                            </TableCell>
                            <TableCell>{resolveCategoryName(tender)}</TableCell>
                            <TableCell>{tender.location || "—"}</TableCell>
                            <TableCell>
                              {resolveBudget(tender) > 0
                                ? `${new Intl.NumberFormat().format(
                                    resolveBudget(tender)
                                  )} QAR`
                                : "Not specified"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {tender.bidsCount || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getTenderStatusBadge(tender.status)}
                            </TableCell>
                            <TableCell>
                              {parseDeadline(tender)?.toLocaleDateString() ||
                                "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : activeTab === "bids-received" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Bids Received on Your Tenders
                    </h3>
                  </div>
                  <div className="space-y-6">
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
                          <div key={tender._id}>
                            <h4 className="font-medium text-gray-900 mb-3">
                              {tender.title}
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Contractor</TableHead>
                                  <TableHead>Proposal</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Submitted</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bidsReceived[tender._id]?.map((bid) => (
                                  <TableRow key={bid._id}>
                                    <TableCell className="font-medium">
                                      {bid.contractor?.companyName}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
                                      {bid.description || "No details"}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                      {new Intl.NumberFormat().format(
                                        bid.amount
                                      )}{" "}
                                      QAR
                                    </TableCell>
                                    <TableCell>
                                      {getBidStatusBadge(bid.status)}
                                    </TableCell>
                                    <TableCell>
                                      {new Date(
                                        bid.createdAt
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`dashboard/tender/${tender._id}`}
                                        className="text-blue-500 hover:text-blue-600 text-sm"
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
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Tenders Awaiting Bids
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Deadline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tendersWithNoBids.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            All tenders have received bids!
                          </TableCell>
                        </TableRow>
                      ) : (
                        tendersWithNoBids.map((tender) => (
                          <TableRow
                            key={tender._id}
                            className="hover:bg-gray-50/50 cursor-pointer"
                          >
                            <TableCell>
                              <Link
                                href={`/individual-dashboard/tender/${tender._id}`}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {tender.title}
                              </Link>
                            </TableCell>
                            <TableCell>{resolveCategoryName(tender)}</TableCell>
                            <TableCell>{tender.location || "—"}</TableCell>
                            <TableCell>
                              {resolveBudget(tender) > 0
                                ? `${new Intl.NumberFormat().format(
                                    resolveBudget(tender)
                                  )} QAR`
                                : "Not specified"}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
                              {tender.description || "No description."}
                            </TableCell>
                            <TableCell>
                              {parseDeadline(tender)?.toLocaleDateString() ||
                                "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : activeTab === "awarded" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Awarded Projects
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {awardedProjects.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No projects awarded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        awardedProjects.map((tender) => (
                          <TableRow key={tender._id}>
                            <TableCell className="font-medium">
                              {tender.title}
                            </TableCell>
                            <TableCell>Contractor Assigned</TableCell>
                            <TableCell>
                              {resolveBudget(tender) > 0
                                ? `${new Intl.NumberFormat().format(
                                    resolveBudget(tender)
                                  )} QAR`
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {getTenderStatusBadge(tender.status)}
                            </TableCell>
                            <TableCell>
                              {parseDeadline(tender)?.toLocaleDateString() ||
                                "—"}
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/individual-dashboard/chat/${tender._id}`}
                                className="text-blue-500 hover:text-blue-600 text-sm"
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
              ) : null}
            </motion.div>
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
