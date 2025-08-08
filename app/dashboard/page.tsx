"use client";

import {
  Eye,
  BarChart3,
  Banknote,
  Users,
  FileText,
  LayoutDashboard,
  Wallet,
  UserRoundCheck,
  BadgeCheck,
  Plus,
  Building2,
  CalendarDays,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import CreateTenderModal from "@/components/CreateTenderModal";
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
interface Tender {
  id: string;
  title: string;
  department: string;
  value: string;
  postedDate: string;
  status: "active" | "draft" | "closed" | "awarded";
  applicants: number;
  publishedDate: string;
  category: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  active: {
    label: "Active",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: BadgeCheck,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: FileText,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Edit,
  },
  awarded: {
    label: "Awarded",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: UserRoundCheck,
  },
};

const mockTenders: Tender[] = [
  {
    id: "1",
    title: "Construction of New Municipal Building",
    department: "Public Works",
    value: "$2,500,000",
    postedDate: "2024-02-15",
    status: "active",
    applicants: 12,
    publishedDate: "2024-01-10",
    category: "Construction",
  },
  {
    id: "2",
    title: "IT Infrastructure Upgrade Project",
    department: "Technology Services",
    value: "$750,000",
    postedDate: "2024-02-20",
    status: "active",
    applicants: 8,
    publishedDate: "2024-01-12",
    category: "Technology",
  },
  {
    id: "3",
    title: "Road Maintenance and Repair Services",
    department: "Transportation",
    value: "$1,200,000",
    postedDate: "2024-01-30",
    status: "closed",
    applicants: 15,
    publishedDate: "2023-12-15",
    category: "Maintenance",
  },
  {
    id: "4",
    title: "Green Energy Solar Panel Installation",
    department: "Environmental Services",
    value: "$3,100,000",
    postedDate: "2024-03-05",
    status: "draft",
    applicants: 0,
    publishedDate: "2024-01-15",
    category: "Energy",
  },
  {
    id: "5",
    title: "Healthcare Equipment Procurement",
    department: "Health Services",
    value: "$850,000",
    postedDate: "2024-02-25",
    status: "active",
    applicants: 6,
    publishedDate: "2024-01-08",
    category: "Healthcare",
  },
  {
    id: "6",
    title: "Educational Software License Agreement",
    department: "Education",
    value: "$425,000",
    postedDate: "2024-01-25",
    status: "awarded",
    applicants: 4,
    publishedDate: "2023-12-20",
    category: "Software",
  },
];

const TenderCard = ({ tender }: { tender: Tender }) => {
  const status = statusConfig[tender.status];

  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl p-6 px-3 shadow-xs border border-gray-100 hover:border-blue-200 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900  transition-colors duration-200">
            {tender.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{tender.department}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {tender.value}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {tender.applicants} applicants
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Posted: {new Date(tender.postedDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{tender.category}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </span>
        <div className="flex items-center space-x-2">
          <button className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200">
            <Eye className="h-3 w-3 mr-1" />
            View
          </button>
          <button className="inline-flex cursor-pointer  items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition-colors duration-200">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
const recentTenders = [
  {
    id: 1,
    title: "Construction of New Municipal Building",
    category: "Public Works",
    budget: 2500000,
    applicants: 12,
    dueDate: "2/15/2024",
    industry: "Construction",
    status: "Active",
  },
  {
    id: 2,
    title: "IT Infrastructure Upgrade Project",
    category: "Technology Services",
    budget: 750000,
    applicants: 8,
    dueDate: "2/20/2024",
    industry: "Technology",
    status: "Active",
  },
  {
    id: 3,
    title: "Road Maintenance and Repair Services",
    category: "Transportation",
    budget: 1200000,
    applicants: 15,
    dueDate: "1/30/2024",
    industry: "Maintenance",
    status: "Closed",
  },
  {
    id: 4,
    title: "Green Energy Solar Panel Installation",
    category: "Environmental Services",
    budget: 3100000,
    applicants: 0,
    dueDate: "3/5/2024",
    industry: "Energy",
    status: "Draft",
  },
];

const recentActivity = [
  {
    message: "You received a new bid on 'Office Building'",
    type: "bid",
    time: "2 minutes ago",
  },
  {
    message: "You posted a new tender 'Digital Marketing Campaign'",
    type: "tender",
    time: "1 hour ago",
  },
  {
    message: "You awarded 'Office Furniture Supply'",
    type: "award",
    time: "1 day ago",
  },
  {
    message: "You closed the tender 'Catering Services'",
    type: "tender",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  const [openTenderModal, setOpenTenderModal] = useState(false);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            Active
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "awarded":
        return <Badge className="bg-emerald-600 text-white">Awarded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="container mx-auto space-y-6 py-8 px-0 "
      >
        {/* Welcome Box */}
        <motion.div
          variants={fadeInUp}
          className="bg-blue- rounded-xl text-neutral-950  flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex">
            <div className="div space-y-2">
              {" "}
              <h2 className="text-2xl font-bold">
                Welcome back Ahmed Al-Mahmoud
              </h2>
              <p className="text-neutral-800 text-sm opacity-80">
                Here's what’s happening in your account today.
              </p>
            </div>
          </div>
          <div className="flex  items-start md:items-end gap-1">
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => setOpenTenderModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Post Tender</span>
            </Button>
          </div>
        </motion.div>{" "}
        <div className="grid grid-cols-1 gap-4  md:grid-cols-2 xl:grid-cols-4">
          {/* Total Tenders Posted */}
          <Card className="bg-blue-500 text-neutral-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tenders Posted
              </CardTitle>
              <FileText className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          {/* Active Tenders */}
          <Card className="bg-blue-500  text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tenders
              </CardTitle>
              <BadgeCheck className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          {/* Proposals Received */}
          <Card className="bg-blue-500  text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bids Received
              </CardTitle>
              <UserRoundCheck className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="bg-blue-500  text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Wallet className="h-5 w-5 " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,500</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tenders */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-white/10 rounded-xl pt-5 ">
              {/*<div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Tenders
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>*/}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockTenders.slice(0, 4).map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            </div>
          </motion.div>
          <CreateTenderModal
            open={openTenderModal}
            onOpenChange={setOpenTenderModal}
          />
          {/* Sidebar Widgets */}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
