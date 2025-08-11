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
  Hourglass,
  CheckSquare,
  XSquare,
  FileText,
  TrendingUp,
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
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Banalytics from "@/components/Banalytics";

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
  const [activeTab, setActiveTab] = React.useState<"bids" | "tender">("bids");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc"); // Default to ascending when changing column
    }
  };
  const analyticsData = {
    totalTendersPosted: 25,
    pendingApprovalTenders: 3,
    activeLiveTenders: 8,
    closedCompletedTenders: 14,
    avgBidsPerTender: 4.8,
    completedProjects: 15,
    onTimeCompletionRate: 92,
    totalAwardedValue: "950,000 QAR",
    totalSpendOnPlatform: "800,000 QAR",
    averageRatingGivenByFreelancers: 4.7,
    idVerificationStatus: "Verified",
    recentActivity: [
      {
        type: "tender",
        message: "New tender 'Office Renovation' posted",
        time: "2 hours ago",
      },
      {
        type: "bid",
        message: "New bid on 'Website Development'",
        time: "5 hours ago",
      },
      {
        type: "project",
        message: "'HVAC Installation' project completed",
        time: "1 day ago",
      },
      {
        type: "tender",
        message: "Tender 'Legal Advisory' closed",
        time: "3 days ago",
      },
    ],
    jobPostingHistory: [
      { month: "Jan", tenders: 5 },
      { month: "Feb", tenders: 7 },
      { month: "Mar", tenders: 6 },
      { month: "Apr", tenders: 9 },
      { month: "May", tenders: 8 },
      { month: "Jun", tenders: 10 },
      { month: "Jul", tenders: 12 },
    ],
    reviewsFromBidders: [
      {
        id: 1,
        bidderName: "Freelancer A",
        bidderAvatar: "/placeholder-user.jpg",
        rating: 5,
        comment:
          "Excellent communication and clear project requirements. A pleasure to work with!",
        date: "2024-07-10",
      },
      {
        id: 2,
        bidderName: "Freelancer B",
        bidderAvatar: "/placeholder-user.jpg",
        rating: 4,
        comment:
          "Good project, but payment was slightly delayed. Overall positive experience.",
        date: "2024-07-05",
      },
      {
        id: 3,
        bidderName: "Freelancer C",
        bidderAvatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Very professional and responsive. Highly recommend!",
        date: "2024-06-28",
      },
      {
        id: 4,
        bidderName: "Freelancer D",
        bidderAvatar: "/placeholder-user.jpg",
        rating: 3,
        comment:
          "Project scope changed mid-way, which caused some issues. Managed to complete it.",
        date: "2024-06-20",
      },
    ],
    spendHistory: [
      { month: "Jan", spend: 10000 },
      { month: "Feb", spend: 15000 },
      { month: "Mar", spend: 12000 },
      { month: "Apr", spend: 18000 },
      { month: "May", spend: 20000 },
      { month: "Jun", spend: 25000 },
      { month: "Jul", spend: 30000 },
    ],
    projectExpenditure: [
      {
        id: 1,
        name: "Office Renovation Phase 1",
        amount: "150,000 QAR",
        status: "Completed",
      },
      {
        id: 2,
        name: "Website Redesign Project",
        amount: "50,000 QAR",
        status: "Completed",
      },
      {
        id: 3,
        name: "Marketing Campaign Q3",
        amount: "30,000 QAR",
        status: "Active",
      },
      {
        id: 4,
        name: "HVAC System Upgrade",
        amount: "200,000 QAR",
        status: "Completed",
      },
      {
        id: 5,
        name: "Mobile App Development",
        amount: "120,000 QAR",
        status: "Active",
      },
      {
        id: 6,
        name: "Legal Advisory Services",
        amount: "15,000 QAR",
        status: "Completed",
      },
      {
        id: 7,
        name: "Data Migration Project",
        amount: "45,000 QAR",
        status: "Completed",
      },
    ],
    userBadge: {
      currentBadge: "Bronze",
      currentRating: 4.7,
      completedProjects: 15,
      progressToNextBadge: 60, // Percentage to next badge
      badgeRequirements: {
        Bronze: { minRating: 0, minProjects: 0 },
        Silver: { minRating: 3.5, minProjects: 5 },
        Gold: { minRating: 4.0, minProjects: 10 },
        Platinum: { minRating: 4.5, minProjects: 20 },
      },
    },
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
      <Tabs
        value={activeTab}
        className="w-full px-0 container mx-auto"
        onValueChange={(value) => setActiveTab(value as "bids" | "tender")}
      >
        {" "}
        <TabsContent value="tender" className=" px-0">
          {" "}
          <SidebarInset className="bg-transparent  py-1 px-2 md:py-3 md:px-3 ">
            {/* Page body */}
            <div className="flex flex-1 flex-col gap-6 w-full">
              {/* Snapshot cards */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Total Tenders Posted
                        </span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-gray-900">
                        {analyticsData.totalTendersPosted}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        +5 this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Hourglass className="h-4 w-4 mr-2" />
                        Pending Approval
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-gray-900">
                        {analyticsData.pendingApprovalTenders}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tenders awaiting review
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Active (Live) Tenders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-gray-900">
                        {analyticsData.activeLiveTenders}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Currently open for bids
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <XSquare className="h-4 w-4 mr-2" />
                        Closed/Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-gray-900">
                        {analyticsData.closedCompletedTenders}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tenders finished or closed
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>{" "}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bids" className=" text-xs">
                  Bids Analytics
                </TabsTrigger>
                <TabsTrigger value="tender" className=" text-xs">
                  Tender Analytics
                </TabsTrigger>
              </TabsList>
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
                            <span className="text-sm">
                              Avg. Bids per Project
                            </span>
                            <div className="flex items-center gap-1 text-green-500">
                              <ArrowUpRight className="w-4 h-4" />
                              <span className="font-medium">6.1</span>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Projects With No Bids
                            </span>
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
                      <CardDescription>
                        Consider updating details
                      </CardDescription>
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
                                <p className="truncate font-medium">
                                  {t.title}
                                </p>
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Average Rating Given by Freelancers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-4xl font-bold text-gray-900 flex items-center">
                        {analyticsData.averageRatingGivenByFreelancers}
                        <span className="text-xl text-gray-500 ml-2">
                          / 5.0
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Based on {analyticsData.reviewsFromBidders.length}{" "}
                        reviews
                      </p>

                      {/* Badge Tiers */}
                      <div className="mt-6 space-y-3">
                        {/* Bronze - current badge */}
                        <div className="flex justify-between items-center p-3 border border-emerald-600 rounded-lg bg-emerald-50">
                          <div>
                            <p className="text-base font-semibold text-emerald-700">
                              Bronze
                            </p>
                            <p className="text-sm text-emerald-600">
                              2+ projects • 4.5+ rating
                            </p>
                          </div>
                          <span className="px-3 py-1 text-sm font-bold border border-emerald-600 text-emerald-700 rounded-full">
                            Bronze
                          </span>
                        </div>

                        {/* Gold */}
                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-base font-semibold text-gray-800">
                              Gold
                            </p>
                            <p className="text-sm text-gray-600">
                              10+ projects • 4.8+ rating
                            </p>
                          </div>
                          <span className="px-3 py-1 text-sm font-bold border border-gray-300 text-gray-700 rounded-full">
                            Gold
                          </span>
                        </div>

                        {/* Platinum */}
                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-base font-semibold text-gray-800">
                              Platinum
                            </p>
                            <p className="text-sm text-gray-600">
                              25+ projects • 4.9+ rating
                            </p>
                          </div>
                          <span className="px-3 py-1 text-sm font-bold border border-gray-300 text-gray-700 rounded-full">
                            Platinum
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Reviews from Bidders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {analyticsData.reviewsFromBidders.map((review) => (
                        <div
                          key={review.id}
                          className="flex items-start space-x-4 border-b pb-4 last:border-b-0"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                review.bidderAvatar ||
                                "/placeholder.svg?height=40&width=40&query=user avatar"
                              }
                              alt={review.bidderName}
                            />
                            <AvatarFallback>
                              {review.bidderName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-gray-900">
                                {review.bidderName}
                              </h4>
                              <div className="flex items-center text-sm text-yellow-500">
                                {Array.from({ length: review.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-current"
                                    />
                                  )
                                )}
                                {Array.from({ length: 5 - review.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 text-gray-300"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {review.comment}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {review.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>{" "}
          </SidebarInset>
        </TabsContent>
        <Banalytics
          tab={
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bids" className=" text-xs">
                Bids Analytics
              </TabsTrigger>
              <TabsTrigger value="tender" className=" text-xs">
                Tender Analytics
              </TabsTrigger>
            </TabsList>
          }
        />
      </Tabs>
    </SidebarProvider>
  );
}
