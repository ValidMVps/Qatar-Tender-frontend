import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const dummyServices = [
  { date: "Aug 1", revenue: 3500, jobsCompleted: 5 },
  { date: "Aug 2", revenue: 4200, jobsCompleted: 6 },
  { date: "Aug 3", revenue: 2900, jobsCompleted: 4 },
  { date: "Aug 4", revenue: 5000, jobsCompleted: 7 },
  { date: "Aug 5", revenue: 6100, jobsCompleted: 8 },
];

export function ServiceProvidersOverviewChart() {
  return (
    <Card className="w-full flex flex-col md:col-span-7 col-span-1 mx-auto h-full justify-between rounded-sm md:rounded-lg">
      <CardHeader>
        <CardTitle>Service Providers Overview</CardTitle>
        <CardDescription>
          Revenue and jobs completed over the last 5 days
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-2 sm:px-4 min-h-[250px]">
        <div className="h-full w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="min-h-[250px]"
          >
            <AreaChart
              data={dummyServices}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <defs>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#3B82F6"
                fill="url(#colorBlue)"
              />
              <Area
                type="monotone"
                dataKey="jobsCompleted"
                name="Jobs Completed"
                stroke="#3B82F6"
                fill="url(#colorBlue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
