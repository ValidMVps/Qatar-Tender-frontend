"use client";
import * as React from "react";
import {
  AlertTriangle,
  BarChart3,
  CircleHelp,
  Layers,
  ListOrdered,
  Settings,
  Star,
  ArrowUpRight,
  Hourglass,
  FileText,
  TrendingUp,
  Award,
  Percent,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ServiceProvidersOverviewChart } from "./ServiceOverviewChart";

// --- Types for service-provider view ---
type ServiceStatus = "Active" | "Pending" | "Completed";
type Service = {
  id: string;
  title: string;
  category: string;
  status: ServiceStatus;
  price: number;
  postedAt: string;
  nextBooking?: string;
  rating?: number;
  requestsCount?: number;
};
type Request = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  amountOffered?: number;
  submittedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
};

const dummyServices: Service[] = [
  {
    id: "SRV-001",
    title: "AC Repair & Maintenance",
    category: "HVAC",
    status: "Active",
    price: 7500,
    postedAt: "2025-07-10",
    nextBooking: "2025-08-09",
    rating: 4.8,
    requestsCount: 18,
  },
  {
    id: "SRV-002",
    title: "Full Home Deep Cleaning",
    category: "Cleaning",
    status: "Active",
    price: 1200,
    postedAt: "2025-07-26",
    nextBooking: "2025-08-02",
    rating: 4.6,
    requestsCount: 4,
  },
  {
    id: "SRV-003",
    title: "Electrical Troubleshooting",
    category: "Electrician",
    status: "Pending",
    price: 900,
    postedAt: "2025-07-18",
    rating: 4.2,
    requestsCount: 0,
  },
  {
    id: "SRV-004",
    title: "Web Developer (Landing Pages)",
    category: "IT",
    status: "Active",
    price: 4500,
    postedAt: "2025-07-22",
    nextBooking: "2025-08-11",
    rating: 4.9,
    requestsCount: 7,
  },
  {
    id: "SRV-005",
    title: "Home Painting - Single Room",
    category: "Painting",
    status: "Completed",
    price: 1800,
    postedAt: "2025-06-20",
    rating: 4.5,
    requestsCount: 3,
  },
];

const dummyRequests: Request[] = [
  {
    id: "REQ-1001",
    serviceId: "SRV-001",
    serviceTitle: "AC Repair & Maintenance",
    clientName: "Ali Khan",
    amountOffered: 7200,
    submittedAt: "2025-08-02T10:12:00Z",
    status: "Pending",
  },
  {
    id: "REQ-1002",
    serviceId: "SRV-004",
    serviceTitle: "Web Developer (Landing Pages)",
    clientName: "Sara Ahmed",
    amountOffered: 4300,
    submittedAt: "2025-08-01T14:35:00Z",
    status: "Accepted",
  },
  {
    id: "REQ-1003",
    serviceId: "SRV-002",
    serviceTitle: "Full Home Deep Cleaning",
    clientName: "Omar Yousuf",
    amountOffered: 1100,
    submittedAt: "2025-07-30T09:05:00Z",
    status: "Rejected",
  },
  {
    id: "REQ-1004",
    serviceId: "SRV-001",
    serviceTitle: "AC Repair & Maintenance",
    clientName: "Zainab R.",
    amountOffered: 7500,
    submittedAt: "2025-07-29T18:20:00Z",
    status: "Accepted",
  },
  {
    id: "REQ-1005",
    serviceId: "SRV-005",
    serviceTitle: "Home Painting - Single Room",
    clientName: "Hassan M.",
    amountOffered: 1750,
    submittedAt: "2025-07-28T11:45:00Z",
    status: "Pending",
  },
  {
    id: "REQ-1006",
    serviceId: "SRV-003",
    serviceTitle: "Electrical Troubleshooting",
    clientName: "Mariam S.",
    amountOffered: 900,
    submittedAt: "2025-07-25T08:20:00Z",
    status: "Pending",
  },
];

