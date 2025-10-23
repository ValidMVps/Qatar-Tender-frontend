"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  XCircle,
  Save,
  Filter,
  Grid,
  List,
  CheckCircle,
  Star,
  DollarSign,
  MapPin,
} from "lucide-react";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";

import { useTranslation } from "../../../lib/hooks/useTranslation";
import { getActiveTenders } from "@/app/services/tenderService";
import { useAuth } from "@/context/AuthContext";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Utility function to escape regex special characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// HighlightText component for search term highlighting
const HighlightText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  if (!searchTerm || !text) return <>{text}</>;

  try {
    // Convert search term to lowercase for case-insensitive matching
    const searchTermLower = searchTerm.toLowerCase();
    const textLower = text.toLowerCase();

    // Split the text into parts based on search term matches
    const parts = [];
    let index = 0;

    // Find all occurrences of the search term in the text
    while (index < text.length) {
      const matchIndex = textLower.indexOf(searchTermLower, index);
      if (matchIndex === -1) {
        parts.push({
          text: text.substring(index),
          isMatch: false,
        });
        break;
      }

      // Add non-matching text before the match
      if (matchIndex > index) {
        parts.push({
          text: text.substring(index, matchIndex),
          isMatch: false,
        });
      }

      // Add matching text
      parts.push({
        text: text.substring(matchIndex, matchIndex + searchTerm.length),
        isMatch: true,
      });

      index = matchIndex + searchTerm.length;
    }

    return (
      <span className="break-words">
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.isMatch ? "bg-yellow-200/70 rounded" : ""}
          >
            {part.text}
          </span>
        ))}
      </span>
    );
  } catch (error) {
    console.error("Error highlighting text:", error);
    return <>{text}</>;
  }
};

