"use client";
import { useState } from "react";
import { Search, XCircle, Save, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TenderCard } from "@/components/tender-card";

import { useTranslation } from "../../../lib/hooks/useTranslation";
// Sample data for tenders (updated to match screenshot details and new structure)
const sampleTenders = [
  {
    id: 2,
    postedTime: "58 minutes ago",
    isUrgent: false,
    title: "Webflow/Framer Expert for High-Impact Animated Landing Page",
    userVerified: true,
    rating: 0, // No stars shown in image
    amountSpent: "$0",
    location: "Australia",
    jobType: "Fixed-Price",
    budget: "$2,000.00",
    description:
      "We're on the hunt for a creative and technically skilled Webflow or Framer expert to bring our landing page to life, fast, beautifully, and with eye-catching animations. We're building a data-rich, interactive experience that grabs attention, engages users, and makes a bold impression. Proje...",
    category: "Web Design", // Single category
    proposals: "20 to 50",
  },
];

const categoriesData = [
  "Webflow",
  "Framer",
  "WordPress",
  "Shopify",
  "Wix",
  "Web Design",
  "Web Development",
  "Graphic Design",
  "UI/UX Design", // Added for consistency with sample data
  "HTML",
  "CSS",
  "Animation",
  "Landing Page",
  "Mockup",
  "Visual Communication",
  "User Flow",
  "Nonprofit",
  "Fundraising",
  "Brochure Design",
  "Visual Presentation Design",
  "Wix SEO Wiz",
  "Shopify Development",
];

