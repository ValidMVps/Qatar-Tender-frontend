"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Archive,
  Ban,
  Calendar,
  ChevronDown,
  EllipsisVertical,
  Flag,
  Inbox,
  PenLine,
  RefreshCcw,
  Reply,
  ReplyAll,
  Search,
  Share,
  Trash,
  Undo,
  Redo,
  SearchCheck,
} from "lucide-react";
import Link from "next/link";
import { ReviewDialog } from "@/components/review-dialog";
import { ProjectDetailsSidebar } from "@/components/project-details-sidebar";
import ChatSection from "@/components/ChatSection";

export default function Component() {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-gray-200 text-gray-800";
      case "Completed":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  const handleReviewSubmit = (rating: number, review: string) => {
    console.log("Review Submitted:", { rating, review });
    // Here you would typically send this data to your backend
  };

  return (
    <div
      className="flex w-full flex-col"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="grid flex-1 h-full overflow-hidden md:grid-cols-12">
        <div className="hidden flex-col col-span-3 h-full border-r bg-background md:flex">
          {/* Header Box */}
          <div className="flex items-center h-16 justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Inbox</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">All</span>
              <Switch />
              <span className="text-sm text-muted-foreground">Unread</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center mt-2 gap-2 p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                type="search"
                className="pl-9"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-auto">
            <nav className="grid gap-1 px-4 text-sm font-medium">
              {/* Project 1 - Office Renovation (selected) */}
              <Link
                href="#"
                className="flex flex-col gap-1 rounded-lg border bg-muted p-3 hover:bg-muted/90"
                prefetch={false}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Office Renovation</div>
                  <div className="text-xs text-muted-foreground">
                    2 days ago
                  </div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Complete renovation of the main office space including
                  flooring, lighting, and furniture.
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </Link>

              {/* Project 2 */}
              <Link
                href="#"
                className="flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90"
                prefetch={false}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    Smart City Initiative Phase 2
                  </div>
                  <div className="text-xs text-muted-foreground">
                    1 week ago
                  </div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Expansion of smart city technologies to new districts,
                  focusing on IoT, public safety, and energy efficiency.
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </Link>

              {/* Project 3 */}
              <Link
                href="#"
                className="flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90"
                prefetch={false}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    Educational Facilities Upgrade
                  </div>
                  <div className="text-xs text-muted-foreground">
                    3 weeks ago
                  </div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Modernization of existing educational facilities with new
                  equipment, smart classrooms, and infrastructure improvements.
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </Link>

              {/* Project 4 */}
              <Link
                href="#"
                className="flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/90"
                prefetch={false}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    National Green Spaces Program
                  </div>
                  <div className="text-xs text-muted-foreground">
                    1 month ago
                  </div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Development of new parks, recreational areas, and urban green
                  corridors across the country.
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </Link>
            </nav>
          </div>
        </div>

        <ChatSection />
        <ProjectDetailsSidebar
          selectedProject={{
            title: "Office Renovation",
            description:
              "Complete renovation of the main office space including flooring, lighting, and furniture. This project aims to modernize the workspace, improve employee comfort, and enhance the overall aesthetic of the office environment.",
            budget: "$45,000",
            status: "In Progress",
            startDate: "2024-01-15",
            awardedTo: "Doha Elite Construction",
            // Optionally add review if needed
          }}
          getStatusColor={getStatusColor}
          onMarkComplete={() => setIsReviewDialogOpen(true)}
        />
      </div>
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
