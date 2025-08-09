"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ✅ Tender Data
const dummyTenders = [
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
    value: 15000,
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
    value: 25000,
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
    value: 18000,
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
    value: 35000,
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
    value: 5000,
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
    value: 8000,
  },
  {
    id: "TND-007",
    title: "Retail Store Interior Fit-Out",
    category: "Interior Design",
    status: "Active",
    bidsReceived: 10,
    views: 388,
    postedAt: "2025-07-10",
    deadline: "2025-08-08",
    bidDiffPct: 28,
    value: 60000,
  },
  {
    id: "TND-008",
    title: "Commercial Electrical Wiring",
    category: "Electrical",
    status: "Active",
    bidsReceived: 3,
    views: 170,
    postedAt: "2025-07-28",
    deadline: "2025-08-14",
    bidDiffPct: 15,
    value: 20000,
  },
  {
    id: "TND-009",
    title: "Smart Home Automation Setup",
    category: "Technology",
    status: "Active",
    bidsReceived: 6,
    views: 235,
    postedAt: "2025-07-12",
    deadline: "2025-08-09",
    bidDiffPct: 19,
    value: 12000,
  },
  {
    id: "TND-010",
    title: "Swimming Pool Construction",
    category: "Outdoor",
    status: "Active",
    bidsReceived: 4,
    views: 400,
    postedAt: "2025-07-05",
    deadline: "2025-08-20",
    bidDiffPct: 27,
    value: 90000,
  },
  {
    id: "TND-011",
    title: "Office Furniture Procurement",
    category: "Procurement",
    status: "Active",
    bidsReceived: 8,
    views: 198,
    postedAt: "2025-07-21",
    deadline: "2025-08-12",
    bidDiffPct: 14,
    value: 18000,
  },
  {
    id: "TND-012",
    title: "CCTV & Security System Installation",
    category: "Security",
    status: "Active",
    bidsReceived: 2,
    views: 150,
    postedAt: "2025-07-26",
    deadline: "2025-08-16",
    bidDiffPct: 10,
    value: 7500,
  },
  {
    id: "TND-013",
    title: "Roof Waterproofing & Repair",
    category: "Construction",
    status: "Active",
    bidsReceived: 5,
    views: 221,
    postedAt: "2025-07-11",
    deadline: "2025-08-07",
    bidDiffPct: 16,
    value: 14000,
  },
  {
    id: "TND-014",
    title: "Event Hall Soundproofing",
    category: "Acoustics",
    status: "Active",
    bidsReceived: 1,
    views: 99,
    postedAt: "2025-07-30",
    deadline: "2025-08-18",
    bidDiffPct: 5,
    value: 22000,
  },
  {
    id: "TND-015",
    title: "Server Room Cooling Installation",
    category: "HVAC",
    status: "Active",
    bidsReceived: 4,
    views: 134,
    postedAt: "2025-07-19",
    deadline: "2025-08-11",
    bidDiffPct: 21,
    value: 16000,
  },
  {
    id: "TND-016",
    title: "Marble Flooring for Villa",
    category: "Flooring",
    status: "Active",
    bidsReceived: 6,
    views: 245,
    postedAt: "2025-07-16",
    deadline: "2025-08-09",
    bidDiffPct: 26,
    value: 47000,
  },
  {
    id: "TND-017",
    title: "Warehouse Metal Roofing",
    category: "Construction",
    status: "Active",
    bidsReceived: 7,
    views: 320,
    postedAt: "2025-07-23",
    deadline: "2025-08-17",
    bidDiffPct: 20,
    value: 65000,
  },
  {
    id: "TND-018",
    title: "Driveway Paving & Curbing",
    category: "Outdoor",
    status: "Active",
    bidsReceived: 3,
    views: 190,
    postedAt: "2025-07-22",
    deadline: "2025-08-13",
    bidDiffPct: 13,
    value: 27000,
  },
];

// ✅ Group tender data by date
const formatTenderChartData = (tenders: typeof dummyTenders) => {
  const grouped: Record<string, { total: number; projects: number }> = {};

  tenders.forEach((tender) => {
    const date = new Date(tender.postedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!grouped[date]) {
      grouped[date] = { total: 0, projects: 0 };
    }

    grouped[date].total += tender.value;
    grouped[date].projects += 1;
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
};

export default function ProjectsOverviewChart() {
  const [activeRange, setActiveRange] = useState<
    "3months" | "30days" | "7days"
  >("3months");

  const chartData = useMemo(() => {
    const now = new Date();
    const filtered = dummyTenders.filter((tender) => {
      const posted = new Date(tender.postedAt);
      const diff = now.getTime() - posted.getTime();

      switch (activeRange) {
        case "7days":
          return diff <= 7 * 24 * 60 * 60 * 1000;
        case "30days":
          return diff <= 30 * 24 * 60 * 60 * 1000;
        case "3months":
        default:
          return diff <= 90 * 24 * 60 * 60 * 1000;
      }
    });

    return formatTenderChartData(filtered);
  }, [activeRange]);

  const getSubtitle = () => {
    switch (activeRange) {
      case "30days":
        return "Total for the last 30 days";

      case "3months":
      default:
        return "Total for the last 3 months";
    }
  };

  return (
    <Card className="w-full flex flex-col md:col-span-7 col-span-1 mx-auto h-full justify-between rounded-sm md:rounded-lg">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between space-y-0 md:pb-2 gap-2">
      <div className="space-y-1">
        <CardTitle className="text-lg font-semibold">
        Tenders Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
        {getSubtitle()}
        </CardDescription>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
        variant={activeRange === "3months" ? "secondary" : "outline"}
        size="sm"
        className="h-8 text-xs"
        onClick={() => setActiveRange("3months")}
        >
        Last 3 months
        </Button>
        <Button
        variant={activeRange === "30days" ? "secondary" : "outline"}
        size="sm"
        className="h-8 text-xs"
        onClick={() => setActiveRange("30days")}
        >
        Last 30 days
        </Button>
     
      </div>
      </CardHeader>

      <CardContent className="flex-1  px-2 sm:px-4 min-h-[250px]">
      <div className=" h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          />
          <YAxis
          width={0}
          stroke="#e0e0e0"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={false}
          domain={[0, "dataMax + 20"]}
          />
          <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
          type="monotone"
          dataKey="total"
          stackId="1"
          stroke="#3B82F6"
          fill="url(#colorTotal)"
          fillOpacity={0.6}
          />
          <Area
          type="monotone"
          dataKey="projects"
          stackId="1"
          stroke="#60A5FA"
          fill="url(#colorProjects)"
          fillOpacity={0.8}
          />

          <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
          </linearGradient>
          </defs>
        </AreaChart>
        </ResponsiveContainer>
      </div>
      </CardContent>
    </Card>
  );
}
