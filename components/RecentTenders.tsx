'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowDown, ArrowUp, BarChart3, ChevronRight, LineChartIcon, Table } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
type SortColumn = "postedAt" | "deadline" | "bidsReceived" | null;
type SortDirection = "asc" | "desc";
type TenderStatus = "Pending" | "Active" | "Closed";

function RecentTenders() {
  const [sortColumn, setSortColumn] = React.useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [query, setQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<TenderStatus | "All">("All");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc"); // default to ascending when changing column
    }
  };function StatusBadge({ status }: { status: TenderStatus }) {
  if (status === "Active")
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Active</Badge>
    );
  if (status === "Pending") return <Badge variant="secondary">Pending</Badge>;
  return <Badge variant="outline">Closed</Badge>;
}


  return (
      <Card className="border-1 shadow-none col-span-12 border-neutral-200 rounded-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Recent Tenders</CardTitle>
                    <CardDescription>
                      Latest tenders you’ve posted
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>View all</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
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
                    <SelectTrigger className="w-[180px]">
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
                <div className="rounded-lg">
                  <Table className="px-0 ">
                    <TableHeader className="px-0">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead
                          className="cursor-pointer"
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
                          className="cursor-pointer"
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
                          className="text-right cursor-pointer"
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
                        <TableRow className=" px-0">
                          <TableCell className="font-medium px-0">
                            <div className="flex items-center gap-2">
                              <span>{t.title}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell>{t.category}</TableCell>
                          <TableCell>
                            <StatusBadge status={t.status} />
                          </TableCell>
                          <TableCell>{formatDate(t.postedAt)}</TableCell>
                          <TableCell>{formatDate(t.deadline)}</TableCell>
                          <TableCell className="text-center">
                            {t.bidsReceived}
                          </TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>{" "}
  )
}

export default RecentTenders