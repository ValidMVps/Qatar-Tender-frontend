"use client";
import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserTenders } from "@/app/services/tenderService";
import { getUserBids } from "@/app/services/BidService";
import {
  Loader2,
  TrendingUp,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useTranslation from "@/lib/hooks/useTranslation";

const chartConfig = {
  tenders: { label: "Tenders" },
  tendersPosted: { label: "Tenders Posted", color: "#007AFF" },
  bidsReceived: { label: "Bids Received", color: "#34C759" },
  myBids: { label: "My Bids", color: "#AF52DE" },
  bidsPlaced: { label: "Bids Placed", color: "#FF9500" },
  bidsWon: { label: "Bids Won", color: "#34C759" },
  avgBidValue: { label: "Avg Bid Value", color: "#FF3B30" },
  totalActivity: { label: "Total Activity", color: "#007AFF" },
  submitted: { label: "Submitted", color: "#007AFF" },
  accepted: { label: "Accepted", color: "#34C759" },
  rejected: { label: "Rejected", color: "#FF3B30" },
} satisfies ChartConfig;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ChartDataPoint {
  date: string;
  tendersPosted: number;
  bidsReceived: number;
  myBids: number;
  totalBidValue: number;
  bidCount: number;
}

interface BidSuccessData {
  date: string;
  bidsPlaced: number;
  bidsWon: number;
}

interface TenderBidData {
  name: string;
  bids: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface DayOfWeekData {
  day: string;
  count: number;
}

interface BidStatusTimelineData {
  date: string;
  submitted: number;
  accepted: number;
  rejected: number;
}

export default function page() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [bidSuccessData, setBidSuccessData] = React.useState<BidSuccessData[]>(
    []
  );
  const [topTendersByBids, setTopTendersByBids] = React.useState<
    TenderBidData[]
  >([]);
  const [bidStatusData, setBidStatusData] = React.useState<StatusData[]>([]);
  const [tenderStatusData, setTenderStatusData] = React.useState<StatusData[]>(
    []
  );
  const [avgBidValueData, setAvgBidValueData] = React.useState<
    { date: string; avgBidValue: number }[]
  >([]);
  const [engagementData, setEngagementData] = React.useState<
    { date: string; totalActivity: number }[]
  >([]);
  const [bidByDayData, setBidByDayData] = React.useState<DayOfWeekData[]>([]);
  const [bidStatusTimelineData, setBidStatusTimelineData] = React.useState<
    BidStatusTimelineData[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalTenders: 0,
    totalBids: 0,
    activeTenders: 0,
    completedTenders: 0,
    pendingBids: 0,
    acceptedBids: 0,
    completedBids: 0,
    avgBidsPerProject: 0,
    projectsWithNoBids: 0,
    totalBidsReceived: 0,
  });
  const { user } = useAuth();

  const processDataForChart = (tenders: any[], bids: any[]) => {
    const dataMap = new Map<string, ChartDataPoint>();
    const days = timeRange === "4d" ? 4 : timeRange === "7d" ? 7 : 90;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dataMap.set(dateStr, {
        date: dateStr,
        tendersPosted: 0,
        bidsReceived: 0,
        myBids: 0,
        totalBidValue: 0,
        bidCount: 0,
      });
    }

    tenders.forEach((tender: any) => {
      const tenderDate = new Date(tender.createdAt).toISOString().split("T")[0];
      if (dataMap.has(tenderDate)) {
        const existing = dataMap.get(tenderDate)!;
        existing.tendersPosted += 1;
        if (tender.bidCount) existing.bidsReceived += tender.bidCount;
      }
    });

    bids.forEach((bid: any) => {
      const bidDate = new Date(bid.createdAt).toISOString().split("T")[0];
      if (dataMap.has(bidDate)) {
        const existing = dataMap.get(bidDate)!;
        existing.myBids += 1;
        if (bid.amount) {
          existing.totalBidValue += parseFloat(bid.amount);
          existing.bidCount += 1;
        }
      }
    });

    return Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const processBidSuccessData = (bids: any[]) => {
    const dataMap = new Map<string, BidSuccessData>();
    const days = timeRange === "4d" ? 4 : timeRange === "7d" ? 7 : 90;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dataMap.set(dateStr, { date: dateStr, bidsPlaced: 0, bidsWon: 0 });
    }

    bids.forEach((bid: any) => {
      if (!bid.createdAt) return;
      const bidDate = new Date(bid.createdAt).toISOString().split("T")[0];
      if (dataMap.has(bidDate)) {
        const existing = dataMap.get(bidDate)!;
        existing.bidsPlaced += 1;
        if (bid.status === "accepted" || bid.status === "completed")
          existing.bidsWon += 1;
      }
    });

    return Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const processTopTendersByBids = (tenders: any[]) => {
    return tenders
      .sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0))
      .slice(0, 5)
      .map((t) => ({
        name: t.title.length > 20 ? `${t.title.substring(0, 20)}...` : t.title,
        bids: t.bidCount || 0,
      }));
  };

  const processBidStatusData = (bids: any[]) => {
    const statusCounts: Record<string, number> = {};
    bids.forEach((bid) => {
      statusCounts[bid.status] = (statusCounts[bid.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const processTenderStatusData = (tenders: any[]) => {
    const statusCounts: Record<string, number> = {};
    tenders.forEach((tender) => {
      statusCounts[tender.status] = (statusCounts[tender.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const processAvgBidValueData = (data: ChartDataPoint[]) => {
    return data.map((day) => ({
      date: day.date,
      avgBidValue: day.bidCount ? day.totalBidValue / day.bidCount : 0,
    }));
  };

  const processEngagementData = (data: ChartDataPoint[]) => {
    return data.map((day) => ({
      date: day.date,
      totalActivity: day.tendersPosted + day.myBids,
    }));
  };

  const processBidByDayData = (bids: any[]) => {
    const dayOfWeekMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bidByDay = Array(7).fill(0);

    bids.forEach((bid) => {
      const day = new Date(bid.createdAt).getDay();
      bidByDay[day] += 1;
    });

    return bidByDay.map((count, index) => ({
      day: dayOfWeekMap[index],
      count,
    }));
  };

  const processBidStatusTimelineData = (bids: any[]) => {
    const dataMap = new Map<
      string,
      { submitted: number; accepted: number; rejected: number }
    >();
    const days = timeRange === "4d" ? 4 : timeRange === "7d" ? 7 : 90;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dataMap.set(dateStr, { submitted: 0, accepted: 0, rejected: 0 });
    }

    bids.forEach((bid: any) => {
      const bidDate = new Date(bid.createdAt).toISOString().split("T")[0];
      if (dataMap.has(bidDate)) {
        const existing = dataMap.get(bidDate)!;
        if (bid.status === "submitted") {
          existing.submitted += 1;
        } else if (bid.status === "accepted" || bid.status == "completed") {
          existing.accepted += 1;
        } else if (bid.status === "rejected") {
          existing.rejected += 1;
        }
      }
    });

    return Array.from(dataMap.entries())
      .map(([date, counts]) => ({
        date,
        submitted: counts.submitted,
        accepted: counts.accepted,
        rejected: counts.rejected,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateStats = (tenders: any[], bids: any[]) => {
    const activeTenders = tenders.filter((t) => t.status === "active").length;
    const completedTenders = tenders.filter(
      (t) => t.status === "completed"
    ).length;
    const pendingBids = bids.filter((b) => b.status === "submitted").length;
    const acceptedBids = bids.filter(
      (b) => b.status === "accepted" || b.status === "completed"
    ).length;
    const completedBids = bids.filter((b) => b.status === "completed").length;
    const totalBidsReceived = tenders.reduce(
      (sum, tender) => sum + (tender.bidCount || 0),
      0
    );
    const projectsWithNoBids = tenders.filter(
      (t) => !t.bidCount || t.bidCount === 0
    ).length;
    const avgBidsPerProject =
      tenders.length > 0
        ? parseFloat((totalBidsReceived / tenders.length).toFixed(1))
        : 0;

    return {
      totalTenders: tenders.length,
      totalBids: bids.length,
      activeTenders,
      completedTenders,
      pendingBids,
      acceptedBids,
      completedBids,
      avgBidsPerProject,
      projectsWithNoBids,
      totalBidsReceived,
    };
  };

  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?._id;
        if (!userId) throw new Error(t("user_not_found_please_log_in_again"));

        const [tendersResponse, bidsResponse] = await Promise.all([
          getUserTenders(userId),
          getUserBids(),
        ]);
        const tenders = tendersResponse || [];
        const bids = bidsResponse || [];

        const processedChartData = processDataForChart(tenders, bids);
        const processedBidSuccessData = processBidSuccessData(bids);
        const processedTopTenders = processTopTendersByBids(tenders);
        const processedBidStatusData = processBidStatusData(bids);
        const processedTenderStatusData = processTenderStatusData(tenders);
        const processedAvgBidValueData =
          processAvgBidValueData(processedChartData);
        const processedEngagementData =
          processEngagementData(processedChartData);
        const processedBidByDayData = processBidByDayData(bids);
        const processedBidStatusTimelineData =
          processBidStatusTimelineData(bids);

        setChartData(processedChartData);
        setBidSuccessData(processedBidSuccessData);
        setTopTendersByBids(processedTopTenders);
        setBidStatusData(processedBidStatusData);
        setTenderStatusData(processedTenderStatusData);
        setAvgBidValueData(processedAvgBidValueData);
        setEngagementData(processedEngagementData);
        setBidByDayData(processedBidByDayData);
        setBidStatusTimelineData(processedBidStatusTimelineData);
        setStats(calculateStats(tenders, bids));
      } catch (err) {
        console.error(t("failed_to_fetch"), err);
        setError(err instanceof Error ? err.message : t("failed_to_load_data"));
        setChartData([]);
        setBidSuccessData([]);
        setTopTendersByBids([]);
        setBidStatusData([]);
        setTenderStatusData([]);
        setAvgBidValueData([]);
        setEngagementData([]);
        setBidByDayData([]);
        setBidStatusTimelineData([]);
        setStats({
          totalTenders: 0,
          totalBids: 0,
          activeTenders: 0,
          completedTenders: 0,
          pendingBids: 0,
          completedBids: 0,
          acceptedBids: 0,
          avgBidsPerProject: 0,
          projectsWithNoBids: 0,
          totalBidsReceived: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, t]);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    const days = timeRange === "4d" ? 4 : timeRange === "7d" ? 7 : 90;
    return chartData.slice(-days);
  }, [chartData, timeRange]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-sm text-gray-500">
          {t("loading_dashboard_data")}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 py-6 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="grid flex-1 gap-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("activity_overview")}
          </h3>
          <p className="text-sm text-gray-500">
            {error
              ? t("error_loading_data_please_check_your_connection")
              : t("your_tender_and_bidding_activity")}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-full bg-gray-100 border-0">
            <SelectValue placeholder={t("last_3_months")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="4d">{t("last_4_days")}</SelectItem>
            <SelectItem value="7d">{t("last_7_days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tenders Posted */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {t("tenders_posted")}
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalTenders}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {stats.activeTenders} {t("active")}
            </p>
          </CardContent>
        </Card>

        {/* Bids Placed */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              {t("bids_placed")}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats.totalBids}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              {stats.pendingBids} {t("not_accepted_yet")}
            </p>
          </CardContent>
        </Card>

        {/* Bids Won */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {t("bids_won")}
            </CardTitle>
            <Award className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.acceptedBids + stats.completedBids}
            </div>
            <p className="text-xs text-green-700 mt-1">
              {t("win_rate")}:{" "}
              {stats.totalBids > 0
                ? Math.round(
                    ((stats.acceptedBids + stats.completedBids) /
                      stats.totalBids) *
                      100
                  )
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        {/* Avg Bids Per Project */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              {t("avg_bids_per_project")}
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {stats.avgBidsPerProject}
            </div>
            <p className="text-xs text-amber-700 mt-1">
              {stats.projectsWithNoBids} {t("projects_with_no_bids")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("activity_timeline")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillTendersPosted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillMyBids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AF52DE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#AF52DE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  className="text-xs text-gray-500"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  className="text-xs text-gray-500"
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                      indicator="dot"
                      className="bg-white shadow-lg rounded-xl border border-gray-200"
                    />
                  }
                />
                <Area
                  dataKey="tendersPosted"
                  type="monotone"
                  fill="url(#fillTendersPosted)"
                  stroke="#007AFF"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="myBids"
                  type="monotone"
                  fill="url(#fillMyBids)"
                  stroke="#AF52DE"
                  strokeWidth={2}
                  stackId="b"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Bid Success Chart */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("bid_success_rate")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={bidSuccessData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillBidsPlaced"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FF9500" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF9500" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillBidsWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  className="text-xs text-gray-500"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  className="text-xs text-gray-500"
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                      indicator="dot"
                      formatter={(value, name) => [
                        value,
                        name === "bidsPlaced"
                          ? t("bids_placed")
                          : t("bids_won"),
                      ]}
                      className="bg-white shadow-lg rounded-xl border border-gray-200"
                    />
                  }
                />
                <Area
                  dataKey="bidsPlaced"
                  type="monotone"
                  fill="url(#fillBidsPlaced)"
                  stroke="#FF9500"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="bidsWon"
                  type="monotone"
                  fill="url(#fillBidsWon)"
                  stroke="#34C759"
                  strokeWidth={2}
                  stackId="b"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Bid Status Timeline */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("bid_status_timeline")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bidStatusTimelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  className="text-xs text-gray-500"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  className="text-xs text-gray-500"
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                      indicator="line"
                      className="bg-white shadow-lg rounded-xl border border-gray-200"
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="accepted"
                  stroke="#34C759"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejected"
                  stroke="#FF3B30"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Average Bid Value Over Time */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("average_bid_value_over_time")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={avgBidValueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillAvgBidValue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  className="text-xs text-gray-500"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  className="text-xs text-gray-500"
                  width={40}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                      indicator="dot"
                      className="bg-white shadow-lg rounded-xl border border-gray-200"
                    />
                  }
                />
                <Area
                  dataKey="avgBidValue"
                  type="monotone"
                  fill="url(#fillAvgBidValue)"
                  stroke="#FF3B30"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
