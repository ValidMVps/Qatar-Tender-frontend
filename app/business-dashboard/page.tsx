"use client";
import {
  FileText,
  Banknote,
  Clock,
  MessageSquare,
  Search,
  ChevronRight,
  MapPin,
  AlertCircle,
  CheckCircle,
  Users,
  Eye,
  DollarSign,
  CalendarDays,
  Plus,
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
import { getUserBids } from "../services/BidService";
import { getActiveTenders } from "../services/tenderService";

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
  awardedTo?: string;
  awardedBidId?: string;
}

export interface Bid {
  _id: string;
  tender: {
    _id: string;
    title: string;
    description?: string;
    postedBy?: { companyName?: string };
  };
  amount: number;
  description: string;
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

interface ActiveTender {
  _id: string;
  title: string;
  category: string | { name: string };
  description: string;
  location?: string;
  budget?: string | number;
  deadline: string;
  postedBy?: { companyName?: string; _id: string };
  createdAt: string;
  bidsCount?: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const [activeTab, setActiveTab] = useState("marketplace"); // 'marketplace', 'recent', 'bids', 'awaiting', 'awarded'
  const { user, profile } = useAuth();

  const [recentTenders, setRecentTenders] = useState<Tender[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [tendersWithNoBids, setTendersWithNoBids] = useState<Tender[]>([]);
  const [awardedToMe, setAwardedToMe] = useState<Bid[]>([]);
  const [awardedByMe, setAwardedByMe] = useState<Tender[]>([]);
  const [activeTenders, setActiveTenders] = useState<ActiveTender[]>([]);
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        // Fetch user's tenders
        const tendersRes = await getUserTenders(user._id);
        const tenders = Array.isArray(tendersRes) ? tendersRes : [];

        // Recent Tenders (max 6)
        setRecentTenders(tenders.slice(0, 6));

        // Tenders with no bids
        setTendersWithNoBids(
          tenders.filter((t) => !t.bidsCount || t.bidsCount === 0)
        );

        // Awarded by me (tenders I posted and awarded)
        setAwardedByMe(
          tenders.filter(
            (t) => t.status === "awarded" || t.status === "completed"
          )
        );

        // Fetch user's bids
        const bidsRes = await getUserBids();
        const bids = Array.isArray(bidsRes) ? bidsRes : [];

        // Bids placed by me
        setMyBids(bids);

        // Bids where I was awarded
        setAwardedToMe(
          bids.filter(
            (bid) => bid.status === "accepted" || bid.status === "completed"
          )
        );

        // Fetch marketplace tenders (exclude own)
        const activeRes = await getActiveTenders();
        const filtered = Array.isArray(activeRes)
          ? activeRes.filter((tender) => {
              const postedById =
                tender.postedBy?._id ||
                tender.postedBy?.id ||
                tender.userId ||
                tender.postedBy;
              return postedById !== user._id;
            })
          : [];
        setActiveTenders(filtered);
      } catch (error) {
        console.error("Failed to fetch dashboard ", error);
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

  const getTenderStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium";

    switch (status) {
      case "active":
      case "open":
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700`}>
            {t(status)}
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

  // Tabs Configuration
  const tabs = [
    { id: "marketplace", label: "Marketplace", icon: Search },
    { id: "recent", label: "Recent Tenders", icon: FileText },
    { id: "bids", label: "My Bids", icon: Banknote },
    { id: "awaiting", label: "Awaiting Bids", icon: Clock },
    { id: "awarded", label: "Awarded Projects", icon: MessageSquare },
  ];

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
                <span className="text-blue-600">{profile?.companyName}</span>
              </h1>
              <p className="text-base text-gray-700 font-medium">
                {t("overview_of_posting_and_bidding_activity")}
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-4">
              <Button
                onClick={() => setOpenTenderModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("post_new_tender")}
              </Button>
              <Link href="/business-dashboard/browse-tenders">
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-200 hover:bg-gray-50 px-6 py-2.5"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {t("browse_tenders")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-100/50 overflow-hidden">
            <div className="border-b border-gray-100/50 px-6 py-4">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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
                  <p className="text-gray-400 mt-3">{t("loading")}...</p>
                </div>
              ) : activeTab === "marketplace" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Discover New Tenders
                    </h3>
                    <Link
                      href="/business-dashboard/browse-tenders"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      Browse All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {activeTenders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No active tenders found.
                      </div>
                    ) : (
                      activeTenders.map((tender) => {
                        const budget = resolveBudget(tender);
                        const deadline = parseDeadline(tender);
                        const isUrgent =
                          deadline &&
                          (deadline.getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24) <=
                            7;

                        return (
                          <Link
                            key={tender._id}
                            href={`/business-dashboard/tender-details/${tender._id}`}
                            className="block group"
                          >
                            <div className="p-5 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-xs transition-all bg-white">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                      {tender.title}
                                    </h4>
                                    {isUrgent && (
                                      <Badge className="bg-red-500 text-white text-xs">
                                        Urgent
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {tender.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge variant="outline">
                                      {resolveCategoryName(tender)}
                                    </Badge>
                                    {tender.location && (
                                      <Badge
                                        variant="outline"
                                        className="flex items-center"
                                      >
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {tender.location}
                                      </Badge>
                                    )}
                                    <Badge variant="outline">
                                      {tender.bidsCount || 0} bids
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right md:ml-4 whitespace-nowrap">
                                  <div className="font-semibold text-gray-900">
                                    {budget > 0
                                      ? `${new Intl.NumberFormat().format(
                                          budget
                                        )} ${t("QAR")}`
                                      : "Not specified"}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Due {deadline?.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : activeTab === "recent" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Tenders Posted
                    </h3>
                    <Link
                      href="/business-dashboard/my-tenders"
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
                      {recentTenders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-500"
                          >
                            No tenders posted yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentTenders.map((tender) => (
                          <TableRow
                            key={tender._id}
                            className="hover:bg-gray-50/50 cursor-pointer"
                          >
                            <TableCell>
                              <Link
                                href={`/business-dashboard/tender/${tender._id}`}
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
                                  )} ${t("QAR")}`
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
              ) : activeTab === "bids" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      My Bids
                    </h3>
                    <Link
                      href="/business-dashboard/bids"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tender</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Deadline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myBids.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No bids placed yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        myBids.map((bid) => (
                          <TableRow
                            key={bid._id}
                            className="hover:bg-gray-50/50 cursor-pointer"
                          >
                            <TableCell className="w-100">
                              <Link
                                href={`/business-dashboard/tender-details/${bid.tender._id}`}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {bid.tender.title}
                              </Link>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm px-4 w-60 max-w-[240px] ">
                              <div className="w-40 truncate">
                                {bid.description || "No description provided."}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {new Intl.NumberFormat().format(bid.amount)}{" "}
                              {t("QAR")}
                            </TableCell>
                            <TableCell>
                              {getBidStatusBadge(bid.status)}
                            </TableCell>
                            <TableCell>
                              {new Date(bid.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {bid.tender.deadline
                                ? new Date(
                                    bid.tender.deadline
                                  ).toLocaleDateString()
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : activeTab === "awaiting" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Tenders Awaiting Bids
                    </h3>
                    <Link
                      href="/business-dashboard/my-tenders?filter=no-bids"
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
                                href={`/business-dashboard/tender/${tender._id}`}
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
                                  )} ${t("QAR")}`
                                : "Not specified"}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm line-clamp-1 max-w-xs">
                              {tender.description || "No description provided."}
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
                <div className="space-y-10">
                  {/* Awarded to Me */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      🏆 Awarded to Me
                    </h3>
                    {awardedToMe.length === 0 ? (
                      <p className="text-gray-500 text-center py-6">
                        No bids have been awarded to you yet.
                      </p>
                    ) : (
                      <Table className="table-fixed w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Project</TableHead>
                            <TableHead className="w-1/6">Client</TableHead>
                            <TableHead className="w-1/6">Amount</TableHead>
                            <TableHead className="w-1/6">Status</TableHead>
                            <TableHead className="w-1/6">Deadline</TableHead>
                            <TableHead className="w-1/6">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {awardedToMe.map((bid) => (
                            <TableRow key={bid._id}>
                              <TableCell className="font-medium">
                                {bid.tender.title}
                              </TableCell>
                              <TableCell>
                                {bid.tender.postedBy?.companyName || "Private"}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {new Intl.NumberFormat().format(bid.amount)}{" "}
                                {t("QAR")}
                              </TableCell>
                              <TableCell>
                                {getBidStatusBadge(bid.status)}
                              </TableCell>
                              <TableCell>
                                {bid.tender.deadline
                                  ? new Date(
                                      bid.tender.deadline
                                    ).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/business-dashboard/chat/${bid.tender._id}`}
                                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                >
                                  Go to Chat
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {/* Awarded by Me */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      🤝 Awarded by Me
                    </h3>
                    {awardedByMe.length === 0 ? (
                      <p className="text-gray-500 text-center py-6">
                        You haven't awarded any tenders yet.
                      </p>
                    ) : (
                      <Table className="table-fixed w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Project</TableHead>
                            <TableHead className="w-1/6">Winner</TableHead>
                            <TableHead className="w-1/6">Budget</TableHead>
                            <TableHead className="w-1/6">Status</TableHead>
                            <TableHead className="w-1/6">Deadline</TableHead>
                            <TableHead className="w-1/6">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {awardedByMe.map((tender) => (
                            <TableRow key={tender._id}>
                              <TableCell className="font-medium">
                                {tender.title}
                              </TableCell>
                              <TableCell>Contractor</TableCell>
                              <TableCell>
                                {resolveBudget(tender) > 0
                                  ? `${new Intl.NumberFormat().format(
                                      resolveBudget(tender)
                                    )} ${t("QAR")}`
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
                                  href={`/business-dashboard/chat/${tender._id}`}
                                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                >
                                  Go to Chat
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
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
