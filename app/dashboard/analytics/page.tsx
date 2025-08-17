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

const dummyTenders: Tender[] = [
  {
    id: "TND-001",
    title: "Apartment Renovation - Kitchen & Bath",
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
    title: "Home Solar Panel Installation",
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
    title: "Custom Wardrobes & Cabinetry",
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
    title: "Landscape Design & Irrigation",
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
    title: "AC Servicing & Duct Cleaning",
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
    title: "Painting: 3BHK Apartment",
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-QA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: TenderStatus }) {
  if (status === "Active")
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Active</Badge>
    );
  if (status === "Pending") return <Badge variant="secondary">Pending</Badge>;
  return <Badge variant="outline">Closed</Badge>;
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
  const [query, setQuery] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<SortColumn>(null);
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  const [filterStatus, setFilterStatus] = React.useState<TenderStatus | "All">(
    "All"
  );

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
                title="Total Tenders Posted"
                value={String(totalTenders)}
                icon={<ListOrdered className="h-5 w-5" />}
                subtle="All time"
              />
              <StatCard
                title="Bids Received"
                value={String(totalBids)}
                icon={<Inbox className="h-5 w-5" />}
                subtle="Across all tenders"
              />
              <StatCard
                title="Pending Tender Approvals"
                value={String(pendingApprovals)}
                icon={<Clock className="h-5 w-5" />}
                subtle="Awaiting review"
              />
              <StatCard
                title="Average Bid per Tender"
                value={avgBidsPerTender.toFixed(1)}
                icon={<Gauge className="h-5 w-5" />}
                subtle="Avg number of bids"
              />
              <StatCard
                title="Total Tender Value"
                value={`$${totalTenderValue.toLocaleString()}`}
                icon={<BookOpen className="h-5 w-5" />}
                subtle="Across all tenders"
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
                      Total Projects Posted
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
                    <h3 className="text-base font-semibold">Highlights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg. Bids per Project</span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">6.1</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Projects With No Bids</span>
                        <div className="flex items-center gap-1 text-red-500">
                          <ArrowDownLeft className="w-4 h-4" />
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Bids Received</span>
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
                    Tenders with no bids in 7 days
                  </CardTitle>
                  <CardDescription>Consider updating details</CardDescription>
                </CardHeader>
                <CardContent>
                  {reminders.noBidsIn7Days.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items to show.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {reminders.noBidsIn7Days.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{t.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Posted {formatDate(t.postedAt)} • {t.category}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {t.bidsReceived} bids
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
                    <CardTitle className="text-base">Recent Tenders</CardTitle>
                    <CardDescription>
                      Latest tenders you’ve posted
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>View all</span>
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
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Responsive Table */}
                <div className="rounded-lg overflow-x-auto hidden md:block">
                  <Table className="px-0 ">
                    <TableHeader className="px-0">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => handleSort("postedAt")}
                        >
                          <div className="flex items-center gap-1">
                            Posted At
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
                            Deadline
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
                            Bids Received
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
                      No tenders found.
                    </p>
                  ) : (
                    filteredTenders.map((t) => (
                      <div
                        key={t.id}
                        className=" rounded-lg py-3 flex flex-col gap-2 bg-white "
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{t.title}</span>
                          <StatusBadge status={t.status} />
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{t.category}</span>
                          <span>• Posted: {formatDate(t.postedAt)}</span>
                          <span>• Deadline: {formatDate(t.deadline)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs">
                            Bids: {t.bidsReceived}
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
