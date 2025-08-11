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

// Sample data for tenders (updated to match screenshot details and new structure)
const sampleTenders = [
  {
    id: 1,
    postedTime: "32 minutes ago",
    isUrgent: true,
    title: "Urgent: Website Developer for New Refund Agency",
    userVerified: true, // Changed from paymentVerified
    rating: 0, // No stars shown in image
    amountSpent: "$1K+",
    location: "Poland",
    jobType: "Hourly",
    hourlyRate: "Hourly - Intermediate",
    estimatedTime: "1 to 3 months",
    description:
      "We're launching a new refund agency that helps people recover money from fraudulent companies like fake visa and immigration services. We need a fast, reliable professional who can build a clean, trustworthy brand from scratch and launch a basic, functional website within days. Website...",
    category: "Web Development", // Single category
    proposals: "20 to 50",
  },
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
  {
    id: 3,
    postedTime: "3 hours ago",
    isUrgent: false,
    title: "Webflow editor wanted - add content",
    userVerified: true,
    rating: 4.7,
    amountSpent: "$400K+",
    location: "Australia",
    jobType: "Hourly",
    hourlyRate: "$5.00 - $15.00 - Expert",
    estimatedTime: "More than 6 months",
    description:
      "I've got 3 webflow websites that need content added to Content has been written It just needs to be uploaded Start asap",
    category: "Webflow", // Single category
    proposals: "20 to 50",
  },
  {
    id: 4,
    postedTime: "3 hours ago",
    isUrgent: false,
    title: "Website Design using Webflow",
    userVerified: true,
    rating: 5.0,
    amountSpent: "$6K+",
    location: "United States",
    jobType: "Hourly",
    hourlyRate: "$15.00 - $30.00 - Intermediate",
    estimatedTime: "1 to 3 months",
    description:
      "We have an existing presentation that we need to be developed into a responsive website. We require the site to be developed in Webflow. We will provide all of the assets in the form of a packaged indesign file with links. The design should mimic the epub document in this link:...",
    category: "Web Design", // Single category
    proposals: "20 to 50",
  },
  {
    id: 5,
    postedTime: "3 hours ago",
    isUrgent: false,
    title: "Webflow / Figma Designer",
    userVerified: true,
    rating: 4.8,
    amountSpent: "$6K+",
    location: "AUS",
    jobType: "Fixed-Price",
    budget: "$1,500.00",
    description:
      "We're looking for an experienced website designer (or small studio) to help us redesign our website - a HR tech SaaS platform focused on simplifying the employee experience for frontline workers. We've already completed the strategic groundwork. We've already completed the strategic groundwork. Current live site to reference...",
    category: "UI/UX Design", // Single category
    proposals: "20 to 50",
  },
  {
    id: 6,
    postedTime: "9 hours ago",
    isUrgent: false,
    title: "Expert Webflow Designer Needed for Custom Projects",
    userVerified: true,
    rating: 5.0,
    amountSpent: "$3K+",
    location: "United States",
    jobType: "Hourly",
    hourlyRate: "$18.00 - $40.00 - Expert",
    estimatedTime: "More than 6 months",
    description:
      "We are seeking an expert Webflow designer to create and implement visually appealing, user-friendly websites. The ideal candidate will have a strong portfolio showcasing their expertise in Webflow and a solid understanding of responsive design principles. You will work closely with our...",
    category: "Web Design", // Single category
    proposals: "20 to 50",
  },
  {
    id: 7,
    postedTime: "4 hours ago",
    isUrgent: false,
    title:
      "Shopify Developer to Rebuild Existing Webflow Site Using Template (ASAP)",
    userVerified: true,
    rating: 4.8,
    amountSpent: "$40K+",
    location: "United States",
    jobType: "Fixed-Price",
    budget: "$2,000.00",
    description:
      "We need a skilled Shopify developer to urgently rebuild our existing Webflow website into Shopify. We've already purchased a Shopify template to use as the base. Project Details: Website is already designed and functional on Webflow. Need it recreated in Shopify using our selected template...",
    category: "Shopify Development", // Single category
    proposals: "50+",
  },
  {
    id: 8,
    postedTime: "8 hours ago",
    isUrgent: false,
    title:
      "Figma Web Designer with Experience in creative, Minimal Webflow Sites",
    userVerified: true,
    rating: 0, // No stars shown in image
    amountSpent: "$900+",
    location: "Canada",
    jobType: "Hourly",
    hourlyRate: "$5.00 - $15.00 - Expert",
    estimatedTime: "Less than 1 month",
    description:
      "We are looking for a skilled Figma designer to create refined, responsive landing pages and marketing materials for premium real estate projects. The style is minimal, editorial, and sophisticated. You should be confident designing clean and elegant layouts, translating creative direction into...",
    category: "Web Design", // Single category
    proposals: "5 to 10",
  },
  {
    id: 9,
    postedTime: "7 hours ago",
    isUrgent: false,
    title: "Web Developer and Designer for Flagship Foundation Site",
    userVerified: true,
    rating: 0, // No stars shown in image
    amountSpent: "$0",
    location: "South Africa",
    jobType: "Fixed-Price",
    budget: "$700.00",
    description:
      "We're hiring a developer-designer hybrid to build a best-in-class website for the Translational Futures Foundation (TFF) — a new philanthropic organization dedicated to reversing the epidemic of complex PTSD, chronic pain, traumatic brain injury, and substance abuse among Israeli first...",
    category: "Web Development", // Single category
    proposals: "5 to 10",
  },
  {
    id: 10,
    postedTime: "5 hours ago",
    isUrgent: false,
    title: "Wix website",
    userVerified: true,
    rating: 0, // No stars shown in image
    amountSpent: "$95",
    location: "Canada",
    jobType: "Fixed-Price",
    budget: "$250.00",
    description:
      "About Us We are byCassandre, a boutique-luxury swimwear & resortwear brand relaunching after a one-year pause. Our new direction focuses on high-end materials, small capsule drops, and timeless, sustainable luxury for the modern jetsetter. We are seeking a world-class web designer &...",
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



const jobTypes = [
  { label: "Hourly", count: 889 },
  { label: "Fixed-Price", count: 540 },
];

const fixedPriceRanges = [
  { label: "Less than $100", min: 0, max: 99, count: 103 },
  { label: "$100 to $500", min: 100, max: 500, count: 234 },
  { label: "$500 - $1K", min: 500, max: 1000, count: 95 },
  { label: "$1K - $5K", min: 1000, max: 5000, count: 99 },
  { label: "$5K+", min: 5000, max: Number.POSITIVE_INFINITY, count: 9 },
];

const proposalCounts = [
  { label: "Less than 5", min: 0, max: 4, count: 121 },
  { label: "5 to 10", min: 5, max: 10, count: 250 },
  { label: "10 to 15", min: 10, max: 15, count: 210 },
  { label: "15 to 20", min: 15, max: 20, count: 203 },
  { label: "20 to 50", min: 20, max: 50, count: 509 },
];

const clientInfoFilters = [
  // { label: "My previous clients", count: 0 }, // Removed as per request
  { label: "Payment verified", count: 1311 }, // Will be displayed as "User verified"
];

const clientHistoryFilters = [
  { label: "No hires", count: 401 },
  { label: "1 to 9 hires", count: 449 },
  { label: "10+ hires", count: 577 },
];

const projectLengths = [
  { label: "Less than one month", count: 803 },
  { label: "1 to 3 months", count: 1014 },
  { label: "3 to 6 months", count: 593 },
  { label: "More than 6 months", count: 639 },
];

export default function ServiceProvidingDashboardPage() {
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
         
           { <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent"
            >
              <Save className="h-4 w-4" />
              <span>Saved jobs (5)</span>
            </Button>}
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="budget-high">
                  Sort by: Budget (High to Low)
                </SelectItem>
                <SelectItem value="budget-low">
                  Sort by: Budget (Low to High)
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
                    Category
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Categories" />
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
                    Number of bids
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
                    Client info
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
                            ? "User verified"
                            : info.label}{" "}
                          ({info.count})
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Client History Filter */}
                <AccordionItem value="client-history" >
                  <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline">
                    Client history
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
                <TenderCard key={tender.id} tender={tender} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tenders found
                </h3>
                <p className="text-gray-600 mb-6">
                  Adjust your filters or try a different search term.
                </p>
              </div>
            )}

          
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
