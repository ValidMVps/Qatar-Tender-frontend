"use client";
import * as React from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  LineChartIcon as ChartLine,
  ChevronRight,
  CircleHelp,
  Clock,
  FilePlus,
  Gauge,
  Inbox,
  Layers,
  LineChartIcon,
  ListOrdered,
  Settings,
  Star,
  User,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ProjectsOverviewChart from "@/components/ProjectOverviewChart";

import { useTranslation } from "../../../lib/hooks/useTranslation";
type TenderStatus = "Pending" | "Active" | "Closed";

type Tender = {
  id: string;
  title: string;
  category: string;
  status: TenderStatus;
  bidsReceived: number;
  views: number;
  postedAt: string; // ISO date
  deadline: string; // ISO date
  bidDiffPct?: number; // For visualization; e.g., spread between min and max bids (%)
  value: number;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-QA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: TenderStatus }) {
  const { t } = useTranslation();
  if (status === "Active")
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
        {t("active")}
      </Badge>
    );
  if (status === "Pending")
    return <Badge variant="secondary">{t("pending")}</Badge>;
  return <Badge variant="outline">{t("closed")}</Badge>;
}

function StatCard({
  title,
  value,
  icon,
  subtle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtle?: string;
}) {
  const { t } = useTranslation();

  return (
    <>
      <Card className="h-full border-1 md:block hidden shadow-none bg-blue-500 text-white border-neutral-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-white ">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{value}</div>
          {subtle ? <p className="text-xs text-white mt-1">{subtle}</p> : null}
        </CardContent>
      </Card>
      <Card className="w-full border-0 border-b-1  md:hidden flex justify-between items-center shadow-none bg-white text-black border-neutral-200 rounded-none ">
        <CardTitle className="text-sm font-medium">
          {title}
          {subtle ? (
            <p className="text-xs text-black/70 font-normal mt-0">{subtle}</p>
          ) : null}
        </CardTitle>
        <CardContent className="flex items-center justify-center x py-3">
          <div className="text-lg font-semibold">{value}</div>
        </CardContent>
      </Card>
    </>
  );
}

type SortColumn = "postedAt" | "deadline" | "bidsReceived" | null;
type SortDirection = "asc" | "desc";

