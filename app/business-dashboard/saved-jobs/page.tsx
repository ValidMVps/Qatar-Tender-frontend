"use client";

import { useState } from "react";
import { Search, FileText, XCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenderCard } from "@/components/tender-card";
import useTranslation from "@/lib/hooks/useTranslation";

// Sample data for saved jobs (using the same structure as tenders for TenderCard compatibility)
const savedJobsData = [
  {
    id: 11,
    postedTime: "1 day ago",
    isUrgent: false,
    title: "E-commerce Website Redesign",
    userVerified: true,
    rating: 4.5,
    amountSpent: "$10K+",
    location: "United States",
    jobType: "Fixed-Price",
    budget: "$5,000.00",
    description:
      "We need a complete redesign of our existing e-commerce website to improve user experience and conversion rates. Looking for a modern, clean design with a focus on mobile responsiveness.",
    category: "Web Design",
    proposals: "10 to 15",
  },
  {
    id: 12,
    postedTime: "2 days ago",
    isUrgent: true,
    title: "Mobile App Development (iOS & Android)",
    userVerified: true,
    rating: 4.9,
    amountSpent: "$50K+",
    location: "Germany",
    jobType: "Fixed-Price",
    budget: "$25,000.00",
    description:
      "Develop a cross-platform mobile application for our new social networking platform. Must include real-time chat, user profiles, and push notifications.",
    category: "Mobile Development",
    proposals: "5 to 10",
  },
  {
    id: 13,
    postedTime: "3 days ago",
    isUrgent: false,
    title: "Content Writer for Tech Blog",
    userVerified: false,
    rating: 0,
    amountSpent: "$0",
    location: "United Kingdom",
    jobType: "Fixed-Price",
    hourlyRate: "$25.00 - $40.00 - Intermediate",
    estimatedTime: "More than 6 months",
    hoursPerWeek: "Less than 30 hrs/week",
    description:
      "Seeking a skilled content writer to produce engaging and informative articles for our tech blog. Topics will include AI, machine learning, and software development.",
    category: "Content Writing",
    proposals: "20 to 50",
  },
  {
    id: 14,
    postedTime: "4 days ago",
    isUrgent: false,
    title: "UI/UX Design for SaaS Platform",
    userVerified: true,
    rating: 4.7,
    amountSpent: "$20K+",
    location: "Canada",
    jobType: "Fixed-Price",
    budget: "$8,000.00",
    description:
      "Create intuitive and visually appealing UI/UX designs for our new cloud-based SaaS platform. Focus on user flows, wireframes, and high-fidelity mockups.",
    category: "UI/UX Design",
    proposals: "5 to 10",
  },
  {
    id: 15,
    postedTime: "5 days ago",
    isUrgent: false,
    title: "Video Editor for Marketing Campaigns",
    userVerified: true,
    rating: 4.2,
    amountSpent: "$5K+",
    location: "Australia",
    jobType: "Fixed-Price",
    hourlyRate: "$30.00 - $50.00 - Expert",
    estimatedTime: "1 to 3 months",
    hoursPerWeek: "More than 30 hrs/week",
    description:
      "Looking for a creative video editor to produce engaging video content for our social media marketing campaigns. Experience with Adobe Premiere Pro and After Effects is a must.",
    category: "Video Production",
    proposals: "Less than 5",
  },
];
interface Tender {
  jobType: string;
}
export default function SavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobsPerPage, setJobsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = savedJobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredJobs.length / Number.parseInt(jobsPerPage)
  );
  const startIndex = (currentPage - 1) * Number.parseInt(jobsPerPage);
  const endIndex = startIndex + Number.parseInt(jobsPerPage);
  const jobsToDisplay = filteredJobs.slice(startIndex, endIndex);
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={t("search_saved_jobs")}
            className="pl-10 pr-10 rounded-full h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 hover:bg-gray-100"
              onClick={() => setSearchTerm("")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sort_by_newest")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sort_by_newest")}</SelectItem>
            <SelectItem value="oldest">{t("sort_by_oldest")}</SelectItem>
            <SelectItem value="budget-high">
              {t("sort_by_budget_high_to_low")}
            </SelectItem>
            <SelectItem value="budget-low">
              {t("sort_by_budget_low_to_high")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {jobsToDisplay.length > 0 ? (
          jobsToDisplay.map((job) => (
            <TenderCard
              key={job.id}
              tender={{
                ...job,
                jobType: job.jobType === "Hourly" ? "Hourly" : "Fixed-Price",
              }}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("no_saved_jobs_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(
                "you_havent_saved_any_jobs_yet_browse_tenders_to_find_opportunities"
              )}
            </p>
          </div>
        )}
      </div>

      {filteredJobs.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Select value={jobsPerPage} onValueChange={setJobsPerPage}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t("jobs_per_page")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
