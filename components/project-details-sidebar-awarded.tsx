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
  ChevronRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "../lib/hooks/useTranslation";
import { updateTenderStatus } from "@/app/services/tenderService";
import { createReview, getReviewForTender } from "@/app/services/ReviewService";
import { getTenderBids, updateBidStatus } from "@/app/services/BidService";
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
    postedBy: string | { _id: string; email: string; userType?: string };
  } | null;
  getStatusColor: (status: string) => string;
  currentUserId: string;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

export function ProjectDetailsSidebarawarded({
  selectedProject,
  getStatusColor,
  currentUserId,
  setRefresh,
  className,
  ...props
}: ProjectDetailsSidebarProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [completeStep, setCompleteStep] = useState(1);
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
      setCompleteStep(2);
    } catch (err) {
      setError("Failed to mark project as complete");
      console.error(err);
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
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
      setCompleteStep(1);
      setRating(0);
      setComment("");
      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError("Failed to submit review");
      setRefresh((prev) => prev + 1);
      console.error(err);
    }
  };

  const handleCloseCompleteDialog = () => {
    setIsCompleteDialogOpen(false);
    setCompleteStep(1);
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
        className={`flex flex-col h-full overflow-hidden ${className}`}
        {...props}
      >
        <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/40 dark:bg-gray-900/80 dark:border-gray-700/60 dark:shadow-gray-900/40 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t("select_a_project")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className}`}
      {...props}
    >
      <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/40 dark:bg-gray-900/80 dark:border-gray-700/60 dark:shadow-gray-900/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            {t("project_details")}
          </h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Project Title Card */}
            <div className="bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 leading-5">
                {selectedProject.title}
              </h4>

              <div className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("description")}
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Status and Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {t("selected_amount")}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/60 dark:border-gray-700/60">
                      {bidLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16"></div>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {selectedBidAmount || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t("status")}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/60 dark:border-gray-700/60">
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(
                          selectedProject.status
                        )} text-xs px-2 py-1 rounded-full border-0 font-medium`}
                      >
                        {selectedProject.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t("start_date")}
                  </label>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/60 dark:border-gray-700/60">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedProject.startDate.slice(0, 10)}
                    </p>
                  </div>
                </div>

                {/* Awarded By */}
                {selectedProject.awardedTo && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {t("awarded_by")}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/60 dark:border-gray-700/60">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {typeof selectedProject.postedBy === "object"
                          ? selectedProject.postedBy.email
                          : selectedProject.postedBy}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* View Details Button */}
              <Link href={`/business-dashboard/tender-details/${selectedProject.id}`}>
                <Button className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-6 transition-all duration-200 shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="font-medium">
                        {t("view_tender_details")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </Link>

              {/* Mark as Complete Button */}
              {isTenderOwner && isAwarded && (
                <Button
                  className="w-full group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl py-6 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setIsCompleteDialogOpen(true)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="font-medium">
                        {t("mark_as_completed")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              )}

              {/* Leave Review Button */}
              {isTenderOwner && isCompleted && !hasReview && (
                <Button
                  className="w-full group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-6 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setIsReviewDialogOpen(true)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{t("leave_review")}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Mark as Complete Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={handleCloseCompleteDialog}
      >
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          {completeStep === 1 && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-gray-700" />
                  </div>
                  {t("mark_as_completed")}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  {t("confirm_mark_complete")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={handleCloseCompleteDialog}
                  disabled={loading}
                  className="rounded-xl px-6 py-3 border-gray-300 hover:bg-gray-50"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleMarkAsComplete}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl px-6 py-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {t("processing")}
                    </div>
                  ) : (
                    t("confirm")
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {completeStep === 2 && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  {t("rate_project_completion")}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  {t("please_rate_worker")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t("rating")}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                          rating >= star
                            ? "fill-yellow-400 text-yellow-400 scale-110"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="comment"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("review")}
                  </label>
                  <Textarea
                    id="comment"
                    placeholder={t("write_your_feedback")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={handleCloseCompleteDialog}
                  disabled={loading}
                  className="rounded-xl px-6 py-3 border-gray-300 hover:bg-gray-50"
                >
                  {t("skip")}
                </Button>
                <Button
                  type="submit"
                  onClick={handleReviewSubmit}
                  disabled={rating === 0 || loading}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl px-6 py-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {t("submitting")}
                    </div>
                  ) : (
                    t("submit_review")
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog (Separate) */}
      <Dialog open={isReviewDialogOpen} onOpenChange={handleCloseReviewDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              {t("rate_project_completion")}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {t("please_rate_worker")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                {t("rating")}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="comment"
                className="text-sm font-medium text-gray-700"
              >
                {t("review")}
              </label>
              <Textarea
                id="comment"
                placeholder={t("write_your_feedback")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handleCloseReviewDialog}
              className="rounded-xl px-6 py-3 border-gray-300 hover:bg-gray-50"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              onClick={handleReviewSubmit}
              disabled={rating === 0}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl px-6 py-3"
            >
              {t("submit_review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
