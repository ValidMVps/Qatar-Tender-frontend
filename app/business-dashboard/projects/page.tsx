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
import { ProjectDetailsSidebar } from "@/components/project-details-sidebar";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

// Types
type User = { _id: string; email: string; userType: string };
type Bid = {
  _id: string;
  tender: Tender;
  status: "accepted" | "completed" | "pending" | "rejected";
};
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
  const [selectedTender, setSelectedTender] = React.useState<Tender | null>(
    null
  );
  const [refresh, setRefresh] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isProjectListOpen, setIsProjectListOpen] = React.useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"owned" | "awarded">(
    "owned"
  );

  // Memoized data
  const [tenders, setTenders] = React.useState<Tender[]>([]);
  const [awardedTenders, setAwardedTenders] = React.useState<Tender[]>([]);

  const currentTenders = activeTab === "owned" ? tenders : awardedTenders;

  // Fetch Logic (Optimized)
  React.useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "owned") {
          const fetched = await getUserTenders(user._id);
          const filtered = fetched.filter((t: Tender) => {
            const isOwner =
              typeof t.postedBy === "string"
                ? t.postedBy === user._id
                : t.postedBy._id === user._id;
            return isOwner && ["awarded", "completed"].includes(t.status);
          });
          setTenders(filtered);
          if (
            filtered.length > 0 &&
            (!selectedTender ||
              (selectedTender.status !== "awarded" &&
                selectedTender.status !== "completed"))
          ) {
            setSelectedTender(filtered[0]);
          }
        } else {
          const bids = await getUserBids();
          const awardedBids = bids.filter((b: Bid) =>
            ["accepted", "completed"].includes(b.status)
          );
          // Explicitly type the Map and resulting array so TypeScript treats these as Tender[]
          const unique: Tender[] = Array.from(
            new Map<string, Tender>(
              awardedBids.map((b: Bid) => [b.tender._id, b.tender as Tender])
            ).values()
          );
          setAwardedTenders(unique);
          if (
            unique.length > 0 &&
            (!selectedTender ||
              !unique.some((t) => t._id === selectedTender._id))
          ) {
            setSelectedTender(unique[0]);
          }
        }
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, activeTab]);

  // Fetch tender details only when ID changes
  const prevTenderId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!selectedTender || selectedTender._id === prevTenderId.current) return;

    const fetchDetails = async () => {
      try {
        const detailed = await getTender(selectedTender._id);
        setSelectedTender(detailed);
        prevTenderId.current = detailed._id;
      } catch (err) {
        console.error("Failed to fetch tender details", err);
      }
    };

    fetchDetails();
  }, [selectedTender?._id]);

  // Force refresh trigger
  React.useEffect(() => {
    if (refresh > 0 && selectedTender) {
      prevTenderId.current = null; // Force refetch
    }
  }, [refresh, selectedTender]);

  // Helpers
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed")
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (s === "awarded")
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    if (s === "in progress" || s === "active")
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
  };

  const getStatusIcon = (status: string) => {
    return status.toLowerCase() === "completed" ? (
      <CheckCircle2 className="h-3 w-3" />
    ) : (
      <Circle className="h-3 w-3 fill-current" />
    );
  };

  const formatDate = (date: string) => {
    const diff =
      Math.abs(new Date().getTime() - new Date(date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (diff < 1) return "Today";
    if (diff < 7) return `${Math.floor(diff)}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  // Memoized Project Card
  const ProjectCard = React.memo(
    ({
      tender,
      isSelected,
      onClick,
    }: {
      tender: Tender;
      isSelected: boolean;
      onClick: () => void;
    }) => (
      <div
        onClick={onClick}
        className={`
        group relative cursor-pointer rounded-xl border p-4 transition-all duration-200
        ${
          isSelected
            ? "border-blue-300 bg-blue-50/80 shadow-md dark:border-blue-600 dark:bg-blue-950"
            : "border-gray-200/60 bg-white/80 hover:border-gray-300 hover:bg-white hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-900/80 dark:hover:border-gray-600"
        }
      `}
      >
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-sm line-clamp-2">{tender.title}</h3>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {tender.description}
        </p>
        <div className="flex justify-between items-center">
          <Badge
            variant="secondary"
            className={`${getStatusColor(
              tender.status
            )} text-xs px-2 py-1 flex items-center gap-1`}
          >
            {getStatusIcon(tender.status)}
            {tender.status}
          </Badge>
          <span className="text-xs text-gray-500">
            {formatDate(tender.createdAt)}
          </span>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="h-full bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-900 dark:to-gray-800">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="h-full flex flex-col"
        >
          <TabsContent value="owned" className="flex-1 overflow-hidden m-0 p-0">
            <ChatLayout
              tenders={tenders}
              selectedTender={selectedTender}
              setSelectedTender={setSelectedTender}
              isProjectListOpen={isProjectListOpen}
              setIsProjectListOpen={setIsProjectListOpen}
              isProjectDetailsOpen={isProjectDetailsOpen}
              setIsProjectDetailsOpen={setIsProjectDetailsOpen}
              getStatusColor={getStatusColor}
              ProjectCard={ProjectCard}
              user={user}
              setRefresh={setRefresh}
              activeTab="owned"
            />
          </TabsContent>

          <TabsContent
            value="awarded"
            className="flex-1 overflow-hidden m-0 p-0"
          >
            <ChatLayout
              tenders={awardedTenders}
              selectedTender={selectedTender}
              setSelectedTender={setSelectedTender}
              isProjectListOpen={isProjectListOpen}
              setIsProjectListOpen={setIsProjectListOpen}
              isProjectDetailsOpen={isProjectDetailsOpen}
              setIsProjectDetailsOpen={setIsProjectDetailsOpen}
              getStatusColor={getStatusColor}
              ProjectCard={ProjectCard}
              user={user}
              setRefresh={setRefresh}
              activeTab="awarded"
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransitionWrapper>
  );
}

// Extracted Layout (Avoid Duplication)
function ChatLayout({
  tenders,
  selectedTender,
  setSelectedTender,
  isProjectListOpen,
  setIsProjectListOpen,
  isProjectDetailsOpen,
  setIsProjectDetailsOpen,
  getStatusColor,
  ProjectCard,
  user,
  setRefresh,
  activeTab,
}: any) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-85px)] overflow-hidden">
      <div className="grid flex-1 h-full overflow-hidden grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col overflow-y-auto">
          <SidebarContent
            tenders={tenders}
            selectedTender={selectedTender}
            setSelectedTender={setSelectedTender}
            ProjectCard={ProjectCard}
            activeTab={activeTab}
            t={t}
          />
        </div>

        {/* Chat */}
        <ChatSection
          tenderId={selectedTender?._id ?? ""}
          className="col-span-full md:col-span-8 lg:col-span-6 rounded-2xl overflow-hidden"
          onOpenProjectList={() => setIsProjectListOpen(true)}
          onOpenProjectDetails={() => setIsProjectDetailsOpen(true)}
        />

        {/* Details Sidebar */}
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
                  awardedTo: selectedTender.awardedTo,
                  postedBy:
                    typeof selectedTender.postedBy === "string"
                      ? selectedTender.postedBy
                      : selectedTender.postedBy._id,
                }
              : null
          }
          getStatusColor={getStatusColor}
          currentUserId={user?._id || ""}
          setRefresh={setRefresh}
          activeTab={activeTab}
        />
      </div>

      {/* Mobile Sheets */}
      <Sheet open={isProjectListOpen} onOpenChange={setIsProjectListOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent
            tenders={tenders}
            selectedTender={selectedTender}
            setSelectedTender={(t: Tender) => {
              setSelectedTender(t);
              setIsProjectListOpen(false);
            }}
            ProjectCard={ProjectCard}
            activeTab={activeTab}
            t={t}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isProjectDetailsOpen} onOpenChange={setIsProjectDetailsOpen}>
        <SheetContent side="right" className="w-80 p-0">
          <ProjectDetailsSidebar
            selectedProject={selectedTender ? selectedTender : null}
            getStatusColor={getStatusColor}
            currentUserId={user?._id || ""}
            setRefresh={setRefresh}
            activeTab={activeTab}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Extracted Sidebar
function SidebarContent({
  tenders,
  selectedTender,
  setSelectedTender,
  ProjectCard,
  activeTab,
  t,
}: any) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl h-full flex flex-col overflow-hidden border border-gray-200/60 shadow-lg">
      <div className="flex items-center justify-between p-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Inbox className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-semibold">{t("inbox")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">{t("all")}</span>
          <Switch className="scale-75" />
          <span className="text-gray-500">{t("unread")}</span>
        </div>
      </div>

      <div className="px-6 pt-4 pb-4">
        <TabsList className="w-full">
          <TabsTrigger value="owned" className="flex-1">
            {t("Tenders")}
          </TabsTrigger>
          <TabsTrigger value="awarded" className="flex-1">
            {t("Bids")}
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder={t("search_projects")} className="pl-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-3">
          {tenders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Inbox className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">{t("no_projects_found")}</p>
            </div>
          ) : (
            tenders.map((tender: Tender) => (
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
  );
}