const serviceProviderAnalytics = {
  totalBidsSubmitted: dummyRequests.length,
  pendingBids: dummyRequests.filter((r) => r.status === "Pending").length,
  bidsWon: dummyRequests.filter((r) => r.status === "Accepted").length,
  winRatio: `${(
    (dummyRequests.filter((r) => r.status === "Accepted").length /
      dummyRequests.length) *
    100
  ).toFixed(0)}%`,
  winRateVsCategoryPeers: "+0.2 vs peers",
  ratingsVsCategoryPeers: "+0.1 vs peers",
  revenueFromAwardedProjects: `${dummyRequests
    .filter((r) => r.status === "Accepted")
    .reduce((sum, r) => sum + (r.amountOffered || 0), 0)
    .toLocaleString("en-QA", { style: "currency", currency: "QAR" })}`,
  avgRatingReceived: 4.6,
  recentActivity: [
    {
      type: "request",
      message: "New bid submitted for 'Office Renovation'",
      time: "2 hours ago",
    },
    {
      type: "booking",
      message: "Bid accepted for 'HVAC Installation'",
      time: "5 hours ago",
    },
    {
      type: "review",
      message: "New rating received for 'Cleaning'",
      time: "1 day ago",
    },
    {
      type: "canceled",
      message: "Bid for 'Painting' was canceled",
      time: "3 days ago",
    },
  ],
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-QA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString("en-QA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({
  status,
}: {
  status: ServiceStatus | "Pending" | "Accepted" | "Rejected";
}) {
  if (status === "Active")
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Active</Badge>
    );
  if (status === "Pending") return <Badge variant="secondary">Pending</Badge>;
  if (status === "Accepted")
    return <Badge className="bg-green-600 text-white">Accepted</Badge>;
  if (status === "Rejected")
    return <Badge className="bg-red-600 text-white">Rejected</Badge>;
  return <Badge variant="outline">Completed</Badge>;
}
interface ComponentProps {
  tab: React.ReactNode;
}

