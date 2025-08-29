// components/ProjectDetailsSidebar.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Star,
  Eye,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "../lib/hooks/useTranslation";
import { updateTenderStatus } from "@/app/services/tenderService";
import { createReview, getReviewForTender } from "@/app/services/ReviewService";
import { getTenderBids, updateBidStatus } from "@/app/services/BidService"; // Import bid service
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface ProjectDetailsSidebarProps
  extends React.ComponentPropsWithoutRef<"div"> {
  selectedProject: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    budget: string;
    awardedTo?: {
      _id: string;
      email: string;
    };
    postedBy: string;
  } | null;
  getStatusColor: (status: string) => string;
  onMarkComplete: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<number>>;
  currentUserId: string;
}

export function ProjectDetailsSidebar({
  selectedProject,
  getStatusColor,
  onMarkComplete,
  currentUserId,
  className,
  setRefresh,
  ...props
}: ProjectDetailsSidebarProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [completeStep, setCompleteStep] = useState(1); // 1: confirm, 2: review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [bid, setbid] = useState<{
    _id: string;
    amount: number;
    status: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(false);
  const [selectedBidAmount, setSelectedBidAmount] = useState<string | null>(
    null
  );
  const [bidLoading, setBidLoading] = useState(false);
  const { t } = useTranslation();
  const { profile, user } = useAuth();

  const isTenderOwner = selectedProject?.postedBy === currentUserId;
  const isCompleted = selectedProject?.status === "completed";
  const isAwarded = selectedProject?.status === "awarded";

  // Fetch the selected bid amount when project changes
  useEffect(() => {
    const fetchSelectedBidAmount = async () => {
      if (!selectedProject || !selectedProject.awardedTo) return;

      setBidLoading(true);
      try {
        const bids = await getTenderBids(selectedProject.id);
        // Find the bid from the awarded user
      
        const awardedBid = bids.find(
          (bid: any) => bid.status === "accepted" || bid.status === "completed"
        );
        setbid(awardedBid);
        if (awardedBid) {
          setSelectedBidAmount(awardedBid.amount + "QAR");
        } else {
          setSelectedBidAmount("Not specified");
        }
      } catch (err) {
        console.error("Failed to fetch bid amount", err);
        setSelectedBidAmount("Not specified");
      } finally {
        setBidLoading(false);
      }
    };

    fetchSelectedBidAmount();
  }, [selectedProject]);

  const handleMarkAsComplete = async () => {
    if (!selectedProject) return;

    setLoading(true);
    setError(null);

    try {
      if (!bid?._id) {
        throw new Error("Bid ID is undefined");
      }
      await updateBidStatus(bid._id, "completed");
      await updateTenderStatus(selectedProject.id, "completed");
      onMarkComplete(); // This should trigger a refresh of the selectedProject
      setCompleteStep(2); // Move to review step in dialog
    } catch (err) {
      setError("Failed to mark project as complete");
      console.error(err);
    } finally {
      setLoading(false);
      setRefresh((prev) => (prev ? prev + 1 : 1));
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedProject || !selectedProject.awardedTo || rating === 0) return;

    try {
      await createReview({
        tender: selectedProject.id,
        reviewedUser: selectedProject.awardedTo._id,
        rating,
        comment,
      });
      setIsCompleteDialogOpen(false);
      setIsReviewDialogOpen(false);
      setCompleteStep(1); // Reset for next time
      setRating(0);
      setComment("");
      setRefresh((prev) => (prev ? prev + 1 : 1));
    } catch (err) {
      setError("Failed to submit review");
      console.error(err);
      setRefresh((prev) => (prev ? prev + 1 : 1));
    }
  };

  const fetchReviewStatus = async () => {
    if (!selectedProject) return;

    try {
      const review = await getReviewForTender(selectedProject.id);
      // If review is not null, it means review was given
      setHasReview(!!review);
    } catch (err) {
      console.error("Failed to check review status", err);
    }
  };

  useEffect(() => {
    fetchReviewStatus();
  }, [selectedProject]);

  const handleCloseCompleteDialog = () => {
    setIsCompleteDialogOpen(false);
    setCompleteStep(1); // Reset to first step
    setRating(0);
    setComment("");
    setError(null);
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setRating(0);
    setComment("");
    setError(null);
  };

  if (!selectedProject) {
    return (
      <div
        className={`flex flex-col h-full border-l bg-background overflow-hidden ${className}`}
        {...props}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{t("select_a_project")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full border-l bg-background overflow-hidden ${className}`}
      {...props}
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-black">
            {t("project_details")}
          </h3>
          <Card className="mb-6 bg-transparent px-0 border-0 rounded-lg shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center gap-2 text-black">
                <FileText className="w-5 h-5" />
                {selectedProject.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("description")}
                </label>
                <p className="text-sm mt-1 text-gray-800">
                  {selectedProject.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {/* Changed heading to "selected amount" */}
                    {t("selected_amount")}
                  </label>
                  <p className="text-sm font-semibold mt-1 text-gray-800">
                    {/* Display the fetched bid amount */}
                    {bidLoading
                      ? "Loading..."
                      : selectedBidAmount || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("status")}
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(selectedProject.status)}
                    >
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {t("start_date")}
                </label>
                <p className="text-sm mt-1 text-gray-800">
                  {selectedProject.startDate}
                </p>
              </div>
              {selectedProject.awardedTo && (
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {t("awarded_to")}
                  </label>
                  <p className="text-sm mt-1 text-gray-800">
                    {selectedProject.awardedTo.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* Always visible View Details button */}
            <Link
              href={
                profile?.userType !== "business"
                  ? `/dashboard/tender/${selectedProject.id}`
                  : `/business-dashboard/tender/${selectedProject.id}`
              }
            >
              <Button
                className="w-full justify-start rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                variant="default"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t("view_tender_details")}
              </Button>
            </Link>

            {isTenderOwner && isAwarded && (
              <Button
                className="w-full justify-start rounded-lg mt-4 bg-black text-white hover:bg-gray-800"
                variant="default"
                onClick={() => setIsCompleteDialogOpen(true)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("mark_as_completed")}
              </Button>
            )}

            {isTenderOwner && isCompleted && !hasReview && (
              <Button
                className="w-full justify-start rounded-lg bg-green-600 text-white hover:bg-green-700"
                variant="default"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                <Star className="w-4 h-4 mr-2" />
                {t("leave_review")}
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Mark as Complete Dialog (Multi-step) */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={handleCloseCompleteDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          {completeStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>{t("mark_as_completed")}</DialogTitle>
                <DialogDescription>
                  {t("confirm_mark_complete")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseCompleteDialog}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleMarkAsComplete}
                  disabled={loading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {loading ? t("processing") : t("confirm")}
                </Button>
              </DialogFooter>
            </>
          )}

          {completeStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>{t("rate_project_completion")}</DialogTitle>
                <DialogDescription>{t("please_rate_worker")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <label className="text-right w-16">{t("rating")}</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="comment">{t("review")}</label>
                  <Textarea
                    id="comment"
                    placeholder={t("write_your_feedback")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseCompleteDialog}
                  disabled={loading}
                >
                  {t("skip")}
                </Button>
                <Button
                  type="submit"
                  onClick={handleReviewSubmit}
                  disabled={rating === 0 || loading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {loading ? t("submitting") : t("submit_review")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog (Separate dialog for completed projects) */}
      <Dialog open={isReviewDialogOpen} onOpenChange={handleCloseReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("rate_project_completion")}</DialogTitle>
            <DialogDescription>{t("please_rate_worker")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <label className="text-right w-16">{t("rating")}</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="comment">{t("review")}</label>
              <Textarea
                id="comment"
                placeholder={t("write_your_feedback")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReviewDialog}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              onClick={handleReviewSubmit}
              disabled={rating === 0}
              className="bg-black text-white hover:bg-gray-800"
            >
              {t("submit_review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
