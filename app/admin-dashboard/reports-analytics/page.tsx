"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { sampleUsers, bidFeeRevenueData, sampleTenders } from "@/lib/mock-data"

export default function AdminReportsAnalyticsPage() {
  // User distribution data
  const individualUsers = sampleUsers.filter((user) => user.role === "project_owner").length
  const businessUsers = sampleUsers.filter((user) => user.role === "service_provider").length
  const userRoleDistribution = [
    { name: "Individual (Project Owner)", value: individualUsers, color: "hsl(var(--chart-1))" },
    { name: "Business (Service Provider)", value: businessUsers, color: "hsl(var(--chart-2))" },
  ]

  // Category heatmap (simple count for now)
  const categoryCounts = sampleTenders.reduce(
    (acc, tender) => {
      acc[tender.category] = (acc[tender.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Top 10 active businesses (mock data based on bids placed)
  const businessActivity = sampleUsers
    .filter((user) => user.role === "service_provider")
    .map((user) => ({
      name: user.name,
      bidsPlaced: user.bidsPlaced || 0,
    }))
    .sort((a, b) => b.bidsPlaced - a.bidsPlaced)
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue from Bid Fees (QAR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bidFeeRevenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={{
                "Individual (Project Owner)": {
                  label: "Individual (Project Owner)",
                  color: "hsl(var(--chart-1))",
                },
                "Business (Service Provider)": {
                  label: "Business (Service Provider)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {userRoleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 10 Active Businesses (by Bids Placed)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead className="text-right">Bids Placed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessActivity.length > 0 ? (
                  businessActivity.map((business, index) => (
                    <TableRow key={business.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell className="text-right">{business.bidsPlaced}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No active businesses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Tender Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={categoryData.reduce(
                (acc, curr, idx) => {
                  acc[curr.name] = { label: curr.name, color: `hsl(var(--chart-${(idx % 5) + 1}))` }
                  return acc
                },
                {} as Record<string, { label: string; color: string }>,
              )}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