export default function Component() {
  const { t } = useTranslation();

  const [query, setQuery] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<SortColumn>(null);
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  const [filterStatus, setFilterStatus] = React.useState<TenderStatus | "All">(
    "All"
  );
  const dummyTenders: Tender[] = [
    {
      id: "TND-001",
      title: t("apartment_renovation_kitchen_bath"),
      category: "Construction",
      status: "Active",
      bidsReceived: 12,
      views: 420,
      postedAt: "2025-07-20",
      deadline: "2025-08-15",
      bidDiffPct: 24,
      value: 150000, // Added value
    },
    {
      id: "TND-002",
      title: t("home_solar_panel_installation"),
      category: "Energy",
      status: "Active",
      bidsReceived: 0,
      views: 185,
      postedAt: "2025-07-29",
      deadline: "2025-08-10",
      bidDiffPct: 0,
      value: 25000, // Added value
    },
    {
      id: "TND-003",
      title: t("custom_wardrobes_cabinetry"),
      category: "Carpentry",
      status: "Active",
      bidsReceived: 7,
      views: 260,
      postedAt: "2025-07-18",
      deadline: "2025-08-05",
      bidDiffPct: 31,
      value: 18000, // Added value
    },
    {
      id: "TND-004",
      title: t("landscape_design_irrigation"),
      category: "Landscaping",
      status: "Active",
      bidsReceived: 9,
      views: 510,
      postedAt: "2025-06-30",
      deadline: "2025-07-30",
      bidDiffPct: 18,
      value: 35000, // Added value
    },
    {
      id: "TND-005",
      title: t("ac_servicing_duct_cleaning"),
      category: "HVAC",
      status: "Active",
      bidsReceived: 2,
      views: 143,
      postedAt: "2025-07-25",
      deadline: "2025-08-06",
      bidDiffPct: 12,
      value: 5000, // Added value
    },
    {
      id: "TND-006",
      title: t("painting_3bhk_apartment"),
      category: "Painting",
      status: "Active",
      bidsReceived: 5,
      views: 201,
      postedAt: "2025-07-15",
      deadline: "2025-08-03",
      bidDiffPct: 22,
      value: 8000, // Added value
    },
  ];

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc"); // Default to ascending when changing column
    }
  };

  // Derived metrics
  const {
    totalTenders,
    totalBids,
    pendingApprovals,
    avgBidsPerTender,
    categoryCounts,
    bidDiffSeries,
    recentTenders,
    reminders,
    rating,
    totalTenderValue,
    avgTenderValue,
  } = React.useMemo(() => {
    const totalTenders = dummyTenders.length;
    const totalBids = dummyTenders.reduce((sum, t) => sum + t.bidsReceived, 0);
    const pendingApprovals = dummyTenders.filter(
      (t) => t.status === "Pending"
    ).length;
    const avgBidsPerTender = totalTenders ? totalBids / totalTenders : 0;

    const categoryCountsMap = new Map<string, number>();
    for (const t of dummyTenders) {
      categoryCountsMap.set(
        t.category,
        (categoryCountsMap.get(t.category) ?? 0) + 1
      );
    }
    const categoryCounts = Array.from(categoryCountsMap.entries()).map(
      ([category, count]) => ({
        category,
        tenders: count,
      })
    );

    const bidDiffSeries = dummyTenders.map((t) => ({
      name: t.title.length > 24 ? t.title.slice(0, 22) + "…" : t.title,
      diff: t.bidDiffPct ?? 0,
    }));

    const byPostedDesc = [...dummyTenders].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
    const recentTenders = byPostedDesc.slice(0, 5);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const noBidsIn7Days = dummyTenders.filter(
      (t) =>
        new Date(t.postedAt) <= sevenDaysAgo &&
        t.bidsReceived === 0 &&
        t.status !== "Closed"
    );
    const expiringSoon = dummyTenders.filter(
      (t) => new Date(t.deadline) <= threeDaysAhead && t.status !== "Closed"
    );

    // Dummy rating data (optional feature)
    const rating = {
      average: 4.6,
      totalReviews: 128,
      summary: "Great communication and clear requirements from vendors.",
    };

    const totalTenderValue = dummyTenders.reduce((sum, t) => sum + t.value, 0);
    const avgTenderValue = totalTenders ? totalTenderValue / totalTenders : 0;

    return {
      totalTenders,
      totalBids,
      pendingApprovals,
      avgBidsPerTender,
      categoryCounts,
      bidDiffSeries,
      recentTenders,
      reminders: {
        noBidsIn7Days,
        expiringSoon,
      },
      rating,
      totalTenderValue, // Added
      avgTenderValue, // Added
    };
  }, []);

  const nav = [
    { title: "Dashboard", icon: BarChart3, url: "#", active: true },
    { title: "My Tenders", icon: ListOrdered, url: "#" },
    { title: "Approvals", icon: Layers, url: "#" },
    { title: "Support", icon: CircleHelp, url: "#" },
    { title: "Settings", icon: Settings, url: "#" },
  ];

  // Amount spent chart state and data
  const [selectedAmountTimeRange, setSelectedAmountTimeRange] = React.useState<
    "1day" | "1week" | "1month" | "1year"
  >("1month");

  // Dummy data for amount spent chart
  const amountSpentData = React.useMemo(() => {
    // Generate dummy data based on selectedAmountTimeRange
    if (selectedAmountTimeRange === "1day") {
      // 24 hours
      return Array.from({ length: 24 }, (_, i) => ({
        date: `${i}:00`,
        amountSpent: Math.floor(Math.random() * 2000) + 1000,
      }));
    }
    if (selectedAmountTimeRange === "1week") {
      // 7 days
      return Array.from({ length: 7 }, (_, i) => ({
        date: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
        amountSpent: Math.floor(Math.random() * 10000) + 5000,
      }));
    }
    if (selectedAmountTimeRange === "1month") {
      // 30 days
      return Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        amountSpent: Math.floor(Math.random() * 12000) + 4000,
      }));
    }
    // 12 months
    return Array.from({ length: 12 }, (_, i) => ({
      date: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      amountSpent: Math.floor(Math.random() * 100000) + 50000,
    }));
  }, [selectedAmountTimeRange]);

  const filteredTenders = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let currentTenders = recentTenders;

    // Apply filtering by search query
    if (q) {
      currentTenders = currentTenders.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q)
      );
    }

    // Apply filtering by status
    if (filterStatus !== "All") {
      currentTenders = currentTenders.filter((t) => t.status === filterStatus);
    }

    // Apply sorting
    if (sortColumn) {
      currentTenders = [...currentTenders].sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortColumn === "postedAt" || sortColumn === "deadline") {
          valA = new Date(a[sortColumn]).getTime();
          valB = new Date(b[sortColumn]).getTime();
        } else if (sortColumn === "bidsReceived") {
          valA = a[sortColumn];
          valB = b[sortColumn];
        }

        if (valA < valB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return currentTenders;
  }, [query, recentTenders, sortColumn, sortDirection, filterStatus]);

  return (
    <SidebarProvider>
      {/* Main content */}
      <SidebarInset className="bg-transparent container py-1 px-2 md:py-3 md:px-3 ">
        {/* Page body */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Snapshot cards */}
          <section>
            <div className="grid gap-2 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title={t("total_tenders_posted")}
                value={String(totalTenders)}
                icon={<ListOrdered className="h-5 w-5" />}
                subtle={t("all_time")}
              />
              <StatCard
                title={t("bids_received")}
                value={String(totalBids)}
                icon={<Inbox className="h-5 w-5" />}
                subtle={t("across_all_tenders")}
              />
              <StatCard
                title={t("pending_tender_approvals")}
                value={String(pendingApprovals)}
                icon={<Clock className="h-5 w-5" />}
                subtle={t("awaiting_review")}
              />
              <StatCard
                title={t("average_bid_per_tender")}
                value={avgBidsPerTender.toFixed(1)}
                icon={<Gauge className="h-5 w-5" />}
                subtle={t("avg_number_of_bids")}
              />
              <StatCard
                title={t("total_tender_value")}
                value={`$${totalTenderValue.toLocaleString()}`}
                icon={<BookOpen className="h-5 w-5" />}
                subtle={t("across_all_tenders")}
              />
            </div>
          </section>
          {/* Charts and lists */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Left (main) column */}
            <ProjectsOverviewChart />
            {/* Right (aside) column */}
            <div className="md:col-span-5 col-span-1 flex flex-col gap-4 md:gap-4">
              {/* User Rating */}
              <Card className="w-full p-6">
                <CardContent className="p-0 space-y-6">
                  {/* Total Projects Section */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("total_projects_posted")}
                    </p>
                    <h2 className="text-4xl font-bold mt-1">128</h2>
                  </div>
                  {/* Recently Active Posters Section */}
                  <div>
                    <div className="flex -space-x-2 overflow-hidden">
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/08.png"
                          alt="User 1"
                        />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/04.png"
                          alt="User 2"
                        />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/05.png"
                          alt="User 3"
                        />
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/06.png"
                          alt="User 4"
                        />
                        <AvatarFallback>U4</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/07.png"
                          alt="User 5"
                        />
                        <AvatarFallback>U5</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  {/* Highlights Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">
                      {t("highlights")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {t("avg_bids_per_project")}
                        </span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">6.1</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {t("projects_with_no_bids")}
                        </span>
                        <div className="flex items-center gap-1 text-red-500">
                          <ArrowDownLeft className="w-4 h-4" />
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {t("total_bids_received")}
                        </span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">342</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-1 col-span-full lg:col-span-3 h-fit shadow-none border-neutral-200 rounded-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    {t("tenders_with_no_bids_in_7_days")}
                  </CardTitle>
                  <CardDescription>
                    {t("consider_updating_details")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reminders.noBidsIn7Days.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("no_items_to_show")}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {reminders.noBidsIn7Days.map((tender) => (
                        <li
                          key={tender.id}
                          className="flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {tender.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("posted")} {formatDate(tender.postedAt)} •{" "}
                              {tender.category}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {tender.bidsReceived} {t("bids")}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="grid grid-cols-12 w-full justify-start gap-2 md:gap-5">
            <Card className="border-1 shadow-none col-span-full border-neutral-200 rounded-md">
              <CardHeader className="pb-3">
                <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {t("recent_tenders")}
                    </CardTitle>
                    <CardDescription>
                      {t("latest_tenders_youve_posted")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{t("view_all")}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search by title, category or status..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9"
                      aria-label="Search tenders"
                    />
                    <LineChartIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <Select
                    value={filterStatus}
                    onValueChange={(value: TenderStatus | "All") =>
                      setFilterStatus(value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">{t("all_statuses")}</SelectItem>
                      <SelectItem value="Active">{t("active")}</SelectItem>
                      <SelectItem value="Pending">{t("pending")}</SelectItem>
                      <SelectItem value="Closed">{t("closed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Responsive Table */}
                <div className="rounded-lg overflow-x-auto hidden md:block">
                  <Table className="px-0 ">
                    <TableHeader className="px-0">
                      <TableRow>
                        <TableHead>{t("title")}</TableHead>
                        <TableHead>{t("category")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                        <TableHead
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => handleSort("postedAt")}
                        >
                          <div className="flex items-center gap-1">
                            {t("posted_at")}
                            {sortColumn === "postedAt" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => handleSort("deadline")}
                        >
                          <div className="flex items-center gap-1">
                            {t("deadline")}
                            {sortColumn === "deadline" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-right cursor-pointer whitespace-nowrap"
                          onClick={() => handleSort("bidsReceived")}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {t("bids_received")}
                            {sortColumn === "bidsReceived" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="px-0 ">
                      {filteredTenders.map((t) => (
                        <TableRow key={t.id} className=" px-0">
                          <TableCell className="font-medium px-0 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{t.title}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {t.category}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={t.status} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(t.postedAt)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(t.deadline)}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {t.bidsReceived}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile Card List */}
                <div className="block md:hidden space-y-3">
                  {filteredTenders.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2">
                      {t("no_tenders_found")}
                    </p>
                  ) : (
                    filteredTenders.map((i) => (
                      <div
                        key={i.id}
                        className=" rounded-lg py-3 flex flex-col gap-2 bg-white "
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{i.title}</span>
                          <StatusBadge status={i.status} />
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{i.category}</span>
                          <span>
                            • {t("Posted")}: {formatDate(i.postedAt)}
                          </span>
                          <span>
                            • {t("Deadline")}: {formatDate(i.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs">
                            {t("Bids")}: {i.bidsReceived}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
{
  /*
  "total_tenders_posted": "total_tenders_posted",
  "pending_approval": "pending_approval",
  "tenders_awaiting_review": "tenders_awaiting_review",
  "active_live_tenders": "active_live_tenders",
  "currently_open_for_bids": "currently_open_for_bids",
  "closedcompleted": "closedcompleted",
  "tenders_finished_or_closed": "tenders_finished_or_closed",
  "bids_analytics": "bids_analytics",
  "tender_analytics": "tender_analytics",
  "total_projects_posted": "total_projects_posted",
  "avg_bids_per_project": "avg_bids_per_project",
  "projects_with_no_bids": "projects_with_no_bids",
  "total_bids_received": "total_bids_received",
  "tenders_with_no_bids_in_7_days": "tenders_with_no_bids_in_7_days",
  "consider_updating_details": "consider_updating_details",
  "average_rating_given_by_freelancers": "average_rating_given_by_freelancers",
  "reviews_from_bidders": "reviews_from_bidders",
  "use_client": "use_client",
  "apartment_renovation_kitchen_bath": "apartment_renovation_kitchen_bath",
  "home_solar_panel_installation": "home_solar_panel_installation",
  "custom_wardrobes_cabinetry": "custom_wardrobes_cabinetry",
  "landscape_design_irrigation": "landscape_design_irrigation",
  "ac_servicing_duct_cleaning": "ac_servicing_duct_cleaning",
  "painting_3bhk_apartment": "painting_3bhk_apartment",
  "office_renovation": "office_renovation",
  "website_development": "website_development",
  "hvac_installation": "hvac_installation",
  "legal_advisory": "legal_advisory",
  "freelancer_a": "freelancer_a",
  "freelancer_b": "freelancer_b",
  "freelancer_c": "freelancer_c",
  "freelancer_d": "freelancer_d",
  "website_redesign_project": "website_redesign_project",
  "hvac_system_upgrade": "hvac_system_upgrade",
  "mobile_app_development": "mobile_app_development",
  "legal_advisory_services": "legal_advisory_services",
  "data_migration_project": "data_migration_project",
  "my_tenders": "my_tenders",
  "user_1": "user_1",
  "user_2": "user_2",
  "user_3": "user_3",
  "user_4": "user_4",
  "user_5": "user_5",
  "total_bids": "total_bids",
  "all_submitted_bids": "all_submitted_bids",
  "active_bids": "active_bids",
  "pending_awarded": "pending_awarded",
  "awarded_bids": "awarded_bids",
  "successfully_awarded": "successfully_awarded",
  "rejected_bids": "rejected_bids",
  "not_successful": "not_successful",
  "closed_bids": "closed_bids",
  "tender_completed": "tender_completed",
  "all_categories": "all_categories",
  "tender_title": "tender_title",
  "your_bid": "your_bid",
  "your_bid_details": "your_bid_details",
  "tender_overview": "tender_overview",
  "rejection_reason": "rejection_reason",
  "view_original_tender": "view_original_tender",
  "web_development": "web_development",
  "doha_qatar": "doha_qatar",
  "mobile_development": "mobile_development",
  "innovate_apps_llc": "innovate_apps_llc",
  "seo_optimization_service": "seo_optimization_service",
  "digital_marketing": "digital_marketing",
  "marketing_pros": "marketing_pros",
  "graphic_design_for_branding": "graphic_design_for_branding",
  "graphic_design": "graphic_design",
  "creative_solutions": "creative_solutions",
  "it_network_setup": "it_network_setup",
  "it_services": "it_services",
  "al_khor_qatar": "al_khor_qatar",
  "enterprise_systems": "enterprise_systems",
  "content_writing_for_blog": "content_writing_for_blog",
  "content_creation": "content_creation",
  "bloggers_united": "bloggers_united",
  "edit_bid": "edit_bid",
  "delete_bid": "delete_bid",
  "reapplication_submitted": "reapplication_submitted",
  "select_category": "select_category",
  "search_bids_by_title_client_or_category": "search_bids_by_title_client_or_category",
  "sort_by_newest": "sort_by_newest",
  "sort_by_oldest": "sort_by_oldest",
  "number_of_bids": "number_of_bids",
  "client_info": "client_info",
  "client_history": "client_history",
  "no_tenders_found": "no_tenders_found",
  "urgent_website_developer_for_new_refund_agency": "urgent_website_developer_for_new_refund_agency",
  "hourly_intermediate": "hourly_intermediate",
  "fixedprice": "fixedprice",
  "web_design": "web_design",
  "webflow_editor_wanted_add_content": "webflow_editor_wanted_add_content",
  "more_than_6_months": "more_than_6_months",
  "ve_got_3_webflow_websites_that_need_content_added_": "ve_got_3_webflow_websites_that_need_content_added_",
  "website_design_using_webflow": "website_design_using_webflow",
  "united_states": "united_states",
  "webflow_figma_designer": "webflow_figma_designer",
  "ve_already_completed_the_strategic_groundwork_we": "ve_already_completed_the_strategic_groundwork_we",
  "uiux_design": "uiux_design",
  "expert_webflow_designer_needed_for_custom_projects": "expert_webflow_designer_needed_for_custom_projects",
  "we_need_a_skilled_shopify_developer_to_urgently_re": "we_need_a_skilled_shopify_developer_to_urgently_re",
  "shopify_development": "shopify_development",
  "figma_web_designer_with_experience_in_creative_min": "figma_web_designer_with_experience_in_creative_min",
  "less_than_1_month": "less_than_1_month",
  "web_developer_and_designer_for_flagship_foundation": "web_developer_and_designer_for_flagship_foundation",
  "south_africa": "south_africa",
  "wix_website": "wix_website",
  "landing_page": "landing_page",
  "visual_communication": "visual_communication",
  "user_flow": "user_flow",
  "brochure_design": "brochure_design",
  "visual_presentation_design": "visual_presentation_design",
  "wix_seo_wiz": "wix_seo_wiz",
  "my_previous_clients": "my_previous_clients",
  "payment_verified": "payment_verified",
  "user_verified": "user_verified",
  "no_hires": "no_hires",
  "less_than_one_month": "less_than_one_month",
  "budgethigh": "budgethigh",
  "budgetlow": "budgetlow",
  "experiencelevel": "experiencelevel",
  "jobtype": "jobtype",
  "numberofbids": "numberofbids",
  "clientinfo": "clientinfo",
  "clienthistory": "clienthistory",
  "clientlocation": "clientlocation",
  "projectlength": "projectlength",
  "select_categories": "select_categories",
  "less_than_100": "less_than_100",
  "100_to_500": "100_to_500",
  "500_1k": "500_1k",
  "1k_5k": "1k_5k",
  "5k": "5k",
  "less_than_5": "less_than_5",
  "5_to_10": "5_to_10",
  "10_to_15": "10_to_15",
  "15_to_20": "15_to_20",
  "20_to_50": "20_to_50",
  "1_to_9_hires": "1_to_9_hires",
  "10_hires": "10_hires",
  "1_to_3_months": "1_to_3_months",
  "3_to_6_months": "3_to_6_months",
  "nextnavigation": "nextnavigation",
  "sarah_johnson": "sarah_johnson",
  "fatima_khan": "fatima_khan",
  "hi_i": "hi_i",
  "emerald_sounds_good_i": "emerald_sounds_good_i",
  "good_morning_i": "good_morning_i",
  "monday_0900_am": "monday_0900_am",
  "yes_please_send_them_over_i": "yes_please_send_them_over_i",
  "monday_0905_am": "monday_0905_am",
  "type_your_message": "type_your_message",
  "great_i_was_thinking_something_modern_and_clean_pe": "great_i_was_thinking_something_modern_and_clean_pe",
  "help_support": "help_support",
  "find_answers_to_common_questions_or_contact_our_su": "find_answers_to_common_questions_or_contact_our_su",
  "frequently_asked_questions": "frequently_asked_questions",
  "contact_support": "contact_support",
  "search_faqs": "search_faqs",
  "send_us_a_message": "send_us_a_message",
  "your_name": "your_name",
  "your_email": "your_email",
  "send_message": "send_message",
  "reach_us_directly": "reach_us_directly",
  "supporttenderhubqa": "supporttenderhubqa",
  "post_tender": "post_tender",
  "how_can_i_track_my_tender": "how_can_i_track_my_tender",
  "john_doe": "john_doe",
  "johndoeexamplecom": "johndoeexamplecom",
  "type_your_message_here": "type_your_message_here",
  "to_post_a_new_tender_go_to": "to_post_a_new_tender_go_to",
  "go_to": "go_to",
  "after_submitting_or_awarding_a_bid_use_the": "after_submitting_or_awarding_a_bid_use_the",
  "yes_go_to": "yes_go_to",
  "no_posting_tenders_is_currently_free_fees_may_appl": "no_posting_tenders_is_currently_free_fees_may_appl",
  "go_to_the_providers_profile_and_click": "go_to_the_providers_profile_and_click",
  "tenderhub_qatar": "tenderhub_qatar",
  "project_posting": "project_posting",
  "my_posted_tenders": "my_posted_tenders",
  "active_projects": "active_projects",
  "browse_tenders": "browse_tenders",
  "my_bids": "my_bids",
  "saved_jobs": "saved_jobs",
  "company_profile": "company_profile",
  "ratings_reviews": "ratings_reviews",
  "bidder_not_found": "bidder_not_found",
  "go_back": "go_back",
  "contact_information": "contact_information",
  "projects_reviews": "projects_reviews",
  "infoqatarconstructioncom": "infoqatarconstructioncom",
  "building_101_al_corniche_st_doha_qatar": "building_101_al_corniche_st_doha_qatar",
  "luxury_villa_project": "luxury_villa_project",
  "ahmed_althani": "ahmed_althani",
  "commercial_tower_renovation": "commercial_tower_renovation",
  "fatima_alkuwari": "fatima_alkuwari",
  "manage_all_your_tender_opportunities": "manage_all_your_tender_opportunities",
  "post_new_tender": "post_new_tender",
  "search_tenders": "search_tenders",
  "total_tenders": "total_tenders",
  "active_tenders": "active_tenders",
  "awarded_tenders": "awarded_tenders",
  "completed_tenders": "completed_tenders",
  "rejected_tenders": "rejected_tenders",
  "edit_tender": "edit_tender",
  "close_tender": "close_tender",
  "post_your_first_tender": "post_your_first_tender",
  "office_building_construction_project": "office_building_construction_project",
  "west_bay_doha": "west_bay_doha",
  "hvac_system_installation": "hvac_system_installation",
  "al_rayyan_qatar": "al_rayyan_qatar",
  "digital_marketing_campaign": "digital_marketing_campaign",
  "catering_services_contract": "catering_services_contract",
  "food_beverage": "food_beverage",
  "al_sadd_doha": "al_sadd_doha",
  "interior_design_and_fitout": "interior_design_and_fitout",
  "interior_design": "interior_design",
  "the_pearl_doha": "the_pearl_doha",
  "event_management_annual_conference": "event_management_annual_conference",
  "office_furniture_supply": "office_furniture_supply",
  "translation_services": "translation_services",
  "language_services": "language_services",
  "service_category_not_currently_supported_on_the_pl": "service_category_not_currently_supported_on_the_pl",
  "it_infrastructure_upgrade": "it_infrastructure_upgrade",
  "corporate_training_program_development": "corporate_training_program_development",
  "training_development": "training_development",
  "multiple_locations_qatar": "multiple_locations_qatar",
  "not_posted_yet": "not_posted_yet",
  "you_haven": "you_haven",
  "confirm_delete": "confirm_delete",
  "confirm_close_tender": "confirm_close_tender",
  "confirm_action": "confirm_action",
  "search_tenders_by_title_description_or_category": "search_tenders_by_title_description_or_category",
  "stay_updated_on_all_your_activities_and_alerts": "stay_updated_on_all_your_activities_and_alerts",
  "mark_as_read": "mark_as_read",
  "mark_as_unread": "mark_as_unread",
  "no_notifications": "no_notifications",
  "new_bid_received": "new_bid_received",
  "office_renovation_project": "office_renovation_project",
  "tender_approved": "tender_approved",
  "website_redesign": "website_redesign",
  "bid_accepted": "bid_accepted",
  "tender_deadline_approaching": "tender_deadline_approaching",
  "marketing_campaign": "marketing_campaign",
  "search_notifications": "search_notifications",
  "recent_bids_youaposve_placed": "recent_bids_youaposve_placed",
  "view_all_bids": "view_all_bids",
  "submission_date": "submission_date",
  "posting_performance": "posting_performance",
  "bidding_success_rate": "bidding_success_rate",
  "software_development_contract": "software_development_contract",
  "marketing_campaign_for_new_product": "marketing_campaign_for_new_product",
  "it_support_services": "it_support_services",
  "event_management_for_annual_gala": "event_management_for_annual_gala",
  "bids_placed": "bids_placed",
  "bids_won": "bids_won",
  "verification_pending": "verification_pending",
  "edit_profile": "edit_profile",
  "save_changes": "save_changes",
  "profile_completion": "profile_completion",
  "complete_profile": "complete_profile",
  "company_details": "company_details",
  "commercial_registration": "commercial_registration",
  "company_name": "company_name",
  "contact_person_name": "contact_person_name",
  "personal_email": "personal_email",
  "company_email": "company_email",
  "company_phone": "company_phone",
  "company_description": "company_description",
  "commercial_registration_verification": "commercial_registration_verification",
  "commercial_registration_number": "commercial_registration_number",
  "drag_and_drop_your_file_here_or_click_to_browse": "drag_and_drop_your_file_here_or_click_to_browse",
  "choose_file": "choose_file",
  "pdf_jpg_png_up_to_10mb": "pdf_jpg_png_up_to_10mb",
  "confirm_profile_completion": "confirm_profile_completion",
  "jane_doe": "jane_doe",
  "janedoeexamplecom": "janedoeexamplecom",
  "omar545hotmailcom": "omar545hotmailcom",
  "company_logo": "company_logo",
  "accountverification": "accountverification",
  "track_and_manage_your_ongoing_and_completed_projec": "track_and_manage_your_ongoing_and_completed_projec",
  "search_projects": "search_projects",
  "owned_projects": "owned_projects",
  "awarded_to_me": "awarded_to_me",
  "educational_facilities_upgrade": "educational_facilities_upgrade",
  "national_green_spaces_program": "national_green_spaces_program",
  "in_progress": "in_progress",
  "doha_elite_construction": "doha_elite_construction",
  "no_reviews_found": "no_reviews_found",
  "reviews_received": "reviews_received",
  "reviews_given_by_me": "reviews_given_by_me",
  "all_ratings": "all_ratings",
  "ahmed_almansouri": "ahmed_almansouri",
  "qatar_national_museum_renovation": "qatar_national_museum_renovation",
  "paid_quickly": "paid_quickly",
  "fatima_althani": "fatima_althani",
  "doha_metro_station_upgrades": "doha_metro_station_upgrades",
  "detailoriented": "detailoriented",
  "mohammad_alkuwari": "mohammad_alkuwari",
  "lusail_city_commercial_complex": "lusail_city_commercial_complex",
  "ontime": "ontime",
  "clear_requirements": "clear_requirements",
  "sarah_aldosari": "sarah_aldosari",
  "education_city_library_extension": "education_city_library_extension",
  "khalid_alattiyah": "khalid_alattiyah",
  "west_bay_office_tower": "west_bay_office_tower",
  "resolves_issues": "resolves_issues",
  "noor_alsulaiti": "noor_alsulaiti",
  "hamad_international_airport_terminal": "hamad_international_airport_terminal",
  "omar_alrashid": "omar_alrashid",
  "smart_city_infrastructure": "smart_city_infrastructure",
  "quality_work": "quality_work",
  "layla_alzahra": "layla_alzahra",
  "residential_complex_development": "residential_complex_development",
  "budgetfriendly": "budgetfriendly",
  "hassan_almahmoud": "hassan_almahmoud",
  "cultural_center_renovation": "cultural_center_renovation",
  "high_quality": "high_quality",
  "average_rating": "average_rating",
  "out_of_5_stars": "out_of_5_stars",
  "total_reviews": "total_reviews",
  "from_completed_projects": "from_completed_projects",
  "excellent_ratings": "excellent_ratings",
  "top_quality": "top_quality",
  "most_mentioned_attribute": "most_mentioned_attribute",
  "filter_by_rating": "filter_by_rating",
  "write_your_review": "write_your_review",
  "search_by_contractor_name_project_or_review_conten": "search_by_contractor_name_project_or_review_conten",
  "search_by_project_owner_name_project_or_review_con": "search_by_project_owner_name_project_or_review_con",
  "5star_reviews": "5star_reviews",
  "no_saved_jobs_found": "no_saved_jobs_found",
  "ecommerce_website_redesign": "ecommerce_website_redesign",
  "content_writer_for_tech_blog": "content_writer_for_tech_blog",
  "united_kingdom": "united_kingdom",
  "less_than_30_hrsweek": "less_than_30_hrsweek",
  "content_writing": "content_writing",
  "uiux_design_for_saas_platform": "uiux_design_for_saas_platform",
  "video_editor_for_marketing_campaigns": "video_editor_for_marketing_campaigns",
  "more_than_30_hrsweek": "more_than_30_hrsweek",
  "video_production": "video_production",
  "jobs_per_page": "jobs_per_page",
  "search_saved_jobs": "search_saved_jobs",
  "manage_your_account_and_application_preferences": "manage_your_account_and_application_preferences",
  "wfull_mdw64_flexshrink0_border_bordergray200_shado": "wfull_mdw64_flexshrink0_border_bordergray200_shado",
  "notification_settings": "notification_settings",
  "bid_status_updates": "bid_status_updates",
  "tender_status_updates": "tender_status_updates",
  "new_bids_on_your_tender": "new_bids_on_your_tender",
  "profile_verification_updates": "profile_verification_updates",
  "new_messages": "new_messages",
  "current_password": "current_password",
  "new_password": "new_password",
  "confirm_new_password": "confirm_new_password",
  "appearance_language": "appearance_language",
  "application_language": "application_language",
  "save_all_settings": "save_all_settings",
  "back_to_tenders": "back_to_tenders",
  "questions_answers": "questions_answers",
  "ask_a_question": "ask_a_question",
  "your_question": "your_question",
  "submit_question": "submit_question",
  "tender_application": "tender_application",
  "apply_to_bid": "apply_to_bid",
  "save_tender": "save_tender",
  "develop_a_fullstack_ecommerce_platform": "develop_a_fullstack_ecommerce_platform",
  "client_a": "client_a",
  "client_b": "client_b",
  "client_c": "client_c",
  "type_your_question_here": "type_your_question_here",
  "tender_pending_approval": "tender_pending_approval",
  "award_bid": "award_bid",
  "view_full_profile": "view_full_profile",
  "no_bids_yet": "no_bids_yet",
  "your_answer": "your_answer",
  "no_questions_yet": "no_questions_yet",
  "content_locked": "content_locked",
  "pending_admin_approval": "pending_admin_approval",
  "verified_provider": "verified_provider",
  "sample_work_provided": "sample_work_provided",
  "techcorp_solutions": "techcorp_solutions",
  "project_management": "project_management",
  "building_planspdf": "building_planspdf",
  "material_specificationsdocx": "material_specificationsdocx",
  "website_development_and_design": "website_development_and_design",
  "portfolio_required": "portfolio_required",
  "arabic_language_support": "arabic_language_support",
  "digital_innovators": "digital_innovators",
  "reactjs": "reactjs",
  "nodejs": "nodejs",
  "security_system_upgrade": "security_system_upgrade",
  "licensed_security_provider": "licensed_security_provider",
  "secure_solutions": "secure_solutions",
  "access_control": "access_control",
  "network_security": "network_security",
  "training_certification": "training_certification",
  "multilocation_capability": "multilocation_capability",
  "global_learning": "global_learning",
  "curriculum_design": "curriculum_design",
  "corporate_training": "corporate_training",
  "leadership_development": "leadership_development",
  "training_outlinepdf": "training_outlinepdf",
  "alrayyan_builders": "alrayyan_builders",
  "qatar_digital_solutions": "qatar_digital_solutions",
  "doha_web_studio": "doha_web_studio",
  "secureguard_qatar": "secureguard_qatar",
  "alameen_security": "alameen_security",
  "qatar_learning_solutions": "qatar_learning_solutions",
  "gulf_training_institute": "gulf_training_institute",
  "doha_corporate_academy": "doha_corporate_academy",
  "excellence_training_center": "excellence_training_center",
  "yes_the_training_must_cover_qatar_labor_law_compli": "yes_the_training_must_cover_qatar_labor_law_compli",
  "ahmed_almahmoud": "ahmed_almahmoud",
  "type_your_answer": "type_your_answer",
  "recent_tenders": "recent_tenders",
  "latest_tenders_youve_posted": "latest_tenders_youve_posted",
  "view_all": "view_all",
  "all_statuses": "all_statuses",
  "all_time": "all_time",
  "bids_received": "bids_received",
  "across_all_tenders": "across_all_tenders",
  "pending_tender_approvals": "pending_tender_approvals",
  "awaiting_review": "awaiting_review",
  "average_bid_per_tender": "average_bid_per_tender",
  "avg_number_of_bids": "avg_number_of_bids",
  "total_tender_value": "total_tender_value",
  "filter_by_status": "filter_by_status",
  "search_by_title_category_or_status": "search_by_title_category_or_status",
  "welcome_back_ahmed": "welcome_back_ahmed",
  "tenders_overview": "tenders_overview",
  "last_30_days": "last_30_days",
  "currently_open": "currently_open",
  "total_spent": "total_spent",
  "this_month": "this_month",
  "senior_product_designer": "senior_product_designer",
  "profile_details": "profile_details",
  "account_verification": "account_verification",
  "full_name": "full_name",
  "national_id": "national_id",
  "log_in_to_your_account": "log_in_to_your_account",
  "enter_your_credentials_to_access_your_dashboard": "enter_your_credentials_to_access_your_dashboard",
  "qatar_tender_platform": "qatar_tender_platform",
  "sign_up": "sign_up",
  "a_perfectly_synced": "a_perfectly_synced",
  "start_free_trial": "start_free_trial",
  "book_a_demo": "book_a_demo",
  "explore_the_powerful_features": "explore_the_powerful_features",
  "of_qatar_tender_platform_easily": "of_qatar_tender_platform_easily",
  "alrashid_construction": "alrashid_construction",
  "tender_performance": "tender_performance",
  "tender_dashboard": "tender_dashboard",
  "tender_won": "tender_won",
  "you_have_successfully_won_the_tender": "you_have_successfully_won_the_tender",
  "contract_value": "contract_value",
  "qar_27m": "qar_27m",
  "success_tracking": "success_tracking",
  "deadline_reminders": "deadline_reminders",
  "document_autoclassification": "document_autoclassification",
  "process_automation": "process_automation",
  "total_tender_value_pipeline": "total_tender_value_pipeline",
  "qar_12m": "qar_12m",
  "pipeline_analytics": "pipeline_analytics",
  "designed_for_growth": "designed_for_growth",
  "ceo_almansouri_construction": "ceo_almansouri_construction",
  "guide_on_how_qatar_tender_platform_works": "guide_on_how_qatar_tender_platform_works",
  "for_your_startup": "for_your_startup",
  "total_clients": "total_clients",
  "hear_what_our_users_say": "hear_what_our_users_say",
  "about_qatar_tender_platform": "about_qatar_tender_platform",
  "everything_you_need_to_know": "everything_you_need_to_know",
  "start_using_qatar_tender_platform_today": "start_using_qatar_tender_platform_today",
  "get_started": "get_started",
  "view_demo": "view_demo",
  "quick_links": "quick_links",
  "about_us": "about_us",
  "contact_info": "contact_info",
  "infoqatartendercom": "infoqatartendercom",
  "how_it_works": "how_it_works",
  "tenderhub_dashboard_complete_tender_management_int": "tenderhub_dashboard_complete_tender_management_int",
  "document_management": "document_management",
  "realtime_notifications": "realtime_notifications",
  "bid_collaboration": "bid_collaboration",
  "compliance_tracking": "compliance_tracking",
  "ensure_all_submissions_meet_qatar": "ensure_all_submissions_meet_qatar",
  "vendor_management": "vendor_management",
  "modern_qatar_office_workspace": "modern_qatar_office_workspace",
  "register_setup": "register_setup",
  "find_opportunities": "find_opportunities",
  "submit_track": "submit_track",
  "howitworks": "howitworks",
  "professional_working_with_analytics_dashboard": "professional_working_with_analytics_dashboard",
  "almansouri_construction": "almansouri_construction",
  "qatar_tender_platform_has_transformed_our_tenderin": "qatar_tender_platform_has_transformed_our_tenderin",
  "fatima_alzahra": "fatima_alzahra",
  "zahra_engineering_solutions": "zahra_engineering_solutions",
  "mohammed_althani": "mohammed_althani",
  "thani_group": "thani_group",
  "procurement_director": "procurement_director",
  "sarah_alkuwari": "sarah_alkuwari",
  "alkuwari_ventures": "alkuwari_ventures",
  "project_manager": "project_manager",
  "rashid_technologies": "rashid_technologies",
  "the_platform": "the_platform",
  "layla_almahmoud": "layla_almahmoud",
  "mahmoud_consulting": "mahmoud_consulting",
  "managing_partner": "managing_partner",
  "qatar_companies": "qatar_companies",
  "success_rate": "success_rate",
  "time_saved": "time_saved",
  "local_support": "local_support",
  "the_platform_is_intuitive_and_comprehensive_it_has": "the_platform_is_intuitive_and_comprehensive_it_has",
  "as_a_growing_company_having_organized_tender_manag": "as_a_growing_company_having_organized_tender_manag",
  "the_automated_notifications_and_deadline_tracking_": "the_automated_notifications_and_deadline_tracking_",
  "excellent_support_team_and_powerful_analytics_qata": "excellent_support_team_and_powerful_analytics_qata",
  "account_type": "account_type",
  "email_verification": "email_verification",
  "nationalidpdf": "nationalidpdf",
  "crdocumentpdf": "crdocumentpdf",
  "no_active_projects": "no_active_projects",
  "post_a_new_tender": "post_a_new_tender",
  "browse_opportunities": "browse_opportunities",
  "open_chat": "open_chat",
  "cover_letter": "cover_letter",
  "proceed_to_payment": "proceed_to_payment",
  "step_1_of_2_submit_your_bid_details": "step_1_of_2_submit_your_bid_details",
  "step_2_of_2_payment_for_bid_placement": "step_2_of_2_payment_for_bid_placement",
  "bidamount": "bidamount",
  "coverletter": "coverletter",
  "tell_us_why_you": "tell_us_why_you",
  "bidimage": "bidimage",
  "pay_100_qar_and_submit_bid": "pay_100_qar_and_submit_bid",
  "total_bids_submitted": "total_bids_submitted",
  "pending_bids": "pending_bids",
  "bids_awaiting_response": "bids_awaiting_response",
  "awarded_projects": "awarded_projects",
  "win_ratio": "win_ratio",
  "revenue_from_awarded_projects": "revenue_from_awarded_projects",
  "avg_rating_received": "avg_rating_received",
  "ratings_vs_category_peers": "ratings_vs_category_peers",
  "win_rate_vs_category_peers": "win_rate_vs_category_peers",
  "requests_expiring_soon": "requests_expiring_soon",
  "requests_awaiting_response_in_the_next_3_days": "requests_awaiting_response_in_the_next_3_days",
  "average_rating_received_from_clients": "average_rating_received_from_clients",
  "based_on_recent_client_reviews": "based_on_recent_client_reviews",
  "reviews_from_clients": "reviews_from_clients",
  "ac_repair_maintenance": "ac_repair_maintenance",
  "full_home_deep_cleaning": "full_home_deep_cleaning",
  "electrical_troubleshooting": "electrical_troubleshooting",
  "home_painting_single_room": "home_painting_single_room",
  "ali_khan": "ali_khan",
  "sara_ahmed": "sara_ahmed",
  "omar_yousuf": "omar_yousuf",
  "my_services": "my_services",
  "client_1": "client_1",
  "client_2": "client_2",
  "client_3": "client_3",
  "client_4": "client_4",
  "client_5": "client_5",
  "new_tender": "new_tender",
  "sign_out": "sign_out",
  "ahmedexamplecom": "ahmedexamplecom",
  "almahmoud_enterprises": "almahmoud_enterprises",
  "business_dashboard": "business_dashboard",
  "toggle_sidebar": "toggle_sidebar",
  "construction_building": "construction_building",
  "design_creative": "design_creative",
  "information_technology": "information_technology",
  "legal_services": "legal_services",
  "transportation_logistics": "transportation_logistics",
  "business_consulting": "business_consulting",
  "maintenance_repair": "maintenance_repair",
  "marketing_advertising": "marketing_advertising",
  "financial_services": "financial_services",
  "open_project_list": "open_project_list",
  "project_owner": "project_owner",
  "open_project_details": "open_project_details",
  "saudi_arabia": "saudi_arabia",
  "create_new_tender": "create_new_tender",
  "estimated_time": "estimated_time",
  "eg_construction_of_new_office_building": "eg_construction_of_new_office_building",
  "select_a_category": "select_a_category",
  "itservices": "itservices",
  "eg_6_months_34_weeks": "eg_6_months_34_weeks",
  "eg_doha_qatar": "eg_doha_qatar",
  "contact_email": "contact_email",
  "contactexamplecom": "contactexamplecom",
  "detailed_tender_requirements_and_scope": "detailed_tender_requirements_and_scope",
  "eg_500000": "eg_500000",
  "office_renovation_in_lusail": "office_renovation_in_lusail",
  "lusail_qatar": "lusail_qatar",
  "adminqatarsolutionsqa": "adminqatarsolutionsqa",
  "personal_information": "personal_information",
  "first_name": "first_name",
  "last_name": "last_name",
  "job_title": "job_title",
  "account_settings": "account_settings",
  "account_status": "account_status",
  "your_account_is_currently_active": "your_account_is_currently_active",
  "subscription_plan": "subscription_plan",
  "pro_plan_29month": "pro_plan_29month",
  "manage_subscription": "manage_subscription",
  "account_visibility": "account_visibility",
  "make_your_profile_visible_to_other_users": "make_your_profile_visible_to_other_users",
  "data_export": "data_export",
  "download_a_copy_of_your_data": "download_a_copy_of_your_data",
  "export_data": "export_data",
  "danger_zone": "danger_zone",
  "irreversible_and_destructive_actions": "irreversible_and_destructive_actions",
  "delete_account": "delete_account",
  "permanently_delete_your_account_and_all_data": "permanently_delete_your_account_and_all_data",
  "security_settings": "security_settings",
  "last_changed_3_months_ago": "last_changed_3_months_ago",
  "change_password": "change_password",
  "twofactor_authentication": "twofactor_authentication",
  "add_an_extra_layer_of_security_to_your_account": "add_an_extra_layer_of_security_to_your_account",
  "login_notifications": "login_notifications",
  "get_notified_when_someone_logs_into_your_account": "get_notified_when_someone_logs_into_your_account",
  "active_sessions": "active_sessions",
  "manage_devices_that_are_logged_into_your_account": "manage_devices_that_are_logged_into_your_account",
  "view_sessions": "view_sessions",
  "notification_preferences": "notification_preferences",
  "email_notifications": "email_notifications",
  "receive_notifications_via_email": "receive_notifications_via_email",
  "push_notifications": "push_notifications",
  "receive_push_notifications_in_your_browser": "receive_push_notifications_in_your_browser",
  "marketing_emails": "marketing_emails",
  "receive_emails_about_new_features_and_updates": "receive_emails_about_new_features_and_updates",
  "weekly_summary": "weekly_summary",
  "get_a_weekly_summary_of_your_activity": "get_a_weekly_summary_of_your_activity",
  "security_alerts": "security_alerts",
  "san_francisco_ca": "san_francisco_ca",
  "tell_us_about_yourself": "tell_us_about_yourself",
  "pro_member": "pro_member",
  "user_menu": "user_menu",
  "tender_activity_overview": "tender_activity_overview",
  "showing_tenders_posted_and_bids_received_for_the_s": "showing_tenders_posted_and_bids_received_for_the_s",
  "last_3_months": "last_3_months",
  "last_7_days": "last_7_days",
  "tenders_posted": "tenders_posted",
  "select_a_value": "select_a_value",
  "switch_language": "switch_language",
  "testexamplecom": "testexamplecom",
  "youexamplecom": "youexamplecom",
  "project_details": "project_details",
  "start_date": "start_date",
  "awarded_to": "awarded_to",
  "submit_review": "submit_review",
  "edit_review": "edit_review",
  "mark_as_completed": "mark_as_completed",
  "write_your_feedback": "write_your_feedback",
  "retail_store_interior_fitout": "retail_store_interior_fitout",
  "commercial_electrical_wiring": "commercial_electrical_wiring",
  "smart_home_automation_setup": "smart_home_automation_setup",
  "swimming_pool_construction": "swimming_pool_construction",
  "office_furniture_procurement": "office_furniture_procurement",
  "cctv_security_system_installation": "cctv_security_system_installation",
  "roof_waterproofing_repair": "roof_waterproofing_repair",
  "event_hall_soundproofing": "event_hall_soundproofing",
  "server_room_cooling_installation": "server_room_cooling_installation",
  "marble_flooring_for_villa": "marble_flooring_for_villa",
  "warehouse_metal_roofing": "warehouse_metal_roofing",
  "driveway_paving_curbing": "driveway_paving_curbing",
  "total_for_the_last_30_days": "total_for_the_last_30_days",
  "total_for_the_last_3_months": "total_for_the_last_3_months",
  "catering_services": "catering_services",
  "rate_project_completion": "rate_project_completion",
  "write_your_review_here": "write_your_review_here",
  "service_providers_overview": "service_providers_overview",
  "revenue_and_jobs_completed_over_the_last_5_days": "revenue_and_jobs_completed_over_the_last_5_days",
  "jobs_completed": "jobs_completed",
  "edit_details": "edit_details",
  "choose_the_type_of_account": "choose_the_type_of_account",
  "check_your_email": "check_your_email",
  "united_arab_emirates": "united_arab_emirates",
  "check_required_fields": "check_required_fields",
  "validation_failed": "validation_failed",
  "verification_email_sent": "verification_email_sent",
  "layla_althani": "layla_althani",
  "hamad_alkhalifa": "hamad_alkhalifa",
  "noor_alsuwaidi": "noor_alsuwaidi",
  "faisal_almansoori": "faisal_almansoori",
  "maryam_almahmoud": "maryam_almahmoud",
  "gulf_infra_group": "gulf_infra_group",
  "desert_star_trading": "desert_star_trading",
  "pearl_contracting": "pearl_contracting",
  "corniche_holdings": "corniche_holdings",
  "qatartendersqa": "qatartendersqa",
  "qtrmailcom": "qtrmailcom",
  "exampleqa": "exampleqa",
  "demo_data_filled": "demo_data_filled",
  "resent_verification": "resent_verification",
  "namecompanyqa": "namecompanyqa",
  "eg_layla_althani": "eg_layla_althani",
  "youexampleqa": "youexampleqa",
  "phone_number": "phone_number",
  "enter_your_password": "enter_your_password",
  "your_email_address": "your_email_address",
  "resend_in_cooldowns": "resend_in_cooldowns",
  "resend_link": "resend_link",
  "verify_email": "verify_email",
  "eg_doha_build_co": "eg_doha_build_co",
  "est_budget_200_usd": "est_budget_200_usd",
  "view_details": "view_details",
  "open_menu": "open_menu",
  "previous_slide": "previous_slide",
  "next_slide": "next_slide",
  "more_pages": "more_pages",
  "go_to_previous_page": "go_to_previous_page",
  "go_to_next_page": "go_to_next_page",
  "website_redesign_for_ecommerce_store": "website_redesign_for_ecommerce_store",
  "hvac_system_installation_for_new_office_building": "hvac_system_installation_for_new_office_building",
  "alfuttaim_properties": "alfuttaim_properties",
  "foodie_express": "foodie_express",
  "security_system_upgrade_for_residential_complex": "security_system_upgrade_for_residential_complex",
  "qatar_living": "qatar_living",
  "security_services": "security_services",
  "digital_marketing_campaign_for_new_product_launch": "digital_marketing_campaign_for_new_product_launch",
  "innovate_q": "innovate_q",
  "interior_design_for_luxury_villa": "interior_design_for_luxury_villa",
  "private_client": "private_client",
  "the_pearl_qatar": "the_pearl_qatar",
  "event_management_for_corporate_gala": "event_management_for_corporate_gala",
  "qatar_business_forum": "qatar_business_forum",
  "event_management": "event_management",
  "creative_coders": "creative_coders",
  "app_innovators": "app_innovators",
  "digital_growth_agency": "digital_growth_agency",
  "budget_exceeded_client": "budget_exceeded_client",
  "design_code_studio": "design_code_studio",
  "mobile_solutions_llc": "mobile_solutions_llc",
  "new_user_a": "new_user_a",
  "driving_license": "driving_license",
  "unable_to_post_new_tender": "unable_to_post_new_tender",
  "inappropriate_bid_received": "inappropriate_bid_received",
  "account_verification_issue": "account_verification_issue",
  "my_kyc_documents_were_rejected_but_i": "my_kyc_documents_were_rejected_but_i",
  "general_inquiry_about_bid_fees": "general_inquiry_about_bid_fees",
  "active": "Active",
  "pending": "Pending",
  "closed": "Closed",
  "highlights": "Highlights",
  "bronze": "Bronze",
  "gold": "Gold",
  "platinum": "Platinum",
  "construction": "Construction",
  "energy": "Energy",
  "carpentry": "Carpentry",
  "landscaping": "Landscaping",
  "painting": "Painting",
  "verified": "Verified",
  "completed": "Completed",
  "dashboard": "Dashboard",
  "approvals": "Approvals",
  "support": "Support",
  "settings": "Settings",
  "awarded": "Awarded",
  "rejected": "Rejected",
  "category": "Category",
  "submitted": "Submitted",
  "status": "Status",
  "actions": "Actions",
  "view": "View",
  "edit": "Edit",
  "delete": "Delete",
  "reapply": "Reapply",
  "close": "Close",
  "withdrawn": "Withdrawn",
  "remote": "Remote",
  "unknown": "Unknown",
  "poland": "Poland",
  "hourly": "Hourly",
  "australia": "Australia",
  "ve_got_3_webflow_websites_that_need_content_added": "ve got 3 webflow websites that need content added to Content has been written It just needs to be uploaded Start asap",
  "webflow": "Webflow",
  "canada": "Canada",
  "framer": "Framer",
  "wordpress": "WordPress",
  "shopify": "Shopify",
  "animation": "Animation",
  "mockup": "Mockup",
  "nonprofit": "Nonprofit",
  "fundraising": "Fundraising",
  "enter": "Enter",
  "message": "Message",
  "chats": "Chats",
  "cancel": "Cancel",
  "report": "Report",
  "tenderhub": "TenderHub",
  "overview": "Overview",
  "analytics": "Analytics",
  "bidding": "Bidding",
  "system": "System",
  "about": "About",
  "title": "Title",
  "description": "Description",
  "maintenance": "Maintenance",
  "legal": "Legal",
  "marketing": "Marketing",
  "events": "Events",
  "furniture": "Furniture",
  "draft": "Draft",
  "confirm": "Confirm",
  "notifications": "Notifications",
  "tender": "Tender",
  "payment": "Payment",
  "amount": "Amount",
  "country": "Country",
  "inbox": "Inbox",
  "unread": "Unread",
  "project": "Project",
  "save": "Save",
  "responsive": "Responsive",
  "professional": "Professional",
  "organized": "Organized",
  "fair": "Fair",
  "visionary": "Visionary",
  "supportive": "Supportive",
  "skilled": "Skilled",
  "reliable": "Reliable",
  "innovative": "Innovative",
  "germany": "Germany",
  "security": "Security",
  "english": "English",
  "theme": "Theme",
  "inter": "Inter",
  "developerx": "DeveloperX",
  "designpro": "DesignPro",
  "codemaster": "CodeMaster",
  "reject": "Reject",
  "reply": "Reply",
  "architecture": "Architecture",
  "email": "Email",
  "mobile": "Mobile",
  "address": "Address",
  "login": "Login",
  "features": "Features",
  "engineering": "Engineering",
  "consulting": "Consulting",
  "testimonial": "Testimonial",
  "faqs": "FAQs",
  "home": "Home",
  "contact": "Contact",
  "founder": "Founder",
  "the_automated_notifications_and_deadline_tracking": "The automated notifications and deadline tracking have been game-changers. We never miss opportunities anymore.",
  "details": "Details",
  "back": "Back",
  "authguard_role_mismatch_for_poster_redirecting_to": "AuthGuard: Role mismatch for poster, redirecting to /unauthorized",
  "accepted": "Accepted",
  "silver": "Silver",
  "cleaning": "Cleaning",
  "electrician": "Electrician",
  "requests": "Requests",
  "profile": "Profile",
  "help": "Help",
  "other": "Other",
  "sarah": "Sarah",
  "contractor": "Contractor",
  "qatar": "Qatar",
  "kuwait": "Kuwait",
  "bahrain": "Bahrain",
  "oman": "Oman",
  "supplies": "Supplies",
  "logistics": "Logistics",
  "deadline": "Deadline",
  "location": "Location",
  "personal": "Personal",
  "account": "Account",
  "phone": "Phone",
  "company": "Company",
  "password": "Password",
  "enabled": "Enabled",
  "configure": "Configure",
  "john": "John",
  "process": "Process",
  "pricing": "Pricing",
  "promise": "Promise",
  "success": "Success",
  "error": "Error",
  "platform": "Platform",
  "yesterday": "Yesterday",
  "tenders": "Tenders",
  "budget": "Budget",
  "rating": "Rating",
  "review": "Review",
  "submit": "Submit",
  "electrical": "Electrical",
  "technology": "Technology",
  "outdoor": "Outdoor",
  "procurement": "Procurement",
  "acoustics": "Acoustics",
  "flooring": "Flooring",
  "hospitality": "Hospitality",
  "revenue": "Revenue",
  "continue": "Continue",
  "business": "BUsiness",
  "india": "India",
  "individual": "Individual",
  "code": "Code",
  "urgent": "Urgent",
  "open": "Open",
  "accordionitem": "AccordionItem",
  "alertdialogheader": "AlertDialogHeader",
  "alertdialogfooter": "AlertDialogFooter",
  "alert": "Alert",
  "alerttitle": "AlertTitle",
  "alertdescription": "AlertDescription",
  "more": "More",
  "breadcrumb": "Breadcrumb",
  "breadcrumblist": "BreadcrumbList",
  "breadcrumbitem": "BreadcrumbItem",
  "breadcrumblink": "BreadcrumbLink",
  "breadcrumbpage": "BreadcrumbPage",
  "breadcrumbseparator": "BreadcrumbSeparator",
  "breadcrumbelipssis": "BreadcrumbElipssis",
  "button": "Button",
  "card": "Card",
  "arrowleft": "ArrowLeft",
  "arrowright": "ArrowRight",
  "carousel": "Carousel",
  "carouselcontent": "CarouselContent",
  "carouselitem": "CarouselItem",
  "carouselprevious": "CarouselPrevious",
  "carouselnext": "CarouselNext",
  "chart": "Chart",
  "charttooltip": "ChartTooltip",
  "chartlegend": "ChartLegend",
  "commandshortcut": "CommandShortcut",
  "contextmenushortcut": "ContextMenuShortcut",
  "dialogheader": "DialogHeader",
  "dialogfooter": "DialogFooter",
  "drawer": "Drawer",
  "drawercontent": "DrawerContent",
  "drawerheader": "DrawerHeader",
  "drawerfooter": "DrawerFooter",
  "dropdownmenushortcut": "DropdownMenuShortcut",
  "formitem": "FormItem",
  "formlabel": "FormLabel",
  "formcontrol": "FormControl",
  "formdescription": "FormDescription",
  "formmessage": "FormMessage",
  "inputotpgroup": "InputOTPGroup",
  "inputotpslot": "InputOTPSlot",
  "inputotpseparator": "InputOTPSeparator",
  "input": "Input",
  "menubarshortcut": "MenubarShortcut",
  "previous": "Previous",
  "next": "Next",
  "pagination": "Pagination",
  "paginationcontent": "PaginationContent",
  "paginationitem": "PaginationItem",
  "paginationlink": "PaginationLink",
  "paginationprevious": "PaginationPrevious",
  "paginationnext": "PaginationNext",
  "paginationellipsis": "PaginationEllipsis",
  "sheetheader": "SheetHeader",
  "sheetfooter": "SheetFooter",
  "sidebarprovider": "SidebarProvider",
  "sidebar": "Sidebar",
  "sidebartrigger": "SidebarTrigger",
  "sidebarrail": "SidebarRail",
  "sidebarinset": "SidebarInset",
  "sidebarinput": "SidebarInput",
  "sidebarheader": "SidebarHeader",
  "sidebarfooter": "SidebarFooter",
  "sidebarseparator": "SidebarSeparator",
  "sidebarcontent": "SidebarContent",
  "sidebargroup": "SidebarGroup",
  "sidebargrouplabel": "SidebarGroupLabel",
  "sidebargroupaction": "SidebarGroupAction",
  "sidebargroupcontent": "SidebarGroupContent",
  "sidebarmenu": "SidebarMenu",
  "sidebarmenuitem": "SidebarMenuItem",
  "sidebarmenubutton": "SidebarMenuButton",
  "sidebarmenuaction": "SidebarMenuAction",
  "sidebarmenubadge": "SidebarMenuBadge",
  "sidebarmenuskeleton": "SidebarMenuSkeleton",
  "sidebarmenusub": "SidebarMenuSub",
  "sidebarmenusubitem": "SidebarMenuSubItem",
  "sidebarmenusubbutton": "SidebarMenuSubButton",
  "table": "Table",
  "tableheader": "TableHeader",
  "tablebody": "TableBody",
  "tablefooter": "TableFooter",
  "tablerow": "TableRow",
  "tablehead": "TableHead",
  "tablecell": "TableCell",
  "tablecaption": "TableCaption",
  "textarea": "Textarea",
  "flagged": "Flagged",
  "passport": "Passport",
  "posted": "تم النشر"
*/
}