// MultiSelect Component for categories
const MultiSelectCategories = ({
  selectedCategories,
  setSelectedCategories,
  availableCategories,
  placeholder,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  availableCategories: string[];
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!search) return availableCategories;
    const searchTerm = search.toLowerCase();
    return availableCategories.filter((category) =>
      category.toLowerCase().includes(searchTerm)
    );
  }, [availableCategories, search]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Remove specific category
  const removeCategory = (categoryToRemove: string) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c !== categoryToRemove)
    );
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedCategories([]);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300 focus:border-blue-500 transition-colors h-auto py-2 px-3"
        >
          <div className="flex flex-wrap gap-1 py-1">
            {selectedCategories.length > 0 ? (
              <>
                {selectedCategories.slice(0, 3).map((category) => (
                  <Badge
                    key={category}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {category}
                    <button
                      className="ml-1 rounded-full outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Backspace") {
                          removeCategory(category);
                        }
                      }}
                      onClick={() => removeCategory(category)}
                    >
                      <XCircle className="h-3 w-3 ml-1" />
                    </button>
                  </Badge>
                ))}
                {selectedCategories.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    +{selectedCategories.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <Search className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-100/50 shadow-lg">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="border-b border-gray-100/50"
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => toggleCategory(category)}
                  className="cursor-pointer"
                >
                  <CheckCircle
                    className={`mr-2 h-4 w-4 ${
                      selectedCategories.includes(category)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedCategories.length > 0 && (
            <div className="p-2 border-t border-gray-100/50">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm text-gray-600 hover:text-red-600"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function ServiceProvidingDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentUserId = user?._id;
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFixedPriceRange, setSelectedFixedPriceRange] = useState<
    string[]
  >([]);
  const [selectedBidCounts, setSelectedBidCounts] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDeadlineFilter, setSelectedDeadlineFilter] = useState<
    "any" | "7days" | "30days" | "over30" | "today" | "past"
  >("any");
  const [jobsPerPage, setJobsPerPage] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);

  // sorting
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "budget-high" | "budget-low"
  >("newest");

  // Data state
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter buckets (you can change labels via translations)
  const fixedPriceRanges = [
    { label: t("less_than_100") || "Less than 100", min: 0, max: 99 },
    { label: t("100_to_500") || "100 - 500", min: 100, max: 500 },
    { label: t("500_to_1k") || "500 - 1k", min: 500, max: 1000 },
    { label: t("1k_to_5k") || "1k - 5k", min: 1000, max: 5000 },
    {
      label: t("5k_plus") || "5k+",
      min: 5000,
      max: Number.POSITIVE_INFINITY,
    },
  ];

  const bidCounts = [
    { label: t("less_than_5") || "<5", min: 0, max: 4 },
    { label: t("5_to_10") || "5-10", min: 5, max: 10 },
    { label: t("10_to_15") || "10-15", min: 10, max: 15 },
    { label: t("15_to_20") || "15-20", min: 15, max: 20 },
    { label: t("20_to_50") || "20-50", min: 20, max: 50 },
  ];

  // Load tenders
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const active = await getActiveTenders();
        setTenders(Array.isArray(active) ? active : []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load tenders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Helper functions to normalize fields
  const resolveCategoryName = (tender: any) => {
    if (!tender) return "";
    if (typeof tender.category === "string") return tender.category;
    if (tender.category?.name) return tender.category.name;
    if (tender.category?.title) return tender.category.title;
    return "";
  };

  const resolveBidsCount = (tender: any) => {
    if (typeof tender.bidCount === "number") return tender.bidCount;
    if (typeof tender.bids === "number") return tender.bids;
    if (typeof tender.bids === "string") {
      const match = tender.bids.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    if (Array.isArray(tender.bids)) return tender.bids.length;
    if (typeof tender.proposals === "number") return tender.proposals;
    if (typeof tender.proposals === "string") {
      const match = tender.proposals.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    if (Array.isArray(tender.proposals)) return tender.proposals.length;
    return 0;
  };

  const resolveBudget = (tender: any) => {
    if (!tender) return 0;
    if (typeof tender.estimatedBudget === "number")
      return tender.estimatedBudget;
    if (tender.budget && !isNaN(Number(tender.budget)))
      return Number(tender.budget);
    // Try parse from string like "$1,000"
    if (typeof tender.budget === "string") {
      const digits = tender.budget.replace(/[^0-9.]/g, "");
      return digits ? Number(digits) : 0;
    }
    return 0;
  };

  const parseDeadline = (tender: any) => {
    if (!tender?.deadline) return null;
    const d = new Date(tender.deadline);
    return isNaN(d.getTime()) ? null : d;
  };

  // Unique locations and categories from API results for filters
  const locations = useMemo(() => {
    const s = new Set<string>();
    tenders.forEach((t) => {
      if (t.location) s.add(t.location);
    });
    return ["all", ...Array.from(s)];
  }, [tenders]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    tenders.forEach((t) => {
      const categoryName = resolveCategoryName(t);
      if (categoryName) s.add(categoryName);
    });
    return Array.from(s);
  }, [tenders]);

  // Client-side filtering
  const filteredTenders = useMemo(() => {
    const now = new Date();

    return tenders.filter((tender) => {
      // ✅ Filter out tenders created by the current user
      const tenderUserId =
        tender.postedBy?._id ||
        tender.postedBy?.id ||
        tender.userId ||
        tender.postedBy;

      if (currentUserId && tenderUserId === currentUserId) {
        return false;
      }

      // Keep going with the rest of your filters...
      const title = (tender.title || "").toString().toLowerCase();
      const desc = (tender.description || "").toString().toLowerCase();
      const categoryName = resolveCategoryName(tender).toLowerCase();
      const location = (tender.location || "").toString().toLowerCase();
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        desc.includes(search) ||
        categoryName.includes(search) ||
        location.includes(search);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(resolveCategoryName(tender));

      const matchesLocation =
        selectedLocation === "all" || tender.location === selectedLocation;

      const tenderBudget = resolveBudget(tender);
      const matchesBudget =
        selectedFixedPriceRange.length === 0 ||
        selectedFixedPriceRange.some((label) => {
          const range = fixedPriceRanges.find((r) => r.label === label);
          if (!range) return false;
          return tenderBudget >= range.min && tenderBudget <= range.max;
        });

      const bidsNum = resolveBidsCount(tender);
      const matchesBids =
        selectedBidCounts.length === 0 ||
        selectedBidCounts.some((label) => {
          const range = bidCounts.find((p) => p.label === label);
          if (!range) return false;
          return bidsNum >= range.min && bidsNum <= range.max;
        });

      const deadline = parseDeadline(tender);
      let matchesDeadline = true;
      if (selectedDeadlineFilter !== "any") {
        if (!deadline) matchesDeadline = false;
        else {
          const diffMs = deadline.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (selectedDeadlineFilter === "7days")
            matchesDeadline = diffDays >= 0 && diffDays <= 7;
          else if (selectedDeadlineFilter === "30days")
            matchesDeadline = diffDays >= 0 && diffDays <= 30;
          else if (selectedDeadlineFilter === "over30")
            matchesDeadline = diffDays > 30;
          else if (selectedDeadlineFilter === "today")
            matchesDeadline = deadline.toDateString() === now.toDateString();
          else if (selectedDeadlineFilter === "past")
            matchesDeadline = diffDays < 0;
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesBudget &&
        matchesBids &&
        matchesDeadline
      );
    });
  }, [
    tenders,
    searchTerm,
    selectedCategories,
    selectedFixedPriceRange,
    selectedBidCounts,
    selectedLocation,
    selectedDeadlineFilter,
    fixedPriceRanges,
    bidCounts,
    currentUserId,
  ]);

  // Sorting
  const sortedTenders = useMemo(() => {
    const arr = [...filteredTenders];
    if (sortOption === "newest")
      arr.sort(
        (a, b) =>
          (new Date(b.createdAt || b.createdAt || 0).getTime() || 0) -
          (new Date(a.createdAt || a.createdAt || 0).getTime() || 0)
      );
    if (sortOption === "oldest")
      arr.sort(
        (a, b) =>
          (new Date(a.createdAt || 0).getTime() || 0) -
          (new Date(b.createdAt || 0).getTime() || 0)
      );
    if (sortOption === "budget-high")
      arr.sort((a, b) => resolveBudget(b) - resolveBudget(a));
    if (sortOption === "budget-low")
      arr.sort((a, b) => resolveBudget(a) - resolveBudget(b));
    return arr;
  }, [filteredTenders, sortOption]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTenders.length / Number.parseInt(jobsPerPage || "6"))
  );
  const startIndex = (currentPage - 1) * Number.parseInt(jobsPerPage || "6");
  const endIndex = startIndex + Number.parseInt(jobsPerPage || "6");
  const tendersToDisplay = sortedTenders.slice(startIndex, endIndex);

  // Map to TenderCard props
  const mapTenderForCard = (t: any) => ({
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    category: resolveCategoryName(t) || "General",
    location: t.location || "Remote",
    budget: resolveBudget(t) ? `$${resolveBudget(t)}` : "—",
    postedTime: t.createdAt ? new Date(t.createdAt).toLocaleString() : "",
    isUrgent: false,
    userVerified: Boolean(t.postedBy?.isVerified) || false,
    jobType: "Fixed-Price",
    bids: `${resolveBidsCount(t)} bids`,
    deadline: t.deadline || null,
    raw: t,
  });

  // Handlers
  const toggleFixedRange = (label: string) => {
    setSelectedFixedPriceRange((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
    setCurrentPage(1);
  };

  const toggleBidCount = (label: string) => {
    setSelectedBidCounts((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
    setCurrentPage(1);
  };

  const onLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
  };

  const onDeadlineChange = (v: typeof selectedDeadlineFilter) => {
    setSelectedDeadlineFilter(v);
    setCurrentPage(1);
  };

  // Apple-style TenderCard component
  const TenderCard = ({ tender }: { tender: any }) => {
    const deadline = parseDeadline(tender.raw);
    const isUrgent = deadline
      ? (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7
      : false;

    const renderStars = (rating: number) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      return (
        <div className="flex items-center">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`full-${i}`}
              className="h-3 w-3 fill-gray-800 text-gray-800"
            />
          ))}
          {hasHalfStar && (
            <Star className="h-3 w-3 fill-gray-800 text-gray-800 opacity-50" />
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
          ))}
        </div>
      );
    };

    return (
      <div className="group bg-white/70 backdrop-blur-xl rounded-xl p-6 px-7 border border-gray-300/50 hover:border-gray-200/80 hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Posted time + Urgent */}
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <span>
                {t("posted")} {tender.postedTime}
              </span>
              {(tender.isUrgent || isUrgent) && (
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium rounded-full">
                  {t("urgent")}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-3 break-words">
              <HighlightText text={tender.title} searchTerm={searchTerm} />
            </h3>

            {/* User + Rating + Spend + Location */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              {tender.userVerified && (
                <span className="flex items-center px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t("verified")}
                </span>
              )}
              <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full break-words">
                <HighlightText text={tender.category} searchTerm={searchTerm} />
              </span>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100">
            <Save className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed break-words">
          <HighlightText text={tender.description} searchTerm={searchTerm} />
        </p>

        {/* Job details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span className="break-words">
              <HighlightText text={tender.location} searchTerm={searchTerm} />
            </span>
          </span>
          <span className="break-words">
            <HighlightText text={tender.bids} searchTerm={searchTerm} />
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900 break-words">
              <HighlightText text={tender.budget} searchTerm={searchTerm} />
            </span>
            <span className="text-gray-500 text-sm ml-1">fixed</span>
          </div>
          {deadline && (
            <span className="text-sm text-gray-500 break-words">
              Due{" "}
              <HighlightText
                text={deadline.toLocaleDateString()}
                searchTerm={searchTerm}
              />
            </span>
          )}
        </div>

        {/* CTA */}
        <Link href={`/business-dashboard/tender-details/${tender.id}`} passHref>
          <Button
            variant="ghost"
            className="w-full mt-4 rounded-xl border border-gray-200/50 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-gray-800 font-medium transition-all duration-300"
          >
            {t("viewDetails") || "View Details"}
          </Button>
        </Link>
      </div>
    );
  };

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );

  const CheckboxGroup = ({
    items,
    selected,
    onToggle,
  }: {
    items: any[];
    selected: string[];
    onToggle: (item: string) => void;
  }) => (
    <div className="space-y-3">
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const isChecked = selected.includes(label);
        const id = `chk-${label.replace(/[^a-z0-9]/gi, "_")}`;
        return (
          <label
            key={label}
            htmlFor={id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={(e) => {
              e.preventDefault();
              onToggle(label);
            }}
          >
            <input
              id={id}
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(label)}
              className="sr-only"
            />

            <div
              className={`w-5 h-5 relative rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                isChecked
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300 group-hover:border-blue-400"
              }`}
            >
              {isChecked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors duration-200">
              {label}
            </span>
          </label>
        );
      })}
    </div>
  );

  return (
    <PageTransitionWrapper>
      <div className="min-h-screen bg-gradient-to-br pb-10">
        <TooltipProvider>
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50">
            <div className="container mx-auto px-0 py-4">
              <div className="flex items-center justify-between gap-6">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("search_tenders") || "Search tenders..."}
                    className="pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                    >
                      <XCircle className="h-5 w-5 text-gray-400" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      showFilters
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    {t("filters")}
                  </button>

                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <Select
                    value={sortOption}
                    onValueChange={(v) => setSortOption(v as any)}
                  >
                    <SelectTrigger className="w-[220px] rounded-xl bg-white/70 border-gray-200/50">
                      <SelectValue placeholder={t("sort_by_newest")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        {t("sort_by_newest")}
                      </SelectItem>
                      <SelectItem value="oldest">
                        {t("sort_by_oldest")}
                      </SelectItem>
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
            </div>
          </div>

          <div className="container mx-auto px-0 py-4">
            <div
              className={!showFilters ? "flex px-0 gap-2" : "flex px-0 gap-6"}
            >
              {/* Filters Sidebar */}
              <div
                className={`transition-all duration-500 ${
                  showFilters
                    ? "w-80 opacity-100"
                    : "w-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-md p-6 border border-gray-100 top-24">
                  <h2 className="font-bold text-xl text-gray-900 mb-6">
                    {t("filters")}
                  </h2>

                  <Accordion
                    type="multiple"
                    defaultValue={[
                      "category",
                      "budget",
                      "bids",
                      "location",
                      "deadline",
                    ]}
                  >
                    {/* Category */}
                    <AccordionItem
                      value="category"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline py-4">
                        {t("category") || "Category"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <MultiSelectCategories
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                          availableCategories={categories}
                          placeholder={
                            t("select_categories") || "Select categories"
                          }
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* Budget */}
                    <AccordionItem
                      value="budget"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline py-4">
                        {t("budget") || "Budget"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <CheckboxGroup
                          items={fixedPriceRanges}
                          selected={selectedFixedPriceRange}
                          onToggle={toggleFixedRange}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* Number of bids */}
                    <AccordionItem
                      value="bids"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline py-4">
                        {t("number_of_bids") || "Number of bids"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <CheckboxGroup
                          items={bidCounts}
                          selected={selectedBidCounts}
                          onToggle={toggleBidCount}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* Location */}
                    <AccordionItem
                      value="location"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline py-4">
                        {t("location") || "Location"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <Select
                          value={selectedLocation}
                          onValueChange={(v) => onLocationChange(v)}
                        >
                          <SelectTrigger className="w-full rounded-xl bg-gray-50 border-gray-200">
                            <SelectValue
                              placeholder={
                                t("select_location") || "Select location"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc === "all" ? "All Locations" : loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Deadline */}
                    <AccordionItem
                      value="deadline"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="font-semibold text-gray-800 hover:no-underline py-4">
                        {t("deadline") || "Deadline"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="flex flex-col space-y-3">
                          {[
                            { value: "any", label: t("any") || "Any" },
                            {
                              value: "7days",
                              label: t("due_in_7_days") || "Due in 7 days",
                            },
                            {
                              value: "30days",
                              label: t("due_in_30_days") || "Due in 30 days",
                            },
                            {
                              value: "over30",
                              label: t("over_30_days") || "Over 30 days",
                            },
                            { value: "today", label: t("today") || "Today" },
                            { value: "past", label: t("past") || "Past due" },
                          ].map(({ value, label }) => {
                            const id = `dl-${value}`;
                            return (
                              <label
                                key={value}
                                htmlFor={id}
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onDeadlineChange(
                                    value as typeof selectedDeadlineFilter
                                  );
                                }}
                              >
                                <input
                                  id={id}
                                  type="radio"
                                  name="deadline"
                                  value={value}
                                  checked={selectedDeadlineFilter === value}
                                  onChange={() =>
                                    onDeadlineChange(
                                      value as typeof selectedDeadlineFilter
                                    )
                                  }
                                  className="sr-only"
                                />

                                <div
                                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                    selectedDeadlineFilter === value
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300 group-hover:border-blue-400"
                                  }`}
                                >
                                  {selectedDeadlineFilter === value && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>

                                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors duration-200">
                                  {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-600">
                      {sortedTenders.length} {t("results")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Tender Listings */}
                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                      : "space-y-4"
                  }`}
                >
                  {loading ? (
                    <div className="col-span-full text-center py-16 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100/50">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <p className="mt-4 text-gray-600">
                        {t("loading_tenders")}
                      </p>
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center py-16 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100/50">
                      <p className="text-red-600 font-medium">
                        {t("error")}: {error}
                      </p>
                    </div>
                  ) : tendersToDisplay.length > 0 ? (
                    tendersToDisplay.map((tender) => (
                      <TenderCard
                        key={tender._id || tender.id}
                        tender={mapTenderForCard(tender)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100/50">
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t("no_tenders_found")}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {t("adjust_filters_or_try_different_search")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      variant="outline"
                      className="px-6 py-2 bg-white/70 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all duration-300"
                    >
                      {t("prev")}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                                currentPage === pageNum
                                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                                  : "bg-white/70 text-gray-700 hover:bg-gray-100 border border-gray-200/50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <div className="text-sm text-gray-600">
                            {t("page")} {currentPage} / {totalPages}
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      variant="outline"
                      className="px-6 py-2 bg-white/70 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all duration-300"
                    >
                      {t("next")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </PageTransitionWrapper>
  );
}
