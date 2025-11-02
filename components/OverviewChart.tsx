"use client";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { Loader2, TrendingUp, Calendar, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useTranslation from "@/lib/hooks/useTranslation";

const chartConfig = {
  tenders: { label: "Tenders" },
  tendersPosted: { label: "Tenders Posted", color: "#007AFF" },
  bidsReceived: { label: "Bids Received", color: "#34C759" },
  myBids: { label: "My Bids", color: "#AF52DE" },
} satisfies ChartConfig;

interface ChartDataPoint {
  date: string;
  tendersPosted: number;
  bidsReceived: number;
  myBids: number;
}

interface BidSuccessData {
  date: string;
  bidsPlaced: number;
  bidsWon: number;
}

export function OverviewChart() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [bidSuccessData, setBidSuccessData] = React.useState<BidSuccessData[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalTenders: 0,
    totalBids: 0,
    activeTenders: 0,
    completedTenders: 0,
    pendingBids: 0,
    acceptedBids: 0,
  });
  const { user } = useAuth();
  const { t } = useTranslation();

  const processDataForChart = (tenders: any[], bids: any[]) => {
    const dataMap = new Map<string, ChartDataPoint>();
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
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
      if (dataMap.has(bidDate)) dataMap.get(bidDate)!.myBids += 1;
    });

    return Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const processBidSuccessData = (bids: any[]) => {
    const dataMap = new Map<string, BidSuccessData>();
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
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

  const calculateStats = (tenders: any[], bids: any[]) => {
    const activeTenders = tenders.filter((t) => t.status === "active").length;
    const completedTenders = tenders.filter(
      (t) => t.status === "completed"
    ).length;
    const pendingBids = bids.filter(
      (b) => b.status === "pending" || b.status === "submitted"
    ).length;
    const acceptedBids = bids.filter(
      (b) => b.status === "accepted" || b.status === "completed"
    ).length;

    return {
      totalTenders: tenders.length,
      totalBids: bids.length,
      activeTenders,
      completedTenders,
      pendingBids,
      acceptedBids,
    };
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?._id;
        if (!userId) throw new Error("User not found. Please log in again.");

        const [tendersResponse, bidsResponse] = await Promise.all([
          getUserTenders(userId),
          getUserBids(),
        ]);
        const tenders = tendersResponse || [];
        const bids = bidsResponse || [];

        setChartData(processDataForChart(tenders, bids));
        setBidSuccessData(processBidSuccessData(bids));
        setStats(calculateStats(tenders, bids));
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setChartData([]);
        setBidSuccessData([]);
        setStats({
          totalTenders: 0,
          totalBids: 0,
          activeTenders: 0,
          completedTenders: 0,
          pendingBids: 0,
          acceptedBids: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
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
    <div className="w-full h-full flex flex-col space-y-6 py-6">
      {/* Header */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Timeline Chart */}{" "}
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-full bg-gray-100 border-0">
            <SelectValue placeholder={t('last_3_months')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d">{t('last_30_days')}</SelectItem>
            <SelectItem value="7d">{t('last_7_days')}</SelectItem>
          </SelectContent>
        </Select> */}
        <div className="bg-white p-5 rounded-2xl h-[300px] lg:h-[400px]">
          <h4 className="text-md font-semibold mb-4 text-gray-900">
            {t("activity_timeline")}
          </h4>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
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
      </div>
    </div>
  );
}
