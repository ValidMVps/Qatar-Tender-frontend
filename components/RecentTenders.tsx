"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  LineChart as LineChartIcon,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type TenderStatus = "Active" | "Pending" | "Closed";

interface Tender {
  id: number;
  title: string;
  category: string;
  status: TenderStatus;
  postedAt: string;
  deadline: string;
  bidsReceived: number;
}

function StatusBadge({ status }: { status: TenderStatus }) {
  const colors: Record<TenderStatus, string> = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Closed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function RecentTenders() {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TenderStatus | "All">("All");
  const [sortColumn, setSortColumn] = useState<keyof Tender | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const tenders: Tender[] = [
    {
      id: 1,
      title: "Office Renovation",
      category: "Construction",
      status: "Active",
      postedAt: "2025-08-01",
      deadline: "2025-08-20",
      bidsReceived: 5,
    },
    {
      id: 2,
      title: "Website Redesign",
      category: "IT Services",
      status: "Pending",
      postedAt: "2025-08-03",
      deadline: "2025-08-25",
      bidsReceived: 8,
    },
    {
      id: 3,
      title: "Catering Services",
      category: "Hospitality",
      status: "Closed",
      postedAt: "2025-07-28",
      deadline: "2025-08-10",
      bidsReceived: 3,
    },
    {
      id: 4,
      title: "Mobile App Development",
      category: "IT Services",
      status: "Active",
      postedAt: "2025-08-05",
      deadline: "2025-08-30",
      bidsReceived: 12,
    },
  ];

  const filteredTenders = tenders
    .filter((t) => (filterStatus === "All" ? true : t.status === filterStatus))
    .filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
    );

  const sortedTenders = sortColumn
    ? [...filteredTenders].sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      })
    : filteredTenders;

  const handleSort = (column: keyof Tender) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="grid grid-cols-9 w-full justify-start gap-5">
      <Card className="border-1 shadow-none col-span-12 border-neutral-200 rounded-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Recent Tenders</CardTitle>
              <CardDescription>Latest tenders you’ve posted</CardDescription>
            </div>
            <Link href={'/business-dashboard/my-tenders'}>
              {" "}
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>View all</span>
              </Button>
            </Link>
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
            <Table>
              <TableHeader>
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
                      Bids
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
              <TableBody>
                {sortedTenders.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