export default function Component({ tab }: ComponentProps) {
  const [query, setQuery] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<
    "submittedAt" | "decisionDate" | "amountOffered" | null
  >(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [filterStatus, setFilterStatus] = React.useState<ServiceStatus | "All">(
    "All"
  );

  const handleSort = (
    column: "submittedAt" | "decisionDate" | "amountOffered" | null
  ) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc"); // Default to ascending when changing column
    }
  };

  const {
    totalBidsSubmitted, // Renamed
    pendingBidsCount, // Renamed
    bidsWonCount, // Renamed
    recentRequests,
    reminders,
  } = React.useMemo(() => {
    const totalBidsSubmitted = dummyRequests.length;
    const pendingBidsCount = dummyRequests.filter(
      (r) => r.status === "Pending"
    ).length;
    const bidsWonCount = dummyRequests.filter(
      (r) => r.status === "Accepted"
    ).length;
    const bySubmittedDesc = [...dummyRequests].sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const recentRequests = bySubmittedDesc.slice(0, 6);
    const now = new Date();
    const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const requestsExpiringSoon = dummyRequests.filter(
      (r) =>
        r.status === "Pending" &&
        r.submittedAt &&
        new Date(r.submittedAt) <= threeDaysAhead
    );
    return {
      totalBidsSubmitted,
      pendingBidsCount,
      bidsWonCount,
      recentRequests,
      reminders: { requestsExpiringSoon },
    };
  }, []);

  const nav = [
    { title: "Dashboard", icon: BarChart3, url: "#", active: true },
    { title: "My Services", icon: ListOrdered, url: "#" },
    { title: "Requests", icon: Layers, url: "#" },
    { title: "Support", icon: CircleHelp, url: "#" },
    { title: "Settings", icon: Settings, url: "#" },
  ];

  const filteredRequests = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let current = recentRequests;
    if (q) {
      current = current.filter(
        (r) =>
          r.serviceTitle.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "All") {
      current = current.filter((r) => r.status === filterStatus);
    }
    if (sortColumn) {
      current = [...current].sort((a, b) => {
        let valA: number;
        let valB: number;
        if (sortColumn === "submittedAt" || sortColumn === "decisionDate") {
          const key = sortColumn as keyof Request;
          valA = new Date((a[key] as string | Date) || 0).getTime();
          valB = new Date((b[key] as string | Date) || 0).getTime();
        } else if (sortColumn === "amountOffered") {
          valA = a.amountOffered ?? 0;
          valB = b.amountOffered ?? 0;
        } else {
          valA = 0;
          valB = 0;
        }
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return current;
  }, [query, recentRequests, sortColumn, sortDirection, filterStatus]);

  return (
    <TabsContent value="bids" className=" px-0">
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
                      Total Bids Submitted
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalBidsSubmitted}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+5 this month</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Hourglass className="h-4 w-4 mr-2" />
                    Pending Bids
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {pendingBidsCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Bids awaiting response
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Bids Won
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {bidsWonCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Awarded projects</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Percent className="h-4 w-4 mr-2" />
                    Win Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {serviceProviderAnalytics.winRatio}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {serviceProviderAnalytics.winRateVsCategoryPeers}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          {tab}
          {/* Charts and lists */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Left (main) column - ServiceOverviewChart */}
            <ServiceProvidersOverviewChart />
            {/* Right (aside) column */}
            <div className="md:col-span-5 col-span-1 flex flex-col gap-4 md:gap-4">
              {/* Provider Highlights */}
              <Card className="w-full p-6">
                <CardContent className="p-0 space-y-6">
                  {/* Total Revenue Section */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Revenue from Awarded Projects
                    </p>
                    <h2 className="text-4xl font-bold mt-1">
                      {serviceProviderAnalytics.revenueFromAwardedProjects}
                    </h2>
                  </div>
                  {/* Recently Active Clients Section */}
                  <div>
                    <div className="flex -space-x-2 overflow-hidden">
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/08.png"
                          alt="Client 1"
                        />
                        <AvatarFallback>P1</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/04.png"
                          alt="Client 2"
                        />
                        <AvatarFallback>P2</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/05.png"
                          alt="Client 3"
                        />
                        <AvatarFallback>P3</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/06.png"
                          alt="Client 4"
                        />
                        <AvatarFallback>P4</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src="https://bundui-images.netlify.app/avatars/07.png"
                          alt="Client 5"
                        />
                        <AvatarFallback>P5</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  {/* Highlights Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Highlights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg. Rating Received</span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">
                            {serviceProviderAnalytics.avgRatingReceived}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Ratings vs Category Peers
                        </span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">
                            {serviceProviderAnalytics.ratingsVsCategoryPeers}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Win Rate vs Category Peers
                        </span>
                        <div className="flex items-center gap-1 text-green-500">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="font-medium">
                            {serviceProviderAnalytics.winRateVsCategoryPeers}
                          </span>
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
                    Requests Expiring Soon
                  </CardTitle>
                  <CardDescription>
                    Requests awaiting response in the next 3 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reminders.requestsExpiringSoon.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No requests expiring soon.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {reminders.requestsExpiringSoon.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {r.serviceTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted {formatDate(r.submittedAt)} •{" "}
                              {
                                dummyServices.find((s) => s.id === r.serviceId)
                                  ?.category
                              }
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {r.status}
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
                    Average Rating Received from Clients
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-gray-900 flex items-center">
                    {serviceProviderAnalytics.avgRatingReceived}
                    <span className="text-xl text-gray-500 ml-2">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Based on recent client reviews
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          Bronze
                        </p>
                        <p className="text-sm text-gray-600">
                          2+ jobs completed • 4.5+ rating
                        </p>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold border border-gray-300 text-gray-700 rounded-full">
                        Bronze
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-emerald-600 rounded-lg bg-emerald-50">
                      <div>
                        <p className="text-base font-semibold text-emerald-700">
                          Silver
                        </p>
                        <p className="text-sm text-emerald-600">
                          10+ jobs completed • 4.5+ rating
                        </p>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold border border-emerald-600 text-emerald-700 rounded-full">
                        Silver
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          Gold
                        </p>
                        <p className="text-sm text-gray-600">
                          25+ jobs completed • 4.8+ rating
                        </p>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold border border-gray-300 text-gray-700 rounded-full">
                        Gold
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          Platinum
                        </p>
                        <p className="text-sm text-gray-600">
                          50+ jobs completed • 4.9+ rating
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
                    Reviews from Clients
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Reuse the same sample reviews but call them client reviews */}
                  {[
                    {
                      id: 1,
                      clientName: "Client A",
                      clientAvatar: "/placeholder-user.jpg",
                      rating: 5,
                      comment: "Excellent work and communication.",
                      date: "2024-07-10",
                    },
                    {
                      id: 2,
                      clientName: "Client B",
                      clientAvatar: "/placeholder-user.jpg",
                      rating: 4,
                      comment: "Good outcome, a bit delayed.",
                      date: "2024-07-05",
                    },
                    {
                      id: 3,
                      clientName: "Client C",
                      clientAvatar: "/placeholder-user.jpg",
                      rating: 5,
                      comment: "Very professional and delivered as promised.",
                      date: "2024-06-28",
                    },
                  ].map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start space-x-4 border-b pb-4 last:border-b-0"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={review.clientAvatar || "/placeholder.svg"}
                          alt={review.clientName}
                        />
                        <AvatarFallback>
                          {review.clientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-900">
                            {review.clientName}
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
        </div>
      </SidebarInset>
    </TabsContent>
  );
}
