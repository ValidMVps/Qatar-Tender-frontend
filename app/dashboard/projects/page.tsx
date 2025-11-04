"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Inbox,
  Search,
  ChevronRight,
  Circle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import ChatSection from "@/components/ChatSection";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUserTenders, getTender } from "@/app/services/tenderService";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { getUserBids } from "@/app/services/BidService";
import { ProjectDetailsSidebarawarded } from "@/components/project-details-sidebar-awarded";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { ProjectDetailsSidebar } from "@/components/project-details-sidebar";

// Define User type
type User = {
  _id: string;
  email: string;
  userType: string;
};

// Define Bid type
type Bid = {
  _id: string;
  tender: Tender;
  status: "accepted" | "completed" | "pending" | "rejected";
};

// Define Tender type with correct field names and types
type Tender = {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: string;
  startDate: string;
  awardedTo?: string | User;
  createdAt: string;
  postedBy: string | User;
};

export default function Component() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tenders, setTenders] = React.useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = React.useState<Tender | null>(
    null
  );
  const [first, setfirst] = React.useState(true);
  const [refresh, setRefresh] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = React.useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"owned" | "awarded">(
    "owned"
  );
  const [awardedtome, setawardedtome] = React.useState<Tender[]>([]);

  // Fetch tenders when user or tab changes
  React.useEffect(() => {
    if (!user) return;

    const fetchTenders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === "owned") {
          let fetchedTenders: Tender[] = await getUserTenders(user._id);
          fetchedTenders = fetchedTenders.filter((tender) => {
            const isPostedByUser =
              typeof tender.postedBy === "string"
                ? tender.postedBy === user._id
                : tender.postedBy._id === user._id;
            const isAwardedOrCompleted =
              tender.status === "awarded" || tender.status === "completed";
            return isPostedByUser && isAwardedOrCompleted;
          });

          setTenders(fetchedTenders);

          // Reset selection only if no tenders or force update
          if (fetchedTenders.length > 0) {
            // Always update selection if switching to this tab
            if (!selectedTender || activeTab !== "owned") {
              setSelectedTender(fetchedTenders[0]);
            }
          } else {
            setSelectedTender(null);
          }
        } else if (activeTab === "awarded") {
          const gottenBids: Bid[] = await getUserBids();
          const awardedBids = gottenBids.filter(
            (bid) => bid.status === "accepted" || bid.status === "completed"
          );
          const awardedTenders = awardedBids.map((bid) => bid.tender);
          const uniqueAwardedTenders = Array.from(
            new Map(awardedTenders.map((t) => [t._id, t])).values()
          );
          setawardedtome(uniqueAwardedTenders);
          setTenders(uniqueAwardedTenders); // Sync with `tenders` for consistent rendering

          // Always select first if switching tab or none selected
          if (uniqueAwardedTenders.length > 0) {
            if (!selectedTender || activeTab !== "awarded") {
              setSelectedTender(uniqueAwardedTenders[0]);
            }
          } else {
            setSelectedTender(null);
          }
        }
      } catch (err) {
        setError("Failed to fetch tenders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [user, activeTab]);

  // Fetch detailed tender info when selected tender changes
  React.useEffect(() => {
    if (!selectedTender) return;

    const fetchTenderDetails = async () => {
      try {
        const detailedTender: Tender = await getTender(selectedTender._id);
        setSelectedTender(detailedTender);
      } catch (err) {
        console.error("Failed to fetch tender details", err);
      }
    };

    fetchTenderDetails();
  }, [selectedTender?._id, refresh]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "awarded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "in progress":
      case "active":
      case "awarded":
        return <Circle className="h-3 w-3 fill-current" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getPostedById = (postedBy: Tender["postedBy"]): User | string => {
    if (!postedBy) return "";
    if (typeof postedBy === "string") return postedBy;
    return postedBy;
  };

  const ProjectCard = ({
    tender,
    isSelected,
    onClick,
  }: {
    tender: Tender;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`
        group relative cursor-pointer rounded-xl border border-gray-200/60 
        bg-white/80 backdrop-blur-sm transition-all duration-200 ease-out
        hover:border-gray-300/80 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40
        dark:border-gray-700/60 dark:bg-gray-900/80 dark:hover:border-gray-600/80 
        dark:hover:bg-gray-800/90 dark:hover:shadow-gray-900/40
        ${
          isSelected
            ? "border-blue-300/80 bg-blue-50/80 shadow-md shadow-blue-200/40 dark:border-blue-600/60 dark:bg-blue-950/60"
            : ""
        }
      `}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-5 line-clamp-2">
            {tender.title}
          </h3>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-4">
          {tender.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${getStatusColor(
                tender.status
              )} text-xs px-2 py-1 rounded-full border-0 font-medium flex items-center gap-1`}
            >
              {getStatusIcon(tender.status)}
              {tender.status === "awarded"
                ? t("awarded")
                : tender.status === "completed"
                ? t("completed")
                : t("active")}
            </Badge>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(tender.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="h-full bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-900 dark:to-gray-800">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "owned" | "awarded")}
          className="h-full flex flex-col"
        >
          {activeTab !== "awarded" && (
            <TabsContent
              value="owned"
              className="flex-1 overflow-hidden m-0 p-0"
            >
              <div className="flex w-full flex-col h-full md:h-[calc(100vh-85px)] overflow-hidden">
                <div className="grid flex-1 h-full overflow-hidden grid-cols-1 md:grid-cols-12 gap-4 p-4">
                  {/* Left Sidebar - Project List (Desktop) */}
                  <div className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col overflow-y-scroll">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl h-10 border border-gray-200/60 shadow-lg shadow-gray-200/40 dark:bg-gray-900/80 dark:border-gray-700/60 dark:shadow-gray-900/40 h-full flex flex-col overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Inbox className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {t("inbox")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {t("all")}
                          </span>
                          <Switch className="scale-75" />
                          <span className="text-gray-500 dark:text-gray-400">
                            {t("unread")}
                          </span>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="px-6 pt-4 pb-4">
                        <TabsList className="w-full bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl">
                          <TabsTrigger
                            value="owned"
                            className="flex-1 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                          >
                            {t("Tenders")}
                          </TabsTrigger>
                
                        </TabsList>
                      </div>

                      {/* Search */}
                      <div className="px-6 pb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder={t("search_projects")}
                            type="search"
                            className="pl-10 bg-gray-50/80 dark:bg-gray-800/80 border-gray-200/60 dark:border-gray-700/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        </div>
                      </div>

                      {/* Project List */}
                      <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="space-y-3">
                          {tenders.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Inbox className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {t("no_projects_found")}
                              </p>
                            </div>
                          ) : (
                            tenders.map((tender) => (
                              <ProjectCard
                                key={tender._id}
                                tender={tender}
                                isSelected={selectedTender?._id === tender._id}
                                onClick={() => setSelectedTender(tender)}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Section */}
                  <ChatSection
                    tenderId={selectedTender?._id ?? ""}
                    className="col-span-full md:col-span-8 lg:col-span-6 rounded-2xl overflow-hidden"
                    onOpenProjectList={() => setIsProjectListOpen(true)}
                    onOpenProjectDetails={() => setIsProjectDetailsOpen(true)}
                  />

                  {/* Project Details Sidebar */}
                  <ProjectDetailsSidebar
                    className="hidden lg:flex lg:col-span-3"
                    selectedProject={
                      selectedTender
                        ? {
                            id: selectedTender._id,
                            title: selectedTender.title,
                            description: selectedTender.description,
                            budget: selectedTender.budget,
                            status: selectedTender.status,
                            startDate: selectedTender.createdAt,
                            awardedTo: selectedTender.awardedTo
                              ? typeof selectedTender.awardedTo === "string"
                                ? {
                                    _id: selectedTender.awardedTo,
                                    email: "unknown@example.com",
                                  }
                                : {
                                    _id: selectedTender.awardedTo._id,
                                    email: selectedTender.awardedTo.email,
                                  }
                              : undefined,
                            postedBy:
                              typeof selectedTender.postedBy === "string"
                                ? selectedTender.postedBy
                                : selectedTender.postedBy._id,
                          }
                        : null
                    }
                    getStatusColor={getStatusColor}
                    onMarkComplete={() => setIsReviewDialogOpen(true)}
                    currentUserId={user?._id || ""}
                    setRefresh={setRefresh}
                  />
                </div>

                {/* Mobile Sheet for Project List */}
                <Sheet
                  open={isProjectListOpen}
                  onOpenChange={setIsProjectListOpen}
                >
                  <SheetContent
                    side="left"
                    className="w-80 p-0 bg-white/95 backdrop-blur-sm"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Inbox className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {t("inbox")}
                          </span>
                        </div>
                      </div>

                      <div className="px-6 py-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder={t("search_projects")}
                            type="search"
                            className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="space-y-3">
                          {tenders.map((tender) => (
                            <ProjectCard
                              key={tender._id}
                              tender={tender}
                              isSelected={selectedTender?._id === tender._id}
                              onClick={() => {
                                setSelectedTender(tender);
                                setIsProjectListOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Mobile Sheet for Project Details */}
                <Sheet
                  open={isProjectDetailsOpen}
                  onOpenChange={setIsProjectDetailsOpen}
                >
                  <SheetContent
                    side="right"
                    className="w-80 p-0 bg-white/95 backdrop-blur-sm"
                  >
                    <ProjectDetailsSidebar
                      selectedProject={
                        selectedTender
                          ? {
                              id: selectedTender._id,
                              title: selectedTender.title,
                              description: selectedTender.description,
                              budget: selectedTender.budget,
                              status: selectedTender.status,
                              startDate: selectedTender.createdAt,
                              awardedTo: selectedTender.awardedTo
                                ? typeof selectedTender.awardedTo === "string"
                                  ? {
                                      _id: selectedTender.awardedTo,
                                      email: "unknown@example.com",
                                    }
                                  : {
                                      _id: selectedTender.awardedTo._id,
                                      email: selectedTender.awardedTo.email,
                                    }
                                : undefined,
                              postedBy:
                                typeof selectedTender.postedBy === "string"
                                  ? selectedTender.postedBy
                                  : selectedTender.postedBy._id,
                            }
                          : null
                      }
                      getStatusColor={getStatusColor}
                      onMarkComplete={() => {
                        setIsReviewDialogOpen(true);
                        setIsProjectDetailsOpen(false);
                      }}
                      setRefresh={setRefresh}
                      currentUserId={user?._id || ""}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </TabsContent>
          )}


        </Tabs>
      </div>
    </PageTransitionWrapper>
  );
}
