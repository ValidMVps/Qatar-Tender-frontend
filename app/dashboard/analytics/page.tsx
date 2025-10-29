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
import { getTenderBids } from "@/app/services/BidService"; // New service to fetch bids for a tender (implement as Bid.find({ tender: tenderId }))
import {
  Loader2,
  TrendingUp,
  Calendar,
  Award,
  Users,
  Eye,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTranslation from "@/lib/hooks/useTranslation";

const chartConfig = {
  tenders: { label: "Tenders" },
  tendersPosted: { label: "Tenders Posted", color: "#007AFF" },
  bidsReceived: { label: "Bids Received", color: "#34C759" },
  topTenders: { label: "Top Tenders", color: "#AF52DE" },
  active: { label: "Active", color: "#007AFF" },
  completed: { label: "Completed", color: "#34C759" },
  closed: { label: "Closed", color: "#FF9500" },
} satisfies ChartConfig;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ChartDataPoint {
  date: string;
  tendersPosted: number;
  bidsReceived: number;
  totalBidValue: number;
  bidCount: number;
}

interface TenderBidData {
  name: string;
  bids: number;
}

interface TenderStatusTimelineData {
  date: string;
  active: number;
  completed: number;
  closed: number;
}

interface StatusData {
  name: string;
  value: number;
}

export default function IndividualDashboard() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [topTendersByBids, setTopTendersByBids] = React.useState<
    TenderBidData[]
  >([]);
  const [tenderStatusTimelineData, setTenderStatusTimelineData] =
    React.useState<TenderStatusTimelineData[]>([]);
  const [tenderStatusData, setTenderStatusData] = React.useState<StatusData[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    tendersPosted: 0,
    bidsReceived: 0,
    avgTenderValue: 0,
    avgBidValue: 0,
    openProjects: 0,
    closedProjects: 0,
    completedProjects: 0,
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
        totalBidValue: 0,
        bidCount: 0,
      });
    }

    tenders.forEach((tender: any) => {
      const tenderDate = new Date(tender.createdAt).toISOString().split("T")[0];
      if (dataMap.has(tenderDate)) {
        const existing = dataMap.get(tenderDate)!;
        existing.tendersPosted += 1;
      }
    });

    bids.forEach((bid: any) => {
      const bidDate = new Date(bid.createdAt).toISOString().split("T")[0];
      if (dataMap.has(bidDate)) {
        const existing = dataMap.get(bidDate)!;
        existing.bidsReceived += 1;
        existing.totalBidValue += parseFloat(bid.amount || 0);
        existing.bidCount += 1;
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

  const processTenderStatusTimelineData = (tenders: any[]) => {
    const dataMap = new Map<
      string,
      { active: number; completed: number; closed: number }
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
      dataMap.set(dateStr, { active: 0, completed: 0, closed: 0 });
    }

    tenders.forEach((tender: any) => {
      const tenderDate = new Date(tender.createdAt).toISOString().split("T")[0];
      if (dataMap.has(tenderDate)) {
        const existing = dataMap.get(tenderDate)!;
        if (tender.status === "active") {
          existing.active += 1;
        } else if (tender.status === "completed") {
          existing.completed += 1;
        } else if (tender.status === "closed") {
          existing.closed += 1;
        }
      }
    });

    return Array.from(dataMap.entries())
      .map(([date, counts]) => ({
        date,
        active: counts.active,
        completed: counts.completed,
        closed: counts.closed,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

  const calculateStats = (tenders: any[], bids: any[], timeRange: string) => {
    const days = timeRange === "4d" ? 4 : timeRange === "7d" ? 7 : 90;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const filteredTenders = tenders.filter(
      (t) =>
        t.status !== "draft" &&
        t.status !== "rejected" &&
        new Date(t.createdAt) >= startDate &&
        new Date(t.createdAt) <= endDate
    );
    const filteredBids = bids.filter(
      (b) =>
        [
          "submitted",
          "under_review",
          "rejected",
          "accepted",
          "completed",
        ].includes(b.status) &&
        b.paymentStatus === "paid" &&
        new Date(b.createdAt) >= startDate &&
        new Date(b.createdAt) <= endDate
    );

    const tendersPosted = filteredTenders.length;
    const bidsReceived = filteredBids.length; // Accurate count based on fetched bids

    const totalTenderValue = filteredTenders.reduce(
      (sum, tender) => sum + (parseFloat(tender.estimatedBudget || 0) || 0),
      0
    );
    const avgTenderValue = tendersPosted
      ? parseFloat((totalTenderValue / tendersPosted).toFixed(2))
      : 0;

    const totalBidValue = filteredBids.reduce(
      (sum, bid) => sum + (parseFloat(bid.amount || 0) || 0),
      0
    );
    const avgBidValue = filteredBids.length
      ? parseFloat((totalBidValue / filteredBids.length).toFixed(2))
      : 0;

    const openProjects = filteredTenders.filter(
      (t) => t.status === "active"
    ).length;
    const closedProjects = filteredTenders.filter(
      (t) => t.status === "closed"
    ).length;
    const completedProjects = filteredTenders.filter(
      (t) => t.status === "completed"
    ).length;

    return {
      tendersPosted,
      bidsReceived,
      avgTenderValue,
      avgBidValue,
      openProjects,
      closedProjects,
      completedProjects,
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

        const tenders = await getUserTenders(userId);

        const receivedBids: any[] = [];
        for (const tender of tenders) {
          const tenderBids = await getTenderBids(tender._id);
          receivedBids.push(...tenderBids);
        }

        const processedChartData = processDataForChart(tenders, receivedBids);
        const processedTopTenders = processTopTendersByBids(tenders);
        const processedTenderStatusTimelineData =
          processTenderStatusTimelineData(tenders);
        const processedTenderStatusData = processTenderStatusData(tenders);

        setChartData(processedChartData);
        setTopTendersByBids(processedTopTenders);
        setTenderStatusTimelineData(processedTenderStatusTimelineData);
        setTenderStatusData(processedTenderStatusData);
        setStats(calculateStats(tenders, receivedBids, timeRange));
      } catch (err) {
        console.error(t("failed_to_fetch"), err);
        setError(err instanceof Error ? err.message : t("failed_to_load_data"));
        setChartData([]);
        setTopTendersByBids([]);
        setTenderStatusTimelineData([]);
        setTenderStatusData([]);
        setStats({
          tendersPosted: 0,
          bidsReceived: 0,
          avgTenderValue: 0,
          avgBidValue: 0,
          openProjects: 0,
          closedProjects: 0,
          completedProjects: 0,
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
            {t("tender_dashboard")}
          </h3>
          <p className="text-sm text-gray-500">
            {error
              ? t("error_loading_data_please_check_your_connection")
              : t("your_tender_and_bidding_activity")}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-full bg-gray-100 border-0">
            <SelectValue placeholder={t("last_7_days")} />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tenders Posted and Bids Received */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {t("tenders_and_bids")}
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.tendersPosted}/{stats.bidsReceived}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {t("tenders_posted")} / {t("bids_received")}
            </p>
          </CardContent>
        </Card>

        {/* Average Tender and Bid Value */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              {t("avg_tender_bid_value")}
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ₹{stats.avgTenderValue.toLocaleString()}/₹
              {stats.avgBidValue.toLocaleString()}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              {t("avg_tender")} / {t("avg_bid")}
            </p>
          </CardContent>
        </Card>

        {/* Open, Closed, and Completed Projects */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {t("project_status")}
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.openProjects}/{stats.closedProjects}/
              {stats.completedProjects}
            </div>
            <p className="text-xs text-green-700 mt-1">
              {t("open")} / {t("closed")} / {t("completed")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tender Activity Timeline */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("tender_activity_timeline")}
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
                  <linearGradient
                    id="fillBidsReceived"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
                  dataKey="bidsReceived"
                  type="monotone"
                  fill="url(#fillBidsReceived)"
                  stroke="#34C759"
                  strokeWidth={2}
                  stackId="b"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tender Status Distribution (Area Chart - Linear) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("tender_status_distribution")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tenderStatusTimelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="fillCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9500" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF9500" stopOpacity={0} />
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
                  dataKey="active"
                  type="monotone"
                  fill="url(#fillActive)"
                  stroke="#007AFF"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="completed"
                  type="monotone"
                  fill="url(#fillCompleted)"
                  stroke="#34C759"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="closed"
                  type="monotone"
                  fill="url(#fillClosed)"
                  stroke="#FF9500"
                  strokeWidth={2}
                  stackId="a"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tender Status Timeline */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("tender_status_timeline")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={tenderStatusTimelineData}
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
                  dataKey="active"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#34C759"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  stroke="#FF9500"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top Performing Tenders (Area Chart - Step) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="text-md font-semibold mb-4 text-gray-900 px-2">
            {t("top_performing_tenders")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={topTendersByBids}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillTopTenders"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#AF52DE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#AF52DE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
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
                      indicator="dot"
                      className="bg-white shadow-lg rounded-xl border border-gray-200"
                    />
                  }
                />
                <Area
                  dataKey="bids"
                  type="step"
                  fill="url(#fillTopTenders)"
                  stroke="#AF52DE"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
