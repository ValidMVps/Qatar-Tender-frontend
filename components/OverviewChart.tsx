"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

// Sample data for a Qatar Tender Platform
const chartData = [
  { date: "2024-04-01", tendersPosted: 5, bidsReceived: 12 },
  { date: "2024-04-02", tendersPosted: 8, bidsReceived: 20 },
  { date: "2024-04-03", tendersPosted: 6, bidsReceived: 15 },
  { date: "2024-04-04", tendersPosted: 10, bidsReceived: 25 },
  { date: "2024-04-05", tendersPosted: 12, bidsReceived: 30 },
  { date: "2024-04-06", tendersPosted: 9, bidsReceived: 22 },
  { date: "2024-04-07", tendersPosted: 7, bidsReceived: 18 },
  { date: "2024-04-08", tendersPosted: 15, bidsReceived: 40 },
  { date: "2024-04-09", tendersPosted: 4, bidsReceived: 10 },
  { date: "2024-04-10", tendersPosted: 11, bidsReceived: 28 },
  { date: "2024-04-11", tendersPosted: 13, bidsReceived: 35 },
  { date: "2024-04-12", tendersPosted: 10, bidsReceived: 26 },
  { date: "2024-04-13", tendersPosted: 14, bidsReceived: 38 },
  { date: "2024-04-14", tendersPosted: 6, bidsReceived: 16 },
  { date: "2024-04-15", tendersPosted: 5, bidsReceived: 14 },
  { date: "2024-04-16", tendersPosted: 7, bidsReceived: 19 },
  { date: "2024-04-17", tendersPosted: 18, bidsReceived: 45 },
  { date: "2024-04-18", tendersPosted: 15, bidsReceived: 41 },
  { date: "2024-04-19", tendersPosted: 10, bidsReceived: 24 },
  { date: "2024-04-20", tendersPosted: 4, bidsReceived: 11 },
  { date: "2024-04-21", tendersPosted: 6, bidsReceived: 17 },
  { date: "2024-04-22", tendersPosted: 9, bidsReceived: 23 },
  { date: "2024-04-23", tendersPosted: 7, bidsReceived: 18 },
  { date: "2024-04-24", tendersPosted: 16, bidsReceived: 42 },
  { date: "2024-04-25", tendersPosted: 9, bidsReceived: 21 },
  { date: "2024-04-26", tendersPosted: 3, bidsReceived: 8 },
  { date: "2024-04-27", tendersPosted: 15, bidsReceived: 39 },
  { date: "2024-04-28", tendersPosted: 5, bidsReceived: 13 },
  { date: "2024-04-29", tendersPosted: 12, bidsReceived: 30 },
  { date: "2024-04-30", tendersPosted: 18, bidsReceived: 48 },
  { date: "2024-05-01", tendersPosted: 7, bidsReceived: 19 },
  { date: "2024-05-02", tendersPosted: 11, bidsReceived: 29 },
  { date: "2024-05-03", tendersPosted: 9, bidsReceived: 23 },
  { date: "2024-05-04", tendersPosted: 16, bidsReceived: 43 },
  { date: "2024-05-05", tendersPosted: 19, bidsReceived: 50 },
  { date: "2024-05-06", tendersPosted: 20, bidsReceived: 55 },
  { date: "2024-05-07", tendersPosted: 15, bidsReceived: 39 },
  { date: "2024-05-08", tendersPosted: 6, bidsReceived: 16 },
  { date: "2024-05-09", tendersPosted: 9, bidsReceived: 24 },
  { date: "2024-05-10", tendersPosted: 12, bidsReceived: 33 },
  { date: "2024-05-11", tendersPosted: 13, bidsReceived: 36 },
  { date: "2024-05-12", tendersPosted: 8, bidsReceived: 21 },
  { date: "2024-05-13", tendersPosted: 8, bidsReceived: 20 },
  { date: "2024-05-14", tendersPosted: 18, bidsReceived: 49 },
  { date: "2024-05-15", tendersPosted: 19, bidsReceived: 48 },
  { date: "2024-05-16", tendersPosted: 13, bidsReceived: 34 },
  { date: "2024-05-17", tendersPosted: 20, bidsReceived: 52 },
  { date: "2024-05-18", tendersPosted: 12, bidsReceived: 35 },
  { date: "2024-05-19", tendersPosted: 9, bidsReceived: 23 },
  { date: "2024-05-20", tendersPosted: 7, bidsReceived: 18 },
  { date: "2024-05-21", tendersPosted: 3, bidsReceived: 9 },
  { date: "2024-05-22", tendersPosted: 3, bidsReceived: 8 },
  { date: "2024-05-23", tendersPosted: 10, bidsReceived: 26 },
  { date: "2024-05-24", tendersPosted: 12, bidsReceived: 31 },
  { date: "2024-05-25", tendersPosted: 8, bidsReceived: 22 },
  { date: "2024-05-26", tendersPosted: 8, bidsReceived: 20 },
  { date: "2024-05-27", tendersPosted: 17, bidsReceived: 46 },
  { date: "2022-05-28", tendersPosted: 9, bidsReceived: 24 },
  { date: "2024-05-29", tendersPosted: 3, bidsReceived: 10 },
  { date: "2024-05-30", tendersPosted: 13, bidsReceived: 34 },
  { date: "2024-05-31", tendersPosted: 7, bidsReceived: 19 },
  { date: "2024-06-01", tendersPosted: 7, bidsReceived: 20 },
  { date: "2024-06-02", tendersPosted: 19, bidsReceived: 50 },
  { date: "2024-06-03", tendersPosted: 4, bidsReceived: 11 },
  { date: "2024-06-04", tendersPosted: 17, bidsReceived: 45 },
  { date: "2024-06-05", tendersPosted: 3, bidsReceived: 9 },
  { date: "2024-06-06", tendersPosted: 12, bidsReceived: 32 },
  { date: "2024-06-07", tendersPosted: 13, bidsReceived: 37 },
  { date: "2024-06-08", tendersPosted: 15, bidsReceived: 40 },
  { date: "2024-06-09", tendersPosted: 17, bidsReceived: 48 },
  { date: "2024-06-10", tendersPosted: 6, bidsReceived: 16 },
  { date: "2024-06-11", tendersPosted: 4, bidsReceived: 12 },
  { date: "2024-06-12", tendersPosted: 20, bidsReceived: 52 },
  { date: "2024-06-13", tendersPosted: 3, bidsReceived: 10 },
  { date: "2024-06-14", tendersPosted: 17, bidsReceived: 44 },
  { date: "2024-06-15", tendersPosted: 12, bidsReceived: 35 },
  { date: "2024-06-16", tendersPosted: 14, bidsReceived: 37 },
  { date: "2024-06-17", tendersPosted: 19, bidsReceived: 52 },
  { date: "2024-06-18", tendersPosted: 4, bidsReceived: 13 },
  { date: "2024-06-19", tendersPosted: 13, bidsReceived: 34 },
  { date: "2024-06-20", tendersPosted: 16, bidsReceived: 45 },
  { date: "2024-06-21", tendersPosted: 7, bidsReceived: 18 },
  { date: "2024-06-22", tendersPosted: 12, bidsReceived: 31 },
  { date: "2024-06-23", tendersPosted: 19, bidsReceived: 53 },
  { date: "2024-06-24", tendersPosted: 5, bidsReceived: 14 },
  { date: "2024-06-25", tendersPosted: 6, bidsReceived: 15 },
  { date: "2024-06-26", tendersPosted: 17, bidsReceived: 44 },
  { date: "2024-06-27", tendersPosted: 18, bidsReceived: 49 },
  { date: "2024-06-28", tendersPosted: 6, bidsReceived: 16 },
  { date: "2024-06-29", tendersPosted: 4, bidsReceived: 11 },
  { date: "2024-06-30", tendersPosted: 17, bidsReceived: 40 },
];

const chartConfig = {
  tenders: { label: "Tenders" },
  tendersPosted: { label: "Tenders Posted", color: "#2563eb" }, // blue-600
  bidsReceived: { label: "Bids Received", color: "#3b82f6" }, // blue-500
} satisfies ChartConfig;

export function OverviewChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 border-b pb-4 mb-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <h3 className="text-lg font-semibold">Tender Activity Overview</h3>
          <p className="text-sm text-muted-foreground">
            Showing tenders posted and bids received for the selected period
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex items-center min-h-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTendersPosted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillBidsReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} className="text-xs" width={0} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="bidsReceived"
                type="natural"
                fill="url(#fillBidsReceived)"
                stroke="#3b82f6"
                stackId="a"
              />
              <Area
                dataKey="tendersPosted"
                type="natural"
                fill="url(#fillTendersPosted)"
                stroke="#2563eb"
                stackId="a"
              />
              <ChartLegend content={(props) => <ChartLegendContent verticalAlign={props.verticalAlign} />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
