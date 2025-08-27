"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Inbox, Search } from "lucide-react";
import Link from "next/link";
import { ProjectDetailsSidebar } from "@/components/project-details-sidebar";
import ChatSection from "@/components/ChatSection";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUserTenders, getTender } from "@/app/services/tenderService";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { getUserBids } from "@/app/services/BidService";
import { ProjectDetailsSidebarawarded } from "@/components/project-details-sidebar-awarded";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

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
  // other fields if needed
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
  postedBy: string | User; // From your schema
};

// Map _id to id for UI consistency (if needed)
export default function Component() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tenders, setTenders] = React.useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = React.useState<Tender | null>(
    null
  );
  const [first, setfirst] = React.useState(true);
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
        let fetchedTenders: Tender[] = await getUserTenders(user._id);

        if (activeTab === "owned") {
          // Filter: tenders posted by user and are awarded/completed
          fetchedTenders = fetchedTenders.filter((tender) => {
            const isPostedByUser =
              typeof tender.postedBy === "string"
                ? tender.postedBy === user._id
                : tender.postedBy._id === user._id;

            const isAwardedOrCompleted =
              tender.status === "awarded" || tender.status === "completed";

            return isPostedByUser && isAwardedOrCompleted;
          });
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
          console.log(uniqueAwardedTenders);
        }

        setTenders(fetchedTenders);

        // Set first tender as selected if none is selected
        if (fetchedTenders.length > 0 && !selectedTender) {
          setSelectedTender(fetchedTenders[0]);
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
  }, [selectedTender?._id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-gray-200 text-gray-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Active":
        return "bg-blue-200 text-blue-800";
      case "Awarded":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-200 text-gray-800";
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

  // Safely extract awardedTo name
  const getAwardedToName = (awardedTo: Tender["awardedTo"]): string => {
    if (!awardedTo) return "";
    if (typeof awardedTo === "string") return awardedTo;
    return awardedTo.email || awardedTo._id || "";
  };

  // Safely extract postedBy (return full object or ID)
  const getPostedById = (postedBy: Tender["postedBy"]): User | string => {
    if (!postedBy) return "";
    if (typeof postedBy === "string") return postedBy;
    return postedBy;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "owned" | "awarded")}
        className="h-full flex flex-col"
      >
        {activeTab !== "awarded" && (
          <TabsContent value="owned" className="flex-1 overflow-hidden">
            <div className="flex w-full flex-col h-[100%] py-0 md:py-5 md:h-[calc(100vh-85px)] overflow-hidden">
              <div className="grid flex-1 h-full overflow-hidden grid-cols-1 md:grid-cols-12 border">
                {/* Left Sidebar - Project List (Desktop) */}
                <div className="hidden flex-col h-full border-r bg-background md:flex md:col-span-3">
                  <div className="flex items-center h-16 justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{t("inbox")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("all")}
                      </span>
                      <Switch />
                      <span className="text-sm text-muted-foreground">
                        {t("unread")}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b">
                    <TabsList className="w-full">
                      <TabsTrigger value="owned" className="flex-1">
                        {t("owned_projects")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="awarded"
                        className="flex-1"
                        onClick={() => setfirst(false)}
                      >
                        {t("awarded_projects")}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex items-center mt-2 gap-2 p-4">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("search_projects")}
                        type="search"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <nav className="grid gap-1 px-4 text-sm font-medium">
                      {tenders.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          {t("no_projects_found")}
                        </div>
                      ) : (
                        tenders.map((tender) => (
                          <Link
                            key={tender._id}
                            href="#"
                            className={`flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90 ${
                              selectedTender?._id === tender._id
                                ? "bg-muted"
                                : ""
                            }`}
                            prefetch={false}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTender(tender);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">
                                {tender.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(tender.createdAt)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {tender.description}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Badge variant="secondary">
                                {tender.status === "awarded"
                                  ? t("awarded")
                                  : tender.status === "completed"
                                  ? t("completed")
                                  : t("active")}
                              </Badge>
                            </div>
                          </Link>
                        ))
                      )}
                    </nav>
                  </div>
                </div>

                <ChatSection
                  className="col-span-full md:col-span-9 lg:col-span-6"
                  onOpenProjectList={() => setIsProjectListOpen(true)}
                  onOpenProjectDetails={() => setIsProjectDetailsOpen(true)}
                />

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
                          startDate: selectedTender.startDate,
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
                />
              </div>

              <Sheet
                open={isProjectListOpen}
                onOpenChange={setIsProjectListOpen}
              >
                <SheetContent side="left" className="w-64 p-0 sm:w-80">
                  <div className="flex flex-col h-full bg-background">
                    <div className="flex items-center h-16 justify-between px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Inbox className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{t("inbox")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {t("all")}
                        </span>
                        <Switch />
                        <span className="text-sm text-muted-foreground">
                          {t("unread")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 gap-2 p-4">
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder={t("search_projects")}
                          type="search"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <nav className="grid gap-1 px-4 text-sm font-medium">
                        {tenders.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            {t("no_projects_found")}
                          </div>
                        ) : (
                          tenders.map((tender) => (
                            <Link
                              key={tender._id}
                              href="#"
                              className={`flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90 ${
                                selectedTender?._id === tender._id
                                  ? "bg-muted"
                                  : ""
                              }`}
                              prefetch={false}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTender(tender);
                                setIsProjectListOpen(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-semibold">
                                  {tender.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(tender.createdAt)}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {tender.description}
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary">
                                  {tender.status === "awarded"
                                    ? t("awarded")
                                    : tender.status === "completed"
                                    ? t("completed")
                                    : t("active")}
                                </Badge>
                              </div>
                            </Link>
                          ))
                        )}
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet
                open={isProjectDetailsOpen}
                onOpenChange={setIsProjectDetailsOpen}
              >
                <SheetContent side="right" className="w-64 p-0 sm:w-80">
                  <ProjectDetailsSidebar
                    selectedProject={
                      selectedTender
                        ? {
                            id: selectedTender._id,
                            title: selectedTender.title,
                            description: selectedTender.description,
                            budget: selectedTender.budget,
                            status: selectedTender.status,
                            startDate: selectedTender.startDate,
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
                    currentUserId={user?._id || ""}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </TabsContent>
        )}

        <TabsContent value="awarded" className="flex-1 overflow-hidden">
          <div className="flex w-full flex-col h-[100%] py-0 md:py-5 md:h-[calc(100vh-85px)] overflow-hidden">
            <div className="grid flex-1 h-full overflow-hidden grid-cols-1 md:grid-cols-12 border">
              <div className="hidden flex-col h-full border-r bg-background md:flex md:col-span-3">
                <div className="flex items-center h-16 justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{t("inbox")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("all")}
                    </span>
                    <Switch />
                    <span className="text-sm text-muted-foreground">
                      {t("unread")}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 border-b">
                  <TabsList className="w-full">
                    <TabsTrigger value="owned" className="flex-1">
                      {t("owned_projects")}
                    </TabsTrigger>
                    <TabsTrigger value="awarded" className="flex-1">
                      {t("awarded_to_me")}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex items-center mt-2 gap-2 p-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={t("search_projects")}
                      type="search"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <nav className="grid gap-1 px-4 text-sm font-medium">
                    {awardedtome.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        {t("no_projects_found")}
                      </div>
                    ) : (
                      awardedtome.map((tender) => (
                        <Link
                          key={tender._id}
                          href="#"
                          className={`flex flex-col gap-1 rounded-lg border w-full p-3 hover:bg-muted/90 ${
                            selectedTender?._id === tender._id ? "bg-muted" : ""
                          }`}
                          prefetch={false}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTender(tender);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{tender.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(tender.createdAt)}
                            </div>
                          </div>
                          <div className="text-sm w-[300px] overflow-hidden text-muted-foreground line-clamp-2">
                            {tender.description}
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="secondary">
                              {tender.status === "awarded"
                                ? t("awarded")
                                : tender.status === "completed"
                                ? t("completed")
                                : t("active")}
                            </Badge>
                          </div>
                        </Link>
                      ))
                    )}
                  </nav>
                </div>
              </div>

              <ChatSection
                className="col-span-full md:col-span-9 lg:col-span-6"
                onOpenProjectList={() => setIsProjectListOpen(true)}
                onOpenProjectDetails={() => setIsProjectDetailsOpen(true)}
              />

              <ProjectDetailsSidebarawarded
                className="hidden lg:flex lg:col-span-3"
                selectedProject={
                  selectedTender
                    ? {
                        id: selectedTender._id,
                        title: selectedTender.title,
                        description: selectedTender.description,
                        budget: selectedTender.budget,
                        status: selectedTender.status,
                        startDate: selectedTender.startDate,
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
                        postedBy: getPostedById(selectedTender.postedBy),
                      }
                    : null
                }
                getStatusColor={getStatusColor}
                currentUserId={user?._id || ""}
              />
            </div>

            <Sheet open={isProjectListOpen} onOpenChange={setIsProjectListOpen}>
              <SheetContent side="left" className="w-64 p-0 sm:w-80">
                <div className="flex flex-col h-full bg-background">
                  <div className="flex items-center h-16 justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{t("inbox")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("all")}
                      </span>
                      <Switch />
                      <span className="text-sm text-muted-foreground">
                        {t("unread")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 gap-2 p-4">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("search_projects")}
                        type="search"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <nav className="grid gap-1 px-4 text-sm font-medium">
                      {tenders.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          {t("no_projects_found")}
                        </div>
                      ) : (
                        tenders.map((tender) => (
                          <Link
                            key={tender._id}
                            href="#"
                            className={`flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90 ${
                              selectedTender?._id === tender._id
                                ? "bg-muted"
                                : ""
                            }`}
                            prefetch={false}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTender(tender);
                              setIsProjectListOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">
                                {tender.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(tender.createdAt)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {tender.description}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Badge variant="secondary">
                                {tender.status === "awarded"
                                  ? t("awarded")
                                  : tender.status === "completed"
                                  ? t("completed")
                                  : t("active")}
                              </Badge>
                            </div>
                          </Link>
                        ))
                      )}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet
              open={isProjectDetailsOpen}
              onOpenChange={setIsProjectDetailsOpen}
            >
              <SheetContent side="right" className="w-64 p-0 sm:w-80">
                <ProjectDetailsSidebarawarded
                  className="hidden lg:flex lg:col-span-3"
                  selectedProject={
                    selectedTender
                      ? {
                          id: selectedTender._id,
                          title: selectedTender.title,
                          description: selectedTender.description,
                          budget: selectedTender.budget,
                          status: selectedTender.status,
                          startDate: selectedTender.startDate,
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
                          postedBy: getPostedById(selectedTender.postedBy),
                        }
                      : null
                  }
                  getStatusColor={getStatusColor}
                  currentUserId={user?._id || ""}
                />
              </SheetContent>
            </Sheet>
          </div>
        </TabsContent>
      </Tabs>
    </PageTransitionWrapper>
  );
}