export default function ServiceProvidingDashboardPage() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("webflow");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<
    string[]
  >([]);
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [hourlyMin, setHourlyMin] = useState<string>("");
  const [hourlyMax, setHourlyMax] = useState<string>("");
  const [selectedFixedPriceRange, setSelectedFixedPriceRange] = useState<
    string[]
  >([]);
  const [selectedProposalCounts, setSelectedProposalCounts] = useState<
    string[]
  >([]);
  const [selectedClientInfo, setSelectedClientInfo] = useState<string[]>([]);
  const [selectedClientHistory, setSelectedClientHistory] = useState<string[]>(
    []
  );
  const [selectedClientLocation, setSelectedClientLocation] = useState("all");
  const [selectedProjectLengths, setSelectedProjectLengths] = useState<
    string[]
  >([]);
  const [jobsPerPage, setJobsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const jobTypes = [
    { label: t("hourly"), count: 889 },
    { label: t("fixed_price"), count: 540 },
  ];

  const fixedPriceRanges = [
    { label: t("less_than_100"), min: 0, max: 99, count: 103 },
    { label: t("100_to_500"), min: 100, max: 500, count: 234 },
    { label: t("500_to_1k"), min: 500, max: 1000, count: 95 },
    { label: t("1k_to_5k"), min: 1000, max: 5000, count: 99 },
    { label: t("5k_plus"), min: 5000, max: Number.POSITIVE_INFINITY, count: 9 },
  ];

  const proposalCounts = [
    { label: t("less_than_5"), min: 0, max: 4, count: 121 },
    { label: t("5_to_10"), min: 5, max: 10, count: 250 },
    { label: t("10_to_15"), min: 10, max: 15, count: 210 },
    { label: t("15_to_20"), min: 15, max: 20, count: 203 },
    { label: t("20_to_50"), min: 20, max: 50, count: 509 },
  ];

  const clientInfoFilters = [
    // { label: "My previous clients", count: 0 }, // Removed as per request
    { label: t("payment_verified"), count: 1311 }, // Will be displayed as "User verified"
  ];

  const clientHistoryFilters = [
    { label: t("no_hires"), count: 401 },
    { label: t("1_to_9_hires"), count: 449 },
    { label: t("10_plus_hires"), count: 577 },
  ];

  const projectLengths = [
    { label: t("less_than_one_month"), count: 803 },
    { label: t("1_to_3_months"), count: 1014 },
    { label: t("3_to_6_months"), count: 593 },
    { label: t("more_than_6_months"), count: 639 },
  ];

  const handleProposalCountChange = (countLabel: string) => {
    setSelectedProposalCounts((prev) =>
      prev.includes(countLabel)
        ? prev.filter((c) => c !== countLabel)
        : [...prev, countLabel]
    );
  };

  const handleClientInfoChange = (infoLabel: string) => {
    setSelectedClientInfo((prev) =>
      prev.includes(infoLabel)
        ? prev.filter((i) => i !== infoLabel)
        : [...prev, infoLabel]
    );
  };

  const handleClientHistoryChange = (historyLabel: string) => {
    setSelectedClientHistory((prev) =>
      prev.includes(historyLabel)
        ? prev.filter((h) => h !== historyLabel)
        : [...prev, historyLabel]
    );
  };

  const handleProjectLengthChange = (lengthLabel: string) => {
    setSelectedProjectLengths((prev) =>
      prev.includes(lengthLabel)
        ? prev.filter((l) => l !== lengthLabel)
        : [...prev, lengthLabel]
    );
  };

  const filteredTenders = sampleTenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase()); // Check category for search

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(tender.category);

    const matchesExperienceLevel =
      selectedExperienceLevels.length === 0 ||
      (tender.jobType === "Hourly" &&
        selectedExperienceLevels.some((level) =>
          tender.hourlyRate?.includes(level)
        ));

    const matchesJobType =
      selectedJobType === "all" ||
      tender.jobType.toLowerCase() === selectedJobType.toLowerCase();

    const tenderBudgetNum =
      tender.jobType === "Fixed-Price"
        ? Number.parseFloat(tender.budget?.replace(/[^0-9.]/g, "") || "0")
        : 0;
    const matchesFixedPrice =
      selectedFixedPriceRange.length === 0 ||
      selectedFixedPriceRange.some((rangeLabel) => {
        const range = fixedPriceRanges.find((r) => r.label === rangeLabel);
        if (!range) return false;
        return tenderBudgetNum >= range.min && tenderBudgetNum <= range.max;
      });

    const tenderProposalsNum =
      Number.parseInt(tender.proposals.split(" ")[0]) || 0;
    const matchesProposals =
      selectedProposalCounts.length === 0 ||
      selectedProposalCounts.some((countLabel) => {
        const range = proposalCounts.find((p) => p.label === countLabel);
        if (!range) return false;
        return (
          tenderProposalsNum >= range.min && tenderProposalsNum <= range.max
        );
      });

    const matchesUserVerified = selectedClientInfo.includes("Payment verified")
      ? tender.userVerified
      : true; // Use userVerified

    const matchesProjectLength =
      selectedProjectLengths.length === 0 ||
      selectedProjectLengths.includes(tender.estimatedTime || "");

    // Simplified location matching for now, as data is limited
    const matchesClientLocation =
      selectedClientLocation === "all" ||
      tender.location.includes(selectedClientLocation);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesExperienceLevel &&
      matchesJobType &&
      matchesFixedPrice &&
      matchesProposals &&
      matchesUserVerified &&
      matchesProjectLength &&
      matchesClientLocation
    );
  });

  const totalPages = Math.ceil(
    filteredTenders.length / Number.parseInt(jobsPerPage)
  );
  const startIndex = (currentPage - 1) * Number.parseInt(jobsPerPage);
  const endIndex = startIndex + Number.parseInt(jobsPerPage);
  const tendersToDisplay = filteredTenders.slice(startIndex, endIndex);

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Top Search Bar */}
        <div className="flex items-center justify-between mb-6 gap-6">
          <div className="relative flex-1 max-w-">
            <Input
              type="text"
              placeholder="webflow"
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
          <div className="flex items-center space-x-4">
            {
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Save className="h-4 w-4" />
                <span>{t("saved_jobs")} (5)</span>
              </Button>
            }
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 border-none shadow-none">
            <CardContent className="p-0 space-y-6">
              <Accordion
                type="multiple"
                defaultValue={[
                  "category",
                  "experience-level",
                  "job-type",
                  "number-of-bids", // Changed from number-of-proposals
                  "client-info",
                  "client-history",
                  "client-location",
                  "project-length",
                ]}
              >
                {/* Category Filter */}
                <AccordionItem value="category" className="border-b">
                  <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline">
                    {t("category")}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("select_categories")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {category}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-gray-500 hover:bg-gray-200"
                            onClick={() => handleCategoryChange(category)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Number of Bids Filter (Renamed) */}
                <AccordionItem value="number-of-bids" className="border-b">
                  <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline">
                    {t("number_of_bids")}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-2">
                    {proposalCounts.map((count) => (
                      <div
                        key={count.label}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`bids-${count.label}`}
                          checked={selectedProposalCounts.includes(count.label)}
                          onCheckedChange={() =>
                            handleProposalCountChange(count.label)
                          }
                        />
                        <Label htmlFor={`bids-${count.label}`}>
                          {count.label} ({count.count})
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Client Info Filter (My previous clients removed) */}
                <AccordionItem value="client-info" className="border-b">
                  <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline">
                    {t("client_info")}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-2">
                    {clientInfoFilters.map((info) => (
                      <div
                        key={info.label}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`client-info-${info.label}`}
                          checked={selectedClientInfo.includes(info.label)}
                          onCheckedChange={() =>
                            handleClientInfoChange(info.label)
                          }
                        />
                        <Label htmlFor={`client-info-${info.label}`}>
                          {info.label === "Payment verified"
                            ? t("user_verified")
                            : info.label}{" "}
                          ({info.count})
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Client History Filter */}
                <AccordionItem value="client-history">
                  <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline">
                    {t("client_history")}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-2">
                    {clientHistoryFilters.map((history) => (
                      <div
                        key={history.label}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`client-history-${history.label}`}
                          checked={selectedClientHistory.includes(
                            history.label
                          )}
                          onCheckedChange={() =>
                            handleClientHistoryChange(history.label)
                          }
                        />
                        <Label htmlFor={`client-history-${history.label}`}>
                          {history.label} ({history.count})
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Tender Listings */}
          <div className="lg:col-span-3 space-y-4">
            {tendersToDisplay.length > 0 ? (
              tendersToDisplay.map((tender) => (
                <TenderCard
                  key={tender.id}
                  tender={{
                    ...tender,
                    jobType:
                      tender.jobType === "Hourly" ? "Hourly" : "Fixed-Price",
                  }}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("no_tenders_found")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("adjust_filters_or_try_different_search")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
